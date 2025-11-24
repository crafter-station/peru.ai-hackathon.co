import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";

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

    const fullName =
      [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || null;

    const [newParticipant] = await db
      .insert(participants)
      .values({
        clerkUserId: userId,
        email: email,
        fullName: fullName,
        registrationStatus: "in_progress",
        currentStep: 1,
      })
      .returning();

    participant = newParticipant;
  }

  return NextResponse.json(participant);
}

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

  if (processedData.registrationStatus === "completed") {
    if (!processedData.completedAt) {
      processedData.completedAt = new Date();
    }

    // Only assign participant number if not already assigned
    if (!participant?.participantNumber && !processedData.participantNumber) {
      const lastParticipant = await db.query.participants.findFirst({
        orderBy: desc(participants.participantNumber),
      });

      processedData.participantNumber =
        (lastParticipant?.participantNumber || 0) + 1;
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

  // Check if required fields for badge are complete (fullName, dni, profilePhotoAiUrl)
  const requiredFieldsForBadge = [
    updatedParticipant.fullName,
    updatedParticipant.dni,
    updatedParticipant.profilePhotoAiUrl,
  ];

  const allFieldsComplete = requiredFieldsForBadge.every(
    (field) => field && field.trim() !== "",
  );

  // Assign participant number early if all required fields are complete
  // This allows badge generation to happen before registration is completed
  if (allFieldsComplete && !updatedParticipant.participantNumber) {
    const completedCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(participants)
      .where(sql`${participants.participantNumber} IS NOT NULL`);

    const newParticipantNumber = (completedCount[0]?.count || 0) + 1;

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

  // Trigger badge generation in background when required fields are complete
  // Don't wait for registrationStatus === "completed"
  if (
    allFieldsComplete &&
    updatedParticipant.participantNumber &&
    !updatedParticipant.badgeBlobUrl
  ) {
    // Fire-and-forget badge generation (don't block response)
    fetch(new URL("/api/badge/generate-ai", request.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: updatedParticipant.id }),
    }).catch((error) => {
      console.error("[onboarding] Background badge generation failed:", error);
    });

    console.log("[onboarding] Background badge generation triggered");
  }

  // Also handle badge generation on completion (for backward compatibility)
  if (
    updatedParticipant.registrationStatus === "completed" &&
    updatedParticipant.participantNumber &&
    updatedParticipant.profilePhotoAiUrl &&
    !updatedParticipant.badgeBlobUrl
  ) {
    try {
      const badgeResponse = await fetch(
        new URL("/api/badge/generate-ai", request.url).toString(),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId: updatedParticipant.id }),
        },
      );

      if (!badgeResponse.ok) {
        const errorData = await badgeResponse.json().catch(() => ({}));
        console.error("[onboarding] Badge generation failed:", errorData);
      } else {
        console.log("[onboarding] Badge generation triggered successfully");
      }
    } catch (error) {
      console.error("[onboarding] Failed to trigger badge generation:", error);
    }
  }

  return NextResponse.json(updatedParticipant);
}
