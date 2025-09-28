import { pgTable, serial, text, timestamp, integer, unique } from "drizzle-orm/pg-core";

const defaultUserId = "user_anonymous";

export const anonymousUsers = pgTable("anonymous_users", {
  id: text("id").primaryKey(),
  fingerprint: text("fingerprint"),
  generationsUsed: integer("generations_used").default(0).notNull(),
  maxGenerations: integer("max_generations").default(2).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default(defaultUserId),
  imageUrl: text("image_url").notNull(),
  blobUrl: text("blob_url"),
  prompt: text("prompt").notNull(),
  description: text("description"),
  enhancedPrompt: text("enhanced_prompt"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const imageLikes = pgTable("image_likes", {
  id: serial("id").primaryKey(),
  imageId: integer("image_id").notNull().references(() => galleryImages.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Ensure one like per user per image
  uniqueUserImage: unique().on(table.userId, table.imageId),
}));

export type AnonymousUser = typeof anonymousUsers.$inferSelect;
export type NewAnonymousUser = typeof anonymousUsers.$inferInsert;
export type GalleryImage = typeof galleryImages.$inferSelect & {
  likeCount?: number;
  isLikedByUser?: boolean;
};
export type NewGalleryImage = typeof galleryImages.$inferInsert;
export type ImageLike = typeof imageLikes.$inferSelect;
export type NewImageLike = typeof imageLikes.$inferInsert;
