import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
console.log('Loading environment variables from .env.local');

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { promises as fs } from 'fs';
import * as path from 'path';

import { sendCustomEmail } from '@/lib/email';
import { loadEmailTemplate } from '@/lib/email-template-loader';

import { connectToDB } from '@/db';
import * as dbSchema from '@/db/schema';

async function sendBulkEmails() {
  const EMAIL_TEMPLATE = 'share-quiz-hi';
  const SUBJECT =
    '📣 SHUATS राष्ट्रीय प्रतिभा खोज प्रश्नोत्तरी साझा करें और पुरस्कार प्राप्त करें!';
  const SLEEP_DURATION = 10 * 1000;
  const LOGS_DIR = path.join(process.cwd(), 'logs');

  let successfulSends = 0;
  let failedSends = 0;

  try {
    // Create logs directory if it doesn't exist
    try {
      await fs.mkdir(LOGS_DIR, { recursive: true });
      console.log('Logs directory ensured.');
    } catch (dirError) {
      console.error('Error creating logs directory:', dirError);
      process.exit(1);
    }

    console.log('Starting bulk email sending...');

    // 1. Connect to the database
    let db: NodePgDatabase<typeof dbSchema> | null = null;
    try {
      db = (await connectToDB()) as unknown as NodePgDatabase<typeof dbSchema>;
      console.log('Database connected');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      process.exit(1);
    }

    // 2. Fetch users from the database
    let usersData: { id: number; name: string; email: string }[] = [];
    try {
      usersData = await db
        .select({
          id: dbSchema.users.id,
          name: dbSchema.users.name,
          email: dbSchema.users.email,
        })
        .from(dbSchema.users);
      console.log(`Fetched ${usersData.length} users from the database`);
    } catch (fetchError) {
      console.error('Error fetching users:', fetchError);
      process.exit(1);
    }

    // 3. Load the email EMAIL_template
    let emailTemplate: string | null = null;
    try {
      emailTemplate = await loadEmailTemplate(EMAIL_TEMPLATE, {
        year: new Date().getFullYear(),
      });
      if (!emailTemplate) {
        console.error('Email template not found!');
        process.exit(1);
      }
      console.log('Email template loaded');
    } catch (templateError) {
      console.error('Error loading email template:', templateError);
      process.exit(1);
    }

    // 4. Iterate through users and send emails
    try {
      for (const [index, user] of usersData.entries()) {
        const { name, email } = user;
        console.log(`${'-'.repeat(40)}`);
        if (email == null || email.trim() === '') {
          console.warn(
            `User ${name} (${user.id}) has no email address, skipping.`,
          );
          continue;
        }
        const htmlContent = emailTemplate
          .replace('{{name}}', name)
          .replace('{{year}}', new Date().getFullYear().toString());

        try {
          // Use the sendCustomEmail function or nodemailer directly
          await sendCustomEmail(email, SUBJECT, htmlContent);
          console.log(`${index + 1} - Email sent to ${email}`);
          successfulSends++;
          // sleep for 60 seconds to avoid rate limiting
          console.log(
            `Waiting for ${SLEEP_DURATION / 1000} seconds before sending the next email...`,
          );
          await new Promise((resolve) => setTimeout(resolve, SLEEP_DURATION));
        } catch (sendError) {
          console.error(`Error sending email to ${email}:`, sendError);
          failedSends++;
        }
      }
      // 5. Log success or failure
      await generateSummaryReport(
        EMAIL_TEMPLATE,
        successfulSends,
        failedSends,
        LOGS_DIR,
      );
    } catch (error) {
      console.error('Bulk email sending failed:', error);
      process.exit(1);
    }
    process.exit(0);
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
Email Template Name: ${templateName}
--------------------------------------------------
Status Summary:
  - Emails Sent Successfully: ${successful}
  - Emails Failed to Send: ${failed}
  - Total Emails Processed: ${successful + failed}
--------------------------------------------------
`;

  try {
    await fs.writeFile(logFilePath, reportContent.trim());
    console.log(`Summary report generated at: ${logFilePath}`);
  } catch (error) {
    console.error('Failed to write summary report:', error);
  }
}

sendBulkEmails();
