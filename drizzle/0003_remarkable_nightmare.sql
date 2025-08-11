DROP TABLE "user_submission_timestamps" CASCADE;--> statement-breakpoint
ALTER TABLE "user_submissions" ADD COLUMN "total_time_spent" integer DEFAULT 0;