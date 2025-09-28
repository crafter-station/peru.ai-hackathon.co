CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"blob_url" text,
	"prompt" text NOT NULL,
	"description" text,
	"enhanced_prompt" text,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
