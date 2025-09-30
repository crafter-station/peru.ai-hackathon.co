import { pgTable, text, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const defaultUserId = "user_anonymous";

export const anonymousUsers = pgTable("anonymous_users", {
  id: text("id").primaryKey(),
  fingerprint: text("fingerprint"),
  generationsUsed: integer("generations_used").default(0).notNull(),
  maxGenerations: integer("max_generations").default(2).notNull(),
  lastGenerationAt: timestamp("last_generation_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
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
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  imageId: text("image_id").notNull().references(() => galleryImages.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Ensure one like per user per image
  uniqueUserImage: unique().on(table.userId, table.imageId),
}));

export const ipRateLimits = pgTable("ip_rate_limits", {
  ipAddress: text("ip_address").primaryKey(),
  generationsUsed: integer("generations_used").default(0).notNull(),
  maxGenerations: integer("max_generations").default(10).notNull(),
  resetAt: timestamp("reset_at").notNull(),
  lastGenerationAt: timestamp("last_generation_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AnonymousUser = typeof anonymousUsers.$inferSelect;
export type NewAnonymousUser = typeof anonymousUsers.$inferInsert;
export type GalleryImage = typeof galleryImages.$inferSelect & {
  likeCount?: number;
  isLikedByUser?: boolean;
};
export type NewGalleryImage = typeof galleryImages.$inferInsert;
export type ImageLike = typeof imageLikes.$inferSelect;
export type NewImageLike = typeof imageLikes.$inferInsert;
export type IpRateLimit = typeof ipRateLimits.$inferSelect;
export type NewIpRateLimit = typeof ipRateLimits.$inferInsert;
