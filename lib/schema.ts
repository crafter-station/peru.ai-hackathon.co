import { pgTable, text, timestamp, integer, unique, boolean } from "drizzle-orm/pg-core";
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

export const participants = pgTable("participants", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  
  dni: text("dni").unique(),
  ageRange: text("age_range"),
  phoneNumber: text("phone_number"),
  
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelationship: text("emergency_contact_relationship"),
  
  profilePhotoUrl: text("profile_photo_url"),
  profilePhotoAiUrl: text("profile_photo_ai_url"),
  badgeBlobUrl: text("badge_blob_url"),
  hasLaptop: boolean("has_laptop").default(false),
  laptopBrand: text("laptop_brand"),
  laptopModel: text("laptop_model"),
  laptopSerialNumber: text("laptop_serial_number"),
  
  gender: text("gender"),
  techStack: text("tech_stack").array(),
  experienceLevel: text("experience_level"),
  additionalNotes: text("additional_notes"),
  
  rulesAccepted: boolean("rules_accepted").default(false),
  termsAccepted: boolean("terms_accepted").default(false),
  dataConsentAccepted: boolean("data_consent_accepted").default(false),
  mediaReleaseAccepted: boolean("media_release_accepted").default(false),
  ageVerified: boolean("age_verified").default(false),
  parentalConsent: boolean("parental_consent"),
  
  registrationStatus: text("registration_status").default("in_progress"),
  currentStep: integer("current_step").default(1),
  
  participantNumber: integer("participant_number").unique(),
  badgeGeneratedAt: timestamp("badge_generated_at"),
  lastBadgeGenerationAt: timestamp("last_badge_generation_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const participantAvatars = pgTable("participant_avatars", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  participantId: text("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
  style: text("style").notNull(),
  imageUrl: text("image_url").notNull(),
  blobUrl: text("blob_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialPosts = pgTable("social_posts", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  participantId: text("participant_id").notNull().references(() => participants.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;
export type ParticipantAvatar = typeof participantAvatars.$inferSelect;
export type NewParticipantAvatar = typeof participantAvatars.$inferInsert;
export type SocialPost = typeof socialPosts.$inferSelect;
export type NewSocialPost = typeof socialPosts.$inferInsert;
