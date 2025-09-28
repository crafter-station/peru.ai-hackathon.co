CREATE TABLE "anonymous_users" (
	"id" text PRIMARY KEY NOT NULL,
	"fingerprint" text,
	"generations_used" integer DEFAULT 0 NOT NULL,
	"max_generations" integer DEFAULT 2 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery_images" ADD COLUMN "user_id" text DEFAULT 'user_anonymous' NOT NULL;