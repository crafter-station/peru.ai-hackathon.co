UPDATE "participants" 
SET "profile_photo_ai_url" = "pixel_art_url" 
WHERE "profile_photo_ai_url" IS NULL AND "pixel_art_url" IS NOT NULL;

ALTER TABLE "participants" DROP COLUMN "pixel_art_url";
