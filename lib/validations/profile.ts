import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be 500 characters or less").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid Twitter/X URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

export type ProfileData = z.infer<typeof profileSchema>;
