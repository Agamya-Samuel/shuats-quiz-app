import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
console.log('Loading environment variables from .env.local');

import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { connectToDB } from '../db';
import * as dbSchema from '../db/schema';


// Check for --dry-run argument
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log('--- DRY RUN MODE ---');
  console.log('No changes will be made to the database.');
}

async function updateFileUrls() {
  console.log('Starting script to update file URLs...');

  const { CDN_S3_ORIGIN_URL } = process.env;

  if (!CDN_S3_ORIGIN_URL) {
    console.error('Error: CDN_S3_ORIGIN_URL environment variable is not set.');
    process.exit(1);
  }

  let db: NodePgDatabase<typeof dbSchema> | null = null;
  try {
    db = (await connectToDB()) as unknown as NodePgDatabase<typeof dbSchema>;
    console.log('Database connected');
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    process.exit(1);
  }

  try {
    await db.transaction(async (tx) => {
      console.log('Fetching files from the database...');
      const files = await tx.select().from(dbSchema.uploadFiles);
      console.log(`Found ${files.length} files to process.`);

      if (files.length === 0) {
        console.log('No files to update.');
        return;
      }

      for (const [index, file] of files.entries()) {
        console.log(`${'-'.repeat(20)}`);
        console.log(
          `Processing file ${index + 1}) \nID- ${file.id},\nfileKey- ${file.fileKey}`,
        );

        // Skip files that do not have a fileKey
        if (!file.fileKey) {
          console.warn(`File ID ${file.id} has no fileKey, skipping update.`);
          continue;
        }

        // Skip files that are Google OAuth avatars
        if (file.fileKey.startsWith('google_oauth_avatar')) {
          console.warn(
            `File ID ${file.id} is a Google OAuth avatar, skipping update.`,
          );
          continue;
        }

        // Check if the fileKey starts with the old CDN URL, then update
        if (file.fileUrl.startsWith('https://dcsit-cdn.shuats.tech')) {
          // Construct the new file URL
          const newFileUrl = `${CDN_S3_ORIGIN_URL}/${file.fileKey}`;

          if (file.fileUrl !== newFileUrl) {
            console.log(`\nUpdating file ID: ${file.id}`);
            console.log(`  File Key: ${file.fileKey}`);
            console.log(`  Old URL: ${file.fileUrl}`);
            console.log(`  New URL: ${newFileUrl}`);
            if (!isDryRun) {
              await tx
                .update(dbSchema.uploadFiles)
                .set({ fileUrl: newFileUrl })
                .where(eq(dbSchema.uploadFiles.id, file.id));
              console.log(`  Status: Updated`);
            } else {
              console.log(`  Status: Skipped (Dry Run)`);
            }
          } else {
            console.log(`\nSkipping file ID: ${file.id}`);
            console.log(`  File Key: ${file.fileKey}`);
            console.log(`  URL is already correct: ${file.fileUrl}`);
          }
        }
      }

      if (isDryRun) {
        console.log('\n--- DRY RUN COMPLETE ---');
        // console.log('Rolling back transaction. No changes were made.');
        // tx.rollback();
      }
    });
    if (!isDryRun) {
      console.log('\nAll file URLs have been updated successfully.');
    }
  } catch (error) {
    console.error('An error occurred during the update process:', error);
    process.exit(1);
  }
  process.exit(0);
}

updateFileUrls();
