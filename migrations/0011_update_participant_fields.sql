-- Migration: Update participant fields
-- Remove: dateOfBirth, dietaryPreferences, foodAllergies, tshirtSize
-- Add: ageRange, gender, additionalNotes

-- Drop old columns
ALTER TABLE "participants" DROP COLUMN IF EXISTS "date_of_birth";
ALTER TABLE "participants" DROP COLUMN IF EXISTS "dietary_preferences";
ALTER TABLE "participants" DROP COLUMN IF EXISTS "food_allergies";
ALTER TABLE "participants" DROP COLUMN IF EXISTS "tshirt_size";

-- Add new columns
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "age_range" text;
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "gender" text;
ALTER TABLE "participants" ADD COLUMN IF NOT EXISTS "additional_notes" text;
