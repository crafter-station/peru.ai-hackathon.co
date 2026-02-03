import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateCertificate } from "@/lib/generate-certificate";

export async function POST(request: Request) {
  try {
    const { participantNumber } = await request.json();

    if (!participantNumber) {
      return NextResponse.json(
        { error: "Participant number is required" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Find participant by number
    const participant = await db.query.participants.findFirst({
      where: eq(participants.participantNumber, participantNumber),
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (!participant.fullName) {
      return NextResponse.json(
        { error: "Participant name not found" },
        { status: 400 }
      );
    }

    // Always generate a fresh certificate
    const result = await generateCertificate(participant.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      cached: false,
    });
  } catch (error) {
    console.error("[certificate-generate] Error:", error);
    return NextResponse.json(
      { error: "Error generating certificate" },
      { status: 500 }
    );
  }
}
