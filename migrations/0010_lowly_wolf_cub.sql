ALTER TABLE "participants" ADD COLUMN "organization" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "role" text DEFAULT 'PARTICIPANTE';--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "generated_profile_images" text[];--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "twitter_url" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "github_url" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "website_url" text;