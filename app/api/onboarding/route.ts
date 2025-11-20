import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

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

    if (!participant?.participantNumber && !processedData.participantNumber) {
      const completedCount = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(participants)
        .where(sql`${participants.participantNumber} IS NOT NULL`);

      processedData.participantNumber = (completedCount[0]?.count || 0) + 1;
      console.log(
        "[onboarding] Assigning participant number:",
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

  if (
    updated[0].registrationStatus === "completed" &&
    updated[0].participantNumber
  ) {
    try {
      await fetch(new URL("/api/badge/generate", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: updated[0].id }),
      });
    } catch (error) {
      console.error("Failed to trigger badge generation:", error);
    }
  }

  return NextResponse.json(updated[0]);
}
