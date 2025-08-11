DROP TABLE "user_submission_timestamps" CASCADE;--> statement-breakpoint
ALTER TABLE "user_submissions" ADD COLUMN "total_time_spent" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "quiz_started_at" timestamp;