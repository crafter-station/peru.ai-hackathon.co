import { relations } from "drizzle-orm/relations";
import { galleryImages, imageLikes } from "./schema";

export const imageLikesRelations = relations(imageLikes, ({one}) => ({
	galleryImage: one(galleryImages, {
		fields: [imageLikes.imageId],
		references: [galleryImages.id]
	}),
}));

export const galleryImagesRelations = relations(galleryImages, ({many}) => ({
	imageLikes: many(imageLikes),
}));