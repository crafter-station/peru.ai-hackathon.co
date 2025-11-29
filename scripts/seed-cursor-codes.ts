import { readFileSync } from "fs";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";

async function seedCursorCodes() {
  console.log("🌱 Starting cursor codes seeding...");

  const csvPath = "/Users/cris/Downloads/cursor_codes.csv";
  
  let csvContent: string;
  try {
    csvContent = readFileSync(csvPath, "utf-8");
  } catch (error) {
    console.error(`❌ Error reading CSV file: ${csvPath}`);
    console.error(error);
    process.exit(1);
  }

  const lines = csvContent.trim().split("\n");
  const codes: string[] = [];

  for (const line of lines) {
    const url = line.trim();
    if (!url) continue;

    const match = url.match(/code=([A-Z0-9]+)/);
    if (match && match[1]) {
      codes.push(match[1]);
    }
  }

  console.log(`📋 Found ${codes.length} codes in CSV`);

  if (codes.length === 0) {
    console.error("❌ No codes found in CSV file");
    process.exit(1);
  }

  if (!db) {
    console.error("❌ Database not configured");
    process.exit(1);
  }

  const allParticipants = await db.query.participants.findMany();

  const participantParticipants = allParticipants.filter(
    (p) => p.role === "PARTICIPANT"
  );

  console.log(`👥 Found ${participantParticipants.length} participants`);

  const participantsWithoutCode = participantParticipants.filter(
    (p) => !p.cursorCode
  );

  console.log(
    `📝 Found ${participantsWithoutCode.length} participants without codes`
  );

  if (participantsWithoutCode.length === 0) {
    console.log("✅ All participants already have codes assigned");
    process.exit(0);
  }

  if (codes.length < participantsWithoutCode.length) {
    console.warn(
      `⚠️  Warning: Only ${codes.length} codes available for ${participantsWithoutCode.length} participants`
    );
  }

  let assigned = 0;
  const codesToAssign = codes.slice(0, participantsWithoutCode.length);

  for (let i = 0; i < participantsWithoutCode.length && i < codes.length; i++) {
    const participant = participantsWithoutCode[i];
    const code = codesToAssign[i];

    try {
      await db
        .update(participants)
        .set({ cursorCode: code })
        .where(eq(participants.id, participant.id));

      assigned++;
      console.log(
        `✅ Assigned code ${code} to participant ${participant.participantNumber || participant.id}`
      );
    } catch (error) {
      console.error(
        `❌ Error assigning code to participant ${participant.id}:`,
        error
      );
    }
  }

  console.log(`\n🎉 Successfully assigned ${assigned} codes`);
  console.log(`📊 Remaining codes: ${codes.length - assigned}`);
}

seedCursorCodes()
  .then(() => {
    console.log("✨ Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
