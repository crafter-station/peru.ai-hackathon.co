import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq, and, isNotNull } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Participant number is required" },
      { status: 400 }
    );
  }

  const participantNumber = parseInt(slug, 10);
  
  if (isNaN(participantNumber)) {
    return NextResponse.json(
      { error: "Invalid participant number" },
      { status: 400 }
    );
  }

  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  const participant = await db.query.participants.findFirst({
    where: and(
      eq(participants.participantNumber, participantNumber),
      eq(participants.registrationStatus, "completed"),
      isNotNull(participants.participantNumber)
    ),
  });

  if (!participant) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  const publicProfile = {
    fullName: participant.fullName,
    organization: participant.organization,
    participantNumber: participant.participantNumber,
    profilePhotoUrl: participant.profilePhotoUrl,
    badgeBlobUrl: participant.badgeBlobUrl,
    pixelArtUrl: participant.pixelArtUrl,
    bio: participant.bio,
    techStack: participant.techStack,
    experienceLevel: participant.experienceLevel,
    linkedinUrl: participant.linkedinUrl,
    instagramUrl: participant.instagramUrl,
    twitterUrl: participant.twitterUrl,
    githubUrl: participant.githubUrl,
    websiteUrl: participant.websiteUrl,
  };

  return NextResponse.json(publicProfile);
}
