CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"file_id" uuid,
	"file_name" text,
	"action" text NOT NULL,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"theme" text DEFAULT 'light',
	"ai_enabled" boolean DEFAULT true,
	"auto_tagging" boolean DEFAULT true,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "ai_description" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "ai_suggested_folder" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "content_hash" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "last_accessed_at" timestamp DEFAULT now();