import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { generateBadge } from "@/lib/generate-badge";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  let participant = await db.query.participants.findFirst({
    where: eq(participants.clerkUserId, userId),
  });

  if (!participant) {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "No email found for user" },
        { status: 400 },
      );
    }

    const [newParticipant] = await db
      .insert(participants)
      .values({
        clerkUserId: userId,
        email: email,
        fullName: clerkUser.fullName,

        role: (clerkUser.publicMetadata.role ?? "PARTICIPANT") as "PARTICIPANT",

        linkedinUrl: (clerkUser.publicMetadata.linkedin_url as string) ?? null,
        githubUrl: (clerkUser.publicMetadata.github_url as string) ?? null,
        twitterUrl: (clerkUser.publicMetadata.twitter_url as string) ?? null,
        websiteUrl: (clerkUser.publicMetadata.website_url as string) ?? null,

        registrationStatus: "in_progress",
        currentStep: 1,
      })
      .returning();

    participant = newParticipant;
  }

  return NextResponse.json(participant);
}

fetch("https://www.peru.ai-hackathon.co/api/onboarding/", {
  method: "PATCH",
  body: JSON.stringify({
    completedAt: "2025-11-24T14:55:50.378Z",
  }),
});

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const data = await request.json();

  const processedData = { ...data };
  if (
    processedData.dateOfBirth &&
    typeof processedData.dateOfBirth === "string"
  ) {
    processedData.dateOfBirth = new Date(processedData.dateOfBirth);
  }
  if (
    processedData.completedAt &&
    typeof processedData.completedAt === "string"
  ) {
    processedData.completedAt = new Date(processedData.completedAt);
  }

  const participant = await db.query.participants.findFirst({
    where: eq(participants.clerkUserId, userId),
  });

  const previousFullName = participant?.fullName;
  const previousOrganization = participant?.organization;

  if (processedData.registrationStatus === "completed") {
    if (!processedData.completedAt) {
      processedData.completedAt = new Date();
    }

    if (!participant?.participantNumber && !processedData.participantNumber) {
      const data = await db.execute<{ min_available: number }>(
        sql`SELECT COALESCE(
          (SELECT MIN(n)
           FROM generate_series(0, (SELECT COALESCE(MAX("participant_number"), -1) FROM participants)) AS n
           WHERE NOT EXISTS (
             SELECT 1 FROM participants WHERE "participant_number" = n
           )
          ),
          COALESCE((SELECT MAX("participant_number") + 1 FROM participants), 0)
        ) as min_available`,
      );

      console.log(JSON.stringify(data, null, 2));

      processedData.participantNumber = data.rows[0].min_available;
      console.log(
        "[onboarding] Assigning participant number on completion:",
        processedData.participantNumber,
      );
    }
  }

  const updated = await db
    .update(participants)
    .set({ ...processedData, updatedAt: new Date() })
    .where(eq(participants.clerkUserId, userId))
    .returning();

  if (!updated.length) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 },
    );
  }

  let updatedParticipant = updated[0];

  const requiredFieldsForBadge = [
    updatedParticipant.fullName,
    updatedParticipant.dni,
    updatedParticipant.profilePhotoAiUrl,
  ];

  const allFieldsComplete = requiredFieldsForBadge.every(
    (field) => field && field.trim() !== "",
  );

  if (allFieldsComplete && !updatedParticipant.participantNumber) {
    const data = await db.execute<{ min_available: number }>(
      sql`SELECT COALESCE(
        (SELECT MIN(n)
         FROM generate_series(0, (SELECT COALESCE(MAX("participant_number"), -1) FROM participants)) AS n
         WHERE NOT EXISTS (
           SELECT 1 FROM participants WHERE "participant_number" = n
         )
        ),
        COALESCE((SELECT MAX("participant_number") + 1 FROM participants), 0)
      ) as min_available`,
    );

    console.log(JSON.stringify(data, null, 2));

    const newParticipantNumber = data.rows[0].min_available;

    const reUpdated = await db
      .update(participants)
      .set({
        participantNumber: newParticipantNumber,
        updatedAt: new Date(),
      })
      .where(eq(participants.clerkUserId, userId))
      .returning();

    if (reUpdated.length > 0) {
      updatedParticipant = reUpdated[0];
      console.log(
        "[onboarding] Early participant number assigned:",
        updatedParticipant.participantNumber,
      );
    }
  }

  const nameChanged = previousFullName !== updatedParticipant.fullName;
  const orgChanged = previousOrganization !== updatedParticipant.organization;
  const shouldRegenerateBadge = nameChanged || orgChanged;

  if (shouldRegenerateBadge) {
    after(() => generateBadge(updatedParticipant.id));

    if (shouldRegenerateBadge) {
      console.log(
        "[onboarding] Badge regeneration triggered due to name/org change",
      );
    } else {
      console.log("[onboarding] Initial badge generation triggered");
    }
  }

  return NextResponse.json(updatedParticipant);
}
