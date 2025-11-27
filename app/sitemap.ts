import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { isNotNull } from "drizzle-orm";

const BASE_URL = "https://peru.ai-hackathon.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const completedParticipants = await db
    .select({
      participantNumber: participants.participantNumber,
      updatedAt: participants.updatedAt,
    })
    .from(participants)
    .where(isNotNull(participants.completedAt));

  const participantUrls: MetadataRoute.Sitemap = completedParticipants
    .filter((p) => p.participantNumber !== null)
    .map((participant) => ({
      url: `${BASE_URL}/p/${participant.participantNumber}`,
      lastModified: participant.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/workshops`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tta`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/participants`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...staticPages, ...participantUrls];
}
