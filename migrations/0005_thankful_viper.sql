CREATE TABLE "participant_avatars" (
	"id" text PRIMARY KEY NOT NULL,
	"participant_id" text NOT NULL,
	"style" text NOT NULL,
	"image_url" text NOT NULL,
	"blob_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"invited_by" text,
	"clerk_user_id" text,
	"claimed_at" timestamp,
	"dni" text,
	"date_of_birth" timestamp,
	"phone_number" text,
	"profile_photo_url" text,
	"profile_photo_blob_url" text,
	"has_laptop" boolean DEFAULT false,
	"laptop_brand" text,
	"laptop_model" text,
	"laptop_serial_number" text,
	"dietary_preferences" text[],
	"food_allergies" text,
	"tshirt_size" text,
	"tech_stack" text[],
	"experience_level" text,
	"rules_accepted" boolean DEFAULT false,
	"terms_accepted" boolean DEFAULT false,
	"data_consent_accepted" boolean DEFAULT false,
	"media_release_accepted" boolean DEFAULT false,
	"age_verified" boolean DEFAULT false,
	"parental_consent" boolean,
	"registration_status" text DEFAULT 'invited',
	"current_step" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "participants_email_unique" UNIQUE("email"),
	CONSTRAINT "participants_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "participants_dni_unique" UNIQUE("dni")
);
--> statement-breakpoint
CREATE TABLE "social_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"participant_id" text NOT NULL,
	"platform" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "participant_avatars" ADD CONSTRAINT "participant_avatars_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;