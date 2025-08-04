ALTER TABLE "user_submission_timestamps" ADD COLUMN "total_time_spent" integer;--> statement-breakpoint
ALTER TABLE "user_submission_timestamps" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "user_submission_timestamps" DROP COLUMN "end_time";