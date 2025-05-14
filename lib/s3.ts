import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	ObjectCannedACL,
} from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION || 'us-east-1',
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
	},
	forcePathStyle: false, // Required for DigitalOcean Spaces
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

/**
 * Uploads a file to S3
 * @param fileBuffer - The file buffer to upload
 * @param key - The key (path) where the file will be stored in S3
 * @param contentType - The content type of the file
 * @returns The URL of the uploaded file
 */
export async function uploadToS3(
	fileBuffer: Buffer,
	key: string,
	contentType: string
): Promise<string> {
	try {
		const params = {
			Bucket: BUCKET_NAME,
			Key: key,
			Body: fileBuffer,
			ContentType: contentType,
			ACL: 'public-read' as ObjectCannedACL, // Make file publicly readable
		};

		const command = new PutObjectCommand(params);
		await s3Client.send(command);

		// If CDN URL is configured, use it for the file URL
		if (process.env.CDN_S3_ORIGIN_URL) {
			return `${process.env.CDN_S3_ORIGIN_URL}/${key}`;
		}

		// Fallback to direct S3 URL if no CDN is configured
		return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`;
	} catch (error) {
		console.error('Error uploading to S3:', error);
		throw new Error('Failed to upload file to S3');
	}
}

/**
 * Deletes a file from S3
 * @param key - The key (path) of the file to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
	try {
		const params = {
			Bucket: BUCKET_NAME,
			Key: key,
		};

		const command = new DeleteObjectCommand(params);
		await s3Client.send(command);
	} catch (error) {
		console.error('Error deleting from S3:', error);
		throw new Error('Failed to delete file from S3');
	}
}

/**
 * Generates a unique key for S3 storage
 * @param userId - The user ID
 * @param documentType - The type of document
 * @param fileExtension - The file extension
 * @returns A unique key for S3 storage
 */
export function generateS3Key(
	userId: number,
	documentType: string,
	fileExtension: string
): string {
	const timestamp = Date.now();
	return `documents/${userId}/${documentType
		.toLowerCase()
		.replace(/\s+/g, '-')}-${timestamp}.${fileExtension}`;
}
