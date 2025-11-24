import { db } from "@/lib/db";
import { generateBadge } from "@/lib/generate-badge";
import * as schema from "@/lib/schema";

async function regenerateBadges() {
  if (!db) {
    throw new Error("Database connection not initialized");
  }
  const participants = await db.select().from(schema.participants);
  for (const participant of participants) {
    if (participant.badgeBlobUrl) {
      await generateBadge(participant.id);
    }
  }
}

(async () => {
  await regenerateBadges();
})();
