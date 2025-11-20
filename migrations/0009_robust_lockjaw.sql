DROP TABLE "participant_badges" CASCADE;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "age_range" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "emergency_contact_name" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "emergency_contact_phone" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "emergency_contact_relationship" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "profile_photo_ai_url" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "badge_blob_url" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "additional_notes" text;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "last_badge_generation_at" timestamp;--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "date_of_birth";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "profile_photo_blob_url";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "dietary_preferences";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "food_allergies";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "tshirt_size";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "last_pixel_art_generation_at";