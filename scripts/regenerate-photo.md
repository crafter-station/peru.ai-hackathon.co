import { generatePixelArt } from "@/app/api/onboarding/upload-photo/route";
import { db } from "@/lib/db";

async function regeneratePhoto() {
  if (!db) {
    throw new Error("Database connection not initialized");
  }
  const participants = [
    {
      id: "BPU4m2vbHZCV6NF41aLyM",
      photoUrl:
        "https://26evcbcedv5nczlx.public.blob.vercel-storage.com/ai-profile-photos/Frame%202.png",
    },
  ];
  for (const participant of participants) {
    await generatePixelArt(participant.id, participant.photoUrl);
  }
}

(async () => {
  await regeneratePhoto();
})();
