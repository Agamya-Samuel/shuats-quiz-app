import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
console.log('Loading environment variables from .env.local');

import { connectToDB } from '../db';
import * as dbSchema from '../db/schema';
import { loadEmailTemplate } from '@/lib/email-template-loader';
import { sendCustomEmail } from '@/lib/email';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

async function sendBulkEmails() {
  const subject = '⚠ IMPORTANT: SHUATS National Talent Search Quiz Rescheduled to 12th August, 2025';
  try {
    console.log('Starting bulk email sending...');

    // 1. Connect to the database
    let db: NodePgDatabase<typeof dbSchema> | null = null;
    try {
      db = (await connectToDB()) as unknown as NodePgDatabase<
        typeof dbSchema
      >;
      console.log('Database connected');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      process.exit(1);
    }

    // 2. Fetch users from the database
    let usersData: { id: number; name: string; email: string }[] = [];
    try {
      usersData = await db.select({
        id: dbSchema.users.id,
        name: dbSchema.users.name,
        email: dbSchema.users.email,
      }).from(dbSchema.users);
      console.log(`Fetched ${usersData.length} users from the database`);
    } catch (fetchError) {
      console.error('Error fetching users:', fetchError);
      process.exit(1);
    }

    // 3. Load the email template
    let emailTemplate: string | null = null;
    try {
      emailTemplate = await loadEmailTemplate('reschedule-exam', {
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
        if (email == null || email.trim() === '') {
          console.warn(`User ${name} (${user.id}) has no email address, skipping.`);
          continue;
        }
        const htmlContent = emailTemplate
          .replace('{{studentName}}', name)
          .replace('{{year}}', new Date().getFullYear().toString());

        try {
          // Use the sendCustomEmail function or nodemailer directly
          await sendCustomEmail(email, subject, htmlContent);
          console.log(`${index + 1} - Email sent to ${email}`);
          // sleep for 60 seconds to avoid rate limiting
          console.log(`Waiting for 60 seconds before sending the next email...`);
          await new Promise(resolve => setTimeout(resolve, 60000));
          console.log(`${'-'.repeat(40)}\n`);
        } catch (sendError) {
          console.error(`Error sending email to ${email}:`, sendError);
        }
      }
      // 5. Log success or failure
      console.log('Bulk email sending completed. Check logs for individual email statuses.');
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

sendBulkEmails();