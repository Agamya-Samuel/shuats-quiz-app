import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
console.log('Loading environment variables from .env.local');

import { promises as fs } from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

import { sendCustomEmail } from '@/lib/email';
import { loadEmailTemplate } from '@/lib/email-template-loader';

// Define the structure of the student data read from the file
interface Student {
  'STUDENT NAME': string;
  'EMAIL ID': string;
}

async function sendBulkEmailsFromFile(
  filePath: string,
  template1: string,
  subject1: string,
  template2: string,
  subject2: string,
  startIndex?: number,
) {
  const SLEEP_DURATION = 10 * 1000; // 10 seconds
  const LOGS_DIR = path.join(process.cwd(), 'logs');

  let successfulSends = 0;
  let failedSends = 0;

  try {
    // Create logs directory if it doesn't exist
    await fs.mkdir(LOGS_DIR, { recursive: true });
    console.log('Logs directory ensured.');

    // 1. Read the data from the file
    console.log(`Reading data from ${filePath}...`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const students = XLSX.utils.sheet_to_json<Student>(worksheet);
    console.log(`Found ${students.length} students in the file.`);

    // 2. Load email templates
    const emailTemplate1 = await loadEmailTemplate(template1, {
      year: new Date().getFullYear(),
    });
    const emailTemplate2 = await loadEmailTemplate(template2, {
      year: new Date().getFullYear(),
    });

    if (!emailTemplate1 || !emailTemplate2) {
      console.error('One or both email templates not found!');
      process.exit(1);
    }
    console.log('Email templates loaded.');

    // 3. Iterate through students and send emails
    const studentsToSend = startIndex ? students.slice(startIndex) : students;

    for (const [index, student] of studentsToSend.entries()) {
      const originalIndex = (startIndex || 0) + index;
      const name = student['STUDENT NAME'];
      const email = student['EMAIL ID'];

      console.log(`${'-'.repeat(40)}`);
      console.log(
        `Processing ${originalIndex + 1}/${
          students.length
        }: ${name} (${email})`,
      );

      if (!email || email.trim() === '') {
        console.warn(`Student ${name} has no email address, skipping.`);
        continue;
      }

      try {
        // Send first email
        const htmlContent1 = emailTemplate1.replace(/{{name}}/g, name);
        await sendCustomEmail(email, subject1, htmlContent1);
        console.log(`- Email 1 sent to ${email}`);

        // Wait before sending the second email
        console.log(
          `Waiting for ${
            SLEEP_DURATION / 5000
          } seconds before sending the second email...`,
        );
        await new Promise((resolve) => setTimeout(resolve, SLEEP_DURATION / 5));

        // Send second email
        const htmlContent2 = emailTemplate2.replace(/{{name}}/g, name);
        await sendCustomEmail(email, subject2, htmlContent2);
        console.log(`- Email 2 sent to ${email}`);

        successfulSends++;
      } catch (sendError) {
        console.error(`Error sending email to ${email}:`, sendError);
        failedSends++;
      }

      // sleep to avoid rate limiting
      console.log(
        `Waiting for ${
          SLEEP_DURATION / 1000
        } seconds before sending the next email...`,
      );
      await new Promise((resolve) => setTimeout(resolve, SLEEP_DURATION));
    }

    // 4. Log summary report
    await generateSummaryReport(
      `${template1}_${template2}`,
      successfulSends,
      failedSends,
      LOGS_DIR,
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
}

async function generateSummaryReport(
  templateName: string,
  successful: number,
  failed: number,
  logsDir: string,
) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logFileName = `${templateName}-bulk-email-report-${timestamp}.log`;
  const logFilePath = path.join(logsDir, logFileName);

  const reportContent = `
Report Generation Timestamp: ${new Date().toISOString()}
Email Template Names: ${templateName}
--------------------------------------------------
Status Summary:
  - Students Processed Successfully: ${successful}
  - Students Failed: ${failed}
  - Total Students: ${successful + failed}
--------------------------------------------------
`;

  try {
    await fs.writeFile(logFilePath, reportContent.trim());
    console.log(`Summary report generated at: ${logFilePath}`);
  } catch (error) {
    console.error('Failed to write summary report:', error);
  }
}

// --- Main Execution ---
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 5 || args.length > 6) {
    console.error(
      'Usage: yarn mail:bulk-xl <filePath> <template1> <subject1> <template2> <subject2> [startIndex]',
    );
    process.exit(1);
  }

  const [filePath, template1, subject1, template2, subject2, startIndexStr] =
    args;
  const startIndex = startIndexStr ? parseInt(startIndexStr, 10) : undefined;

  if (startIndex !== undefined && isNaN(startIndex)) {
    console.error('Error: startIndex must be a valid number.');
    process.exit(1);
  }

  await sendBulkEmailsFromFile(
    filePath,
    template1,
    subject1,
    template2,
    subject2,
    startIndex,
  );
  process.exit(0);
}

main();
