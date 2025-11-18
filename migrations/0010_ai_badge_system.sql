ALTER TABLE "participants" RENAME COLUMN "last_pixel_art_generation_at" TO "last_badge_generation_at";
ALTER TABLE "participants" DROP COLUMN "profile_photo_blob_url";
ALTER TABLE "participants" ADD COLUMN "badge_blob_url" text;
DROP TABLE IF EXISTS "participant_badges";
