ALTER TABLE "participants" ALTER COLUMN "clerk_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ALTER COLUMN "registration_status" SET DEFAULT 'in_progress';--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "invited_at";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "invited_by";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "claimed_at";