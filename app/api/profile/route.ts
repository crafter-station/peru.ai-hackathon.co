import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { profileSchema } from "@/lib/validations/profile";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const participant = await db.query.participants.findFirst({
    where: eq(participants.clerkUserId, userId),
  });

  if (!participant) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  return NextResponse.json({
    fullName: participant.fullName,
    organization: participant.organization,
    participantNumber: participant.participantNumber,
    profilePhotoUrl: participant.profilePhotoUrl,
    badgeBlobUrl: participant.badgeBlobUrl,
    profilePhotoAiUrl: participant.profilePhotoAiUrl,
    bio: participant.bio,
    techStack: participant.techStack,
    experienceLevel: participant.experienceLevel,
    linkedinUrl: participant.linkedinUrl,
    instagramUrl: participant.instagramUrl,
    twitterUrl: participant.twitterUrl,
    githubUrl: participant.githubUrl,
    websiteUrl: participant.websiteUrl,
    registrationStatus: participant.registrationStatus,
  });
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const body = await request.json();
  const validationResult = profileSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  const data = validationResult.data;

  const updateData: Record<string, string | null | Date> = {
    updatedAt: new Date(),
  };

  if (data.bio !== undefined) {
    updateData.bio = data.bio || null;
  }
  if (data.linkedinUrl !== undefined) {
    updateData.linkedinUrl = data.linkedinUrl || null;
  }
  if (data.instagramUrl !== undefined) {
    updateData.instagramUrl = data.instagramUrl || null;
  }
  if (data.twitterUrl !== undefined) {
    updateData.twitterUrl = data.twitterUrl || null;
  }
  if (data.githubUrl !== undefined) {
    updateData.githubUrl = data.githubUrl || null;
  }
  if (data.websiteUrl !== undefined) {
    updateData.websiteUrl = data.websiteUrl || null;
  }

  const updated = await db
    .update(participants)
    .set(updateData)
    .where(eq(participants.clerkUserId, userId))
    .returning();

  if (!updated.length) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  return NextResponse.json({
    fullName: updated[0].fullName,
    organization: updated[0].organization,
    participantNumber: updated[0].participantNumber,
    profilePhotoUrl: updated[0].profilePhotoUrl,
    badgeBlobUrl: updated[0].badgeBlobUrl,
    profilePhotoAiUrl: updated[0].profilePhotoAiUrl,
    bio: updated[0].bio,
    techStack: updated[0].techStack,
    experienceLevel: updated[0].experienceLevel,
    linkedinUrl: updated[0].linkedinUrl,
    instagramUrl: updated[0].instagramUrl,
    twitterUrl: updated[0].twitterUrl,
    githubUrl: updated[0].githubUrl,
    websiteUrl: updated[0].websiteUrl,
    registrationStatus: updated[0].registrationStatus,
  });
}
