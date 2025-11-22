CREATE TABLE "participant_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"participant_id" text NOT NULL,
	"participant_number" integer NOT NULL,
	"base_badge_url" text,
	"linkedin_variant_url" text,
	"instagram_variant_url" text,
	"twitter_variant_url" text,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "participant_badges_participant_id_unique" UNIQUE("participant_id"),
	CONSTRAINT "participant_badges_participant_number_unique" UNIQUE("participant_number")
);
--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "participant_number" integer;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "badge_generated_at" timestamp;--> statement-breakpoint
ALTER TABLE "participant_badges" ADD CONSTRAINT "participant_badges_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_participant_number_unique" UNIQUE("participant_number");