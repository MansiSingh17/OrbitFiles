CREATE TABLE "document_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"chunk_text" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"embedding" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
