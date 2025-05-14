'use server';

import { uploadToS3, generateS3Key } from '@/lib/s3';
import { connectToDB } from '@/db';
import { uploadFiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth } from '@/lib/dal';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as dbSchema from '@/db/schema';

export async function uploadDocument(formData: FormData) {
	try {
		// Verify authentication
		const user = await verifyAuth('user');
		if (!user) {
			throw new Error('User not authenticated');
		}

		const userId = user.userId;
		if (!userId) {
			throw new Error('User ID not found');
		}

		// Get file from formData
		const file = formData.get('file') as File;
		if (!file) {
			throw new Error('No file provided');
		}

		// Get document type from formData
		const documentType = formData.get('documentType') as string;
		if (!documentType) {
			throw new Error('Document type not provided');
		}

		// Extract file extension
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop()?.toLowerCase();

		if (!fileExtension) {
			throw new Error('Invalid file extension');
		}

		// Convert File to Buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Generate S3 key
		const key = generateS3Key(userId, documentType, fileExtension);

		// Upload to S3
		const fileUrl = await uploadToS3(buffer, key, file.type);

		// Determine category based on document type
		let documentTypeKey = 'other';
		if (documentType.toLowerCase().includes('aadhar')) {
			documentTypeKey = 'aadhar';
		} else if (
			documentType.toLowerCase().includes('10th') ||
			documentType.toLowerCase().includes('marksheet10')
		) {
			documentTypeKey = '10th_marksheet';
		} else if (
			documentType.toLowerCase().includes('12th') ||
			documentType.toLowerCase().includes('marksheet12')
		) {
			documentTypeKey = '12th_marksheet';
		} else if (
			documentType.toLowerCase().includes('photo') ||
			documentType.toLowerCase() === 'profile photo'
		) {
			documentTypeKey = 'profile_pic';
		}

		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Save document info to database
		await db.insert(uploadFiles).values({
			userId,
			documentType: documentTypeKey,
			fileUrl,
			fileName,
			fileKey: key,
			fileSize: file.size.toString(),
			mimeType: file.type,
			verified: false,
			rejected: false,
		});

		// Return the success response
		return {
			success: true,
			fileUrl,
			documentInfo: {
				documentType: documentTypeKey,
				fileUrl,
				fileName,
				uploaded: true,
				verified: false,
				rejected: false,
			},
		};
	} catch (error) {
		console.error('Error in uploadDocument:', error);
		return { success: false, error: (error as Error).message };
	}
}

export async function getUserDocuments() {
	try {
		// Verify authentication
		const user = await verifyAuth('user');
		if (!user) {
			return { success: false, error: 'User not authenticated' };
		}

		const userId = user.userId;
		if (!userId) {
			return { success: false, error: 'User ID not found' };
		}

		// Connect to the database
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;

		// Fetch documents for the user
		const userDocuments = await db
			.select()
			.from(uploadFiles)
			.where(eq(uploadFiles.userId, userId));

		// Return the user documents
		return {
			success: true,
			documents: userDocuments.map((doc) => ({
				id: doc.id,
				documentType: doc.documentType,
				fileUrl: doc.fileUrl,
				fileName: doc.fileName,
				fileSize: doc.fileSize,
				uploaded: true, // uploadFiles table doesn't have an 'uploaded' field, but files in DB are uploaded
				verified: doc.verified ?? false,
				rejected: doc.rejected ?? false,
				rejectionReason: doc.rejectionReason,
				createdAt: doc.createdAt,
			})),
		};
	} catch (error) {
		console.error('Error in getUserDocuments:', error);
		return { success: false, error: (error as Error).message };
	}
}
