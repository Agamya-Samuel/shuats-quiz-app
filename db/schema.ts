import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	serial,
	varchar,
	timestamp,
	integer,
	jsonb,
	index,
	boolean,
} from 'drizzle-orm/pg-core';
import { IOption } from '@/types/question';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

//! #########################################################
//! TABLE SCHEMAS
//! #########################################################

// Addresses table
export const addresses = pgTable('addresses', {
	id: serial('id').primaryKey(),
	country: varchar('country', { length: 100 }),
	address1: text('address1'),
	address2: text('address2'),
	area: varchar('area', { length: 100 }),
	city: varchar('city', { length: 100 }),
	pincode: varchar('pincode', { length: 10 }),
	state: varchar('state', { length: 100 }),
});

// Users table
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	email: varchar('email', { length: 100 }).notNull().unique(),
	password: text('password').notNull(),
	avatar: text('avatar'),
	addressId: integer('address_id').references(() => addresses.id, {
		onDelete: 'set null',
	}),
	mobile: varchar('mobile', { length: 15 }).notNull().unique(),
	school: varchar('school', { length: 100 }).notNull(),
	rollno: varchar('rollno', { length: 50 }).notNull(),
	branch: varchar('branch', { length: 100 }).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Admins table
export const admins = pgTable('admins', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 100 }).notNull().unique(),
	password: text('password').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Upload files table
export const uploadFiles = pgTable('upload_files', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id),
	// document_type should be one of: 'profile_pic', 'aadhar', '12th_marksheet', '10th_marksheet'
	// This check is enforced at the application level
	documentType: varchar('document_type', { length: 100 }).notNull(),
	mimeType: varchar('mime_type', { length: 100 }),
	fileUrl: text('file_url').notNull(),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	fileKey: varchar('file_key', { length: 255 }).notNull(), // S3 key for deletion
	fileSize: varchar('file_size', { length: 100 }),
	verified: boolean('verified').default(false),
	rejected: boolean('rejected').default(false),
	rejectionReason: text('rejection_reason'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Questions table
export const questions = pgTable('questions', {
	id: serial('id').primaryKey(),
	question: text('question').notNull(),
	options: jsonb('options').$type<IOption[]>().notNull(),
	subject: varchar('subject', { length: 100 }).notNull(),
	// Subject should be one of: 'Arithmatic', 'Reasoning', 'Computer Aptitude', 'General Knowledge'
	// This check is enforced at the application level
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// Correct answers table
export const correctAnswers = pgTable('correct_answers', {
	id: serial('id').primaryKey(),
	questionId: integer('question_id').references(() => questions.id, {
		onDelete: 'cascade',
	}),
	correctOption: text('correct_option').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

// User submissions table
export const userSubmissions = pgTable(
	'user_submissions',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id').references(() => users.id, {
			onDelete: 'cascade',
		}),
		questionId: integer('question_id').references(() => questions.id, {
			onDelete: 'cascade',
		}),
		option: text('option').notNull(),
	},
	(table) => ({
		userQuestionIndex: index('user_question_idx').on(
			table.userId,
			table.questionId
		),
	})
);

// User submission timestamps table - to track when a user starts and completes a submission
export const userSubmissionTimestamps = pgTable('user_submission_timestamps', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id, {
		onDelete: 'cascade',
	}),
	userSubmissionId: integer('user_submission_id').references(
		() => userSubmissions.id,
		{
			onDelete: 'cascade',
		}
	),
	startTime: timestamp('start_time').notNull().defaultNow(),
	endTime: timestamp('end_time'),
	createdAt: timestamp('created_at').defaultNow(),
});

//! #########################################################
//! RELATIONS
//! #########################################################

export const addressesRelations = relations(addresses, ({ many }) => ({
	users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
	address: one(addresses, {
		fields: [users.addressId],
		references: [addresses.id],
	}),
	submissions: many(userSubmissions),
	uploads: many(uploadFiles),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
	correctAnswer: one(correctAnswers, {
		fields: [questions.id],
		references: [correctAnswers.questionId],
	}),
	submissions: many(userSubmissions),
}));

export const correctAnswersRelations = relations(correctAnswers, ({ one }) => ({
	question: one(questions, {
		fields: [correctAnswers.questionId],
		references: [questions.id],
	}),
}));

export const userSubmissionsRelations = relations(
	userSubmissions,
	({ one, many }) => ({
		user: one(users, {
			fields: [userSubmissions.userId],
			references: [users.id],
		}),
		question: one(questions, {
			fields: [userSubmissions.questionId],
			references: [questions.id],
		}),
		timestamps: many(userSubmissionTimestamps),
	})
);

export const userSubmissionTimestampsRelations = relations(
	userSubmissionTimestamps,
	({ one }) => ({
		user: one(users, {
			fields: [userSubmissionTimestamps.userId],
			references: [users.id],
		}),
		submission: one(userSubmissions, {
			fields: [userSubmissionTimestamps.userSubmissionId],
			references: [userSubmissions.id],
		}),
	})
);

export const uploadFilesRelations = relations(uploadFiles, ({ one }) => ({
	user: one(users, {
		fields: [uploadFiles.userId],
		references: [users.id],
	}),
}));

//! #########################################################
//! DOCUMENT SCHEMAS
//! #########################################################

// Schemas for document validation and type safety
export const insertUploadFileSchema = createInsertSchema(uploadFiles, {
	documentType: z.string().min(1).max(100),
	fileUrl: z.string().url(),
	fileName: z.string().min(1).max(255),
	fileKey: z.string().min(1).max(255),
	fileSize: z.string().optional(),
	mimeType: z.string().optional(),
});

export const selectUploadFileSchema = createSelectSchema(uploadFiles);

export type UploadFileType = z.infer<typeof selectUploadFileSchema>;
export type NewUploadFile = z.infer<typeof insertUploadFileSchema>;

// Convenience types for document operations
export type UploadFileTypeString =
	| '10th_marksheet'
	| '12th_marksheet'
	| 'aadhar'
	| 'profile_pic'
	| 'other';
