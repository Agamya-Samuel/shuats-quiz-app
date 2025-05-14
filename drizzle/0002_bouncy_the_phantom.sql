ALTER TABLE "upload_files" RENAME COLUMN "type" TO "document_type";--> statement-breakpoint
ALTER TABLE "upload_files" RENAME COLUMN "url" TO "file_url";--> statement-breakpoint
ALTER TABLE "upload_files" RENAME COLUMN "size" TO "file_size";--> statement-breakpoint
ALTER TABLE "upload_files" ADD COLUMN "mime_type" varchar(100);--> statement-breakpoint
ALTER TABLE "upload_files" ADD COLUMN "file_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "upload_files" ADD COLUMN "file_key" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "upload_files" ADD COLUMN "verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "upload_files" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "upload_files" ADD COLUMN "updated_at" timestamp DEFAULT now();