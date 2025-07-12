/**
 * @fileoverview Transfers all objects from a source S3-compatible bucket to a destination S3-compatible bucket.
 *
 * @description
 * This script connects to two S3-compatible object storage services, lists all objects
 * in the source bucket, and transfers them to the destination bucket. It preserves
 * the object keys (folder structure) and content types.
 *
 * The script is designed to be efficient and robust, using streaming for large files,
 * concurrency to speed up transfers, and comprehensive error handling.
 *
 * @requires dotenv - To load environment variables from a .env file.
 * @requires @aws-sdk/client-s3 - The AWS SDK for S3.
 *
 * @environment
 * The following environment variables must be set in a `.env` file:
 *
 * # Source S3 Configuration
 * SOURCE_S3_ENDPOINT="your-source-endpoint"
 * SOURCE_S3_REGION="your-source-region"
 * SOURCE_S3_ACCESS_KEY_ID="your-source-access-key"
 * SOURCE_S3_SECRET_ACCESS_KEY="your-source-secret-key"
 * SOURCE_S3_BUCKET_NAME="your-source-bucket-name"
 *
 * # Destination S3 Configuration
 * DESTINATION_S3_ENDPOINT="your-destination-endpoint"
 * DESTINATION_S3_REGION="your-destination-region"
 * DESTINATION_S3_ACCESS_KEY_ID="your-destination-access-key"
 * DESTINATION_S3_SECRET_ACCESS_KEY="your-destination-secret-key"
 * DESTINATION_S3_BUCKET_NAME="your-destination-bucket-name"
 *
 * @execution
 * To run this script, use the following command from the project root:
 * npx ts-node --require dotenv/config scripts/transfer-s3-data.ts
 */

import * as dotenv from "dotenv";
dotenv.config({path: '.env.local'}); // Load environment variables from .env.local

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  _Object,
} from "@aws-sdk/client-s3";
import { createS3Client } from "../lib/s3";
import { Readable } from "stream";

// --- Configuration ---

/**
 * The maximum number of concurrent file transfers.
 * Adjust this value based on your network and the S3 provider's rate limits.
 */
// --- Main Transfer Logic ---

/**
 * The main function that orchestrates the S3 data transfer.
 */
async function main() {
  console.log("Starting S3 data transfer script...");

  // 1. Load and validate environment variables
  const config = loadConfig();
  if (!config) {
    process.exit(1);
    return;
  }

  // 2. Create S3 clients for source and destination
  const sourceS3 = createS3Client(
    config.source.accessKeyId,
    config.source.secretAccessKey,
    config.source.region,
    config.source.endpoint
  );

  const destinationS3 = createS3Client(
    config.destination.accessKeyId,
    config.destination.secretAccessKey,
    config.destination.region,
    config.destination.endpoint
  );

  let errorOccurred = false;
  let transferredCount = 0;
  let totalObjects = 0;

  try {
    // 3. List all objects in the source bucket
    console.log(`Listing objects in source bucket: ${config.source.bucketName}`);
    const objects = await listAllObjects(sourceS3, config.source.bucketName);
    totalObjects = objects.length;
    console.log(`Found ${totalObjects} objects to transfer.`);

    // 4. Process objects sequentially
    for (const obj of objects) {
      if (!obj || !obj.Key) continue;

      try {
        await transferObject(
          sourceS3,
          destinationS3,
          config.source.bucketName,
          config.destination.bucketName,
          obj
        );
        transferredCount++;
        console.log(
          `[${transferredCount}/${totalObjects}] Successfully transferred: ${obj.Key}`
        );
      } catch (err) {
        console.error(`[ERROR] Failed to transfer ${obj.Key}:`, err);
        errorOccurred = true;
      }
    }
  } catch (error) {
    console.error("A critical error occurred:", error);
    errorOccurred = true;
  } finally {
    console.log("\n--- Transfer Summary ---");
    console.log(`Total objects found: ${totalObjects}`);
    console.log(`Successfully transferred: ${transferredCount}`);
    if (errorOccurred) {
      console.error(
        "Some files failed to transfer. Please check the logs above."
      );
      process.exit(1);
    } else if (transferredCount < totalObjects) {
      console.error(
        `Only ${transferredCount} out of ${totalObjects} objects were transferred.`
      );
      process.exit(1);
    } else {
      console.log("All objects transferred successfully.");
      process.exit(0);
    }
  }
}

/**
 * Loads and validates the required configuration from environment variables.
 * @returns The configuration object or null if validation fails.
 */
function loadConfig() {
  const requiredVars = [
    "SOURCE_S3_ENDPOINT",
    "SOURCE_S3_REGION",
    "SOURCE_S3_ACCESS_KEY_ID",
    "SOURCE_S3_SECRET_ACCESS_KEY",
    "SOURCE_S3_BUCKET_NAME",
    "DESTINATION_S3_ENDPOINT",
    "DESTINATION_S3_REGION",
    "DESTINATION_S3_ACCESS_KEY_ID",
    "DESTINATION_S3_SECRET_ACCESS_KEY",
    "DESTINATION_S3_BUCKET_NAME",
  ];

  for (const v of requiredVars) {
    if (!process.env[v]) {
      console.error(`Missing required environment variable: ${v}`);
      return null;
    }
  }

  return {
    source: {
      endpoint: process.env.SOURCE_S3_ENDPOINT!,
      region: process.env.SOURCE_S3_REGION!,
      accessKeyId: process.env.SOURCE_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.SOURCE_S3_SECRET_ACCESS_KEY!,
      bucketName: process.env.SOURCE_S3_BUCKET_NAME!,
    },
    destination: {
      endpoint: process.env.DESTINATION_S3_ENDPOINT!,
      region: process.env.DESTINATION_S3_REGION!,
      accessKeyId: process.env.DESTINATION_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.DESTINATION_S3_SECRET_ACCESS_KEY!,
      bucketName: process.env.DESTINATION_S3_BUCKET_NAME!,
    },
  };
}

/**
 * Lists all objects in an S3 bucket, handling pagination automatically.
 * @param s3 - The S3 client instance.
 * @param bucketName - The name of the bucket to list objects from.
 * @returns A promise that resolves to an array of S3 objects.
 */
async function listAllObjects(
  s3: S3Client,
  bucketName: string
): Promise<_Object[]> {
  let allObjects: _Object[] = [];
  let isTruncated = true;
  let continuationToken: string | undefined;

  while (isTruncated) {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
    });
    const response = await s3.send(command);

    if (response.Contents) {
      allObjects = allObjects.concat(response.Contents);
    }

    isTruncated = response.IsTruncated ?? false;
    continuationToken = response.NextContinuationToken;
  }

  return allObjects;
}

/**
 * Transfers a single object from the source to the destination bucket using streaming.
 * @param sourceS3 - The source S3 client.
 * @param destinationS3 - The destination S3 client.
 * @param sourceBucket - The source bucket name.
 * @param destinationBucket - The destination bucket name.
 * @param obj - The S3 object to transfer.
 */
async function transferObject(
  sourceS3: S3Client,
  destinationS3: S3Client,
  sourceBucket: string,
  destinationBucket: string,
  obj: _Object
) {
  if (!obj.Key) {
    throw new Error("Object key is missing.");
  }

  // Get the object from the source bucket
  const getObjectCommand = new GetObjectCommand({
    Bucket: sourceBucket,
    Key: obj.Key,
  });
  const getObjectResponse = await sourceS3.send(getObjectCommand);

  if (!getObjectResponse.Body || !(getObjectResponse.Body instanceof Readable)) {
    throw new Error(`Could not get readable stream for object: ${obj.Key}`);
  }

  // Read the stream into a buffer to ensure ContentLength is handled correctly.
  const bodyBuffer = await getObjectResponse.Body.transformToByteArray();

  // Put the object into the destination bucket
  const putObjectCommand = new PutObjectCommand({
    Bucket: destinationBucket,
    Key: obj.Key,
    Body: bodyBuffer,
    ContentType: getObjectResponse.ContentType,
    ContentLength: obj.Size,
  });

  await destinationS3.send(putObjectCommand);
}

// --- Script Execution ---

main().catch((err) => {
  console.error("An unexpected error terminated the script:", err);
  process.exit(1);
});