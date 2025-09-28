-- Drop foreign key constraints first
ALTER TABLE "image_likes" DROP CONSTRAINT IF EXISTS "image_likes_image_id_gallery_images_id_fk";

-- Drop existing data to avoid conflicts during type conversion
TRUNCATE TABLE "image_likes" CASCADE;
TRUNCATE TABLE "gallery_images" CASCADE;

-- Convert gallery_images.id to text
ALTER TABLE "gallery_images" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "gallery_images" ALTER COLUMN "id" TYPE text USING "id"::text;

-- Convert image_likes.id to text  
ALTER TABLE "image_likes" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "image_likes" ALTER COLUMN "id" TYPE text USING "id"::text;

-- Convert image_likes.image_id to text to match gallery_images.id
ALTER TABLE "image_likes" ALTER COLUMN "image_id" TYPE text USING "image_id"::text;

-- Recreate the foreign key constraint with correct types
ALTER TABLE "image_likes" ADD CONSTRAINT "image_likes_image_id_gallery_images_id_fk" 
  FOREIGN KEY ("image_id") REFERENCES "gallery_images"("id") ON DELETE CASCADE;
