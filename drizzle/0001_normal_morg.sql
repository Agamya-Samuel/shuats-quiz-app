CREATE TABLE "user_submission_timestamps" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"user_submission_id" integer,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "subject" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "user_submission_timestamps" ADD CONSTRAINT "user_submission_timestamps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_submission_timestamps" ADD CONSTRAINT "user_submission_timestamps_user_submission_id_user_submissions_id_fk" FOREIGN KEY ("user_submission_id") REFERENCES "public"."user_submissions"("id") ON DELETE cascade ON UPDATE no action;