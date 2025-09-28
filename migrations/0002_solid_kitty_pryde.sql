CREATE TABLE "image_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "image_likes_user_id_image_id_unique" UNIQUE("user_id","image_id")
);
--> statement-breakpoint
ALTER TABLE "image_likes" ADD CONSTRAINT "image_likes_image_id_gallery_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."gallery_images"("id") ON DELETE cascade ON UPDATE no action;