import { pgTable, text, integer, timestamp, foreignKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const anonymousUsers = pgTable("anonymous_users", {
	id: text().primaryKey().notNull(),
	fingerprint: text(),
	generationsUsed: integer("generations_used").default(0).notNull(),
	maxGenerations: integer("max_generations").default(2).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const galleryImages = pgTable("gallery_images", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").default('user_anonymous').notNull(),
	imageUrl: text("image_url").notNull(),
	blobUrl: text("blob_url"),
	prompt: text().notNull(),
	description: text(),
	enhancedPrompt: text("enhanced_prompt"),
	width: integer(),
	height: integer(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const imageLikes = pgTable("image_likes", {
	id: text().primaryKey().notNull(),
	imageId: text("image_id").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.imageId],
			foreignColumns: [galleryImages.id],
			name: "image_likes_image_id_gallery_images_id_fk"
		}).onDelete("cascade"),
	unique("image_likes_user_id_image_id_unique").on(table.imageId, table.userId),
]);
