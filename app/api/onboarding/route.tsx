import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { put } from "@vercel/blob";
import { auth, clerkClient } from "@clerk/nextjs/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import QRCode from "qrcode";
import satori from "satori";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

let fontsCache: { regular: Buffer; bold: Buffer } | null = null;

async function getFonts() {
  if (!fontsCache) {
    const [regular, bold] = await Promise.all([
      fs.readFile(
        path.join(
          process.cwd(),
          "app/fonts/Adelle Mono/AdelleMono-Regular.ttf",
        ),
      ),
      fs.readFile(
        path.join(process.cwd(), "app/fonts/Adelle Mono/AdelleMono-Bold.ttf"),
      ),
    ]);
    fontsCache = { regular, bold };
  }
  return fontsCache;
}

const BADGE_CONFIG = {
  profilePicture: {
    x: 130,
    y: 393,
    width: 574,
    height: 574,
  },
  participantNumber: {
    x: 150.8021863612701,
    y: 313.34721499219154,
    fontSize: 32,
    color: "rgba(246, 246, 246, 0.35)",
  },
  participantNumber2: {
    x: 150.8021863612701,
    y: 1001.5543987506467,
    fontSize: 32,
    color: "rgba(246, 246, 246, 0.35)",
  },
  firstName: {
    x: 324.5300849661869,
    y: 1199.0579656293544,
  },
  lastName: {
    x: 324.5300849661869,
    y: 1259.0579656293544,
  },
  role: {
    x: 324.5300849661869,
    y: 1299.0579656293544,
  },
  qrCode: {
    x: 115.5300849661869,
    y: 1139.0579656293544,
    width: 179,
    height: 179,
  },
};

function getBadgeTemplatePath(
  role: string | null | undefined,
  extension: "png" | "svg" = "png",
): string {
  const roleMap: Record<string, string> = {
    STAFF: "THC-IA HACK PE-ID-Staff",
    ORGANIZATION: "THC-IA HACK PE-ID-Organizacion",
    MENTOR: "THC-IA HACK PE-ID-Mentor",
    JURADO: "THC-IA HACK PE-ID-Jurado",
    PARTICIPANTE: "THC-IA HACK PE-ID-Participante",
  };

  const templateName = roleMap[role || "PARTICIPANTE"] || roleMap.PARTICIPANTE;
  return path.join(
    process.cwd(),
    "public/onboarding",
    `${templateName}.${extension}`,
  );
}

function getRoleDisplayText(
  role: string | null | undefined,
  organization: string | null | undefined,
): string {
  const roleTextMap: Record<string, string> = {
    STAFF: "STAFF",
    ORGANIZATION: organization?.toUpperCase() || "ORGANIZACIÓN",
    MENTOR: "MENTOR",
    JURADO: "JURADO",
    PARTICIPANTE: "HACKER",
  };

  return roleTextMap[role || "PARTICIPANTE"] || roleTextMap.PARTICIPANTE;
}

async function generateBadge(participantId: string) {
  if (!db) {
    console.error("[badge] Database not configured");
    return;
  }

  try {
    let participant = await db.query.participants.findFirst({
      where: eq(participants.id, participantId),
    });

    if (!participant) {
      console.error("[badge] Participant not found:", participantId);
      return;
    }

    for (let i = 0; i < 15; i++) {
      if (!participant?.profilePhotoAiUrl) {
        console.log(
          "[badge] Waiting for AI profile photo for participant:",
          participantId,
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));

        participant = await db.query.participants.findFirst({
          where: eq(participants.id, participantId),
        });
      }
    }

    if (!participant?.profilePhotoAiUrl) {
      console.error(
        "[badge] Participant's ai profile photo not found:",
        participantId,
      );
      return;
    }

    if (!participant.participantNumber) {
      console.error("[badge] No participant number for:", participantId);
      return;
    }

    console.log(
      "[badge] Generating badge for participant",
      participant.participantNumber,
    );

    const aiAvatarResponse = await fetch(participant.profilePhotoAiUrl);
    const aiAvatarBuffer = Buffer.from(await aiAvatarResponse.arrayBuffer());

    const processedPixelArt = await sharp(aiAvatarBuffer)
      .resize(
        BADGE_CONFIG.profilePicture.width,
        BADGE_CONFIG.profilePicture.height,
        { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } },
      )
      .png()
      .toBuffer();

    let domain = "peru.ai-hackathon.co";

    switch (process.env.VERCEL_ENV) {
      case "production":
        if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
          domain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
        }
        break;
      case "preview":
        if (process.env.VERCEL_BRANCH_URL) {
          domain = process.env.VERCEL_BRANCH_URL;
        }
        break;
    }

    const profileUrl = `https://${domain}/p/${participant.participantNumber}`;

    const templatePath = getBadgeTemplatePath(participant.role, "png");

    const [fonts, qrCodeBuffer] = await Promise.all([
      getFonts(),
      QRCode.toBuffer(profileUrl, {
        errorCorrectionLevel: "M",
        type: "png",
        width: 60,
        margin: 0,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }),
    ]);

    const { regular: adelleMonoRegular, bold: adelleMonoBold } = fonts;

    const numberText = `#${String(participant.participantNumber).padStart(3, "0")} * #${String(participant.participantNumber).padStart(3, "0")} * #${String(participant.participantNumber).padStart(3, "0")}`;

    const badgeWidth = 1080;
    const textStartX = BADGE_CONFIG.firstName.x;
    const padding = 60;
    const safetyMargin = 0.92;
    const maxTextWidth = (badgeWidth - textStartX - padding) * safetyMargin;

    const calculateOptimalFontSizeAndText = (
      text: string,
      baseFontSize: number,
      minFontSize: number,
      letterSpacing: number,
    ): { fontSize: number; text: string } => {
      if (!text) return { fontSize: baseFontSize, text: "" };

      const textLength = text.length;
      const letterSpacingValue = baseFontSize * letterSpacing;
      const avgCharWidth = baseFontSize + letterSpacingValue;
      const requiredWidth = textLength * avgCharWidth;

      if (requiredWidth <= maxTextWidth) {
        return { fontSize: baseFontSize, text };
      }

      const scaleFactor = maxTextWidth / requiredWidth;
      const scaledFontSize = baseFontSize * scaleFactor;
      const finalFontSize = Math.max(Math.floor(scaledFontSize), minFontSize);

      if (finalFontSize === minFontSize) {
        const minLetterSpacingValue = minFontSize * letterSpacing;
        const minAvgCharWidth = minFontSize + minLetterSpacingValue;
        const maxCharsAtMinSize = Math.floor(maxTextWidth / minAvgCharWidth);

        if (textLength > maxCharsAtMinSize) {
          const truncatedText = text.substring(0, maxCharsAtMinSize - 1) + "…";
          return { fontSize: minFontSize, text: truncatedText };
        }
      }

      return { fontSize: finalFontSize, text };
    };

    const nameParts = (participant.fullName || "")
      .trim()
      .split(" ")
      .filter(Boolean);

    let firstName = "";
    let lastName = "";

    if (nameParts.length === 0) {
      firstName = "";
      lastName = "";
    } else if (nameParts.length === 1) {
      firstName = nameParts[0];
      lastName = "";
    } else if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else {
      firstName = nameParts[0];
      const remainingParts = nameParts.slice(1);
      lastName = remainingParts.join(" ");
    }

    const baseNameFontSize = 60;
    const minNameFontSize = 45;
    const baseRoleFontSize = 40;
    const minRoleFontSize = 30;
    const letterSpacing = 0.08;

    const firstNameResult = calculateOptimalFontSizeAndText(
      firstName,
      baseNameFontSize,
      minNameFontSize,
      letterSpacing,
    );
    const firstNameFontSize = firstNameResult.fontSize;
    const finalFirstName = firstNameResult.text;

    const lastNameResult = calculateOptimalFontSizeAndText(
      lastName,
      baseNameFontSize,
      minNameFontSize,
      letterSpacing,
    );
    const lastNameFontSize = lastNameResult.fontSize;
    const finalLastName = lastNameResult.text;

    const roleText = getRoleDisplayText(
      participant.role,
      participant.organization,
    );
    const roleResult = calculateOptimalFontSizeAndText(
      roleText,
      baseRoleFontSize,
      minRoleFontSize,
      letterSpacing,
    );
    const roleFontSize = roleResult.fontSize;
    const finalRoleText = roleResult.text;

    const qrCode = await sharp(qrCodeBuffer)
      .resize(BADGE_CONFIG.qrCode.width, BADGE_CONFIG.qrCode.height)
      .toBuffer();

    const numbersElement = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1080px",
          height: "1440px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.participantNumber.y}px`,
            left: `${BADGE_CONFIG.participantNumber.x}px`,
            color: BADGE_CONFIG.participantNumber.color,
            fontSize: `${BADGE_CONFIG.participantNumber.fontSize}px`,
            fontFamily: "Adelle Mono",
            fontWeight: 500,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          {numberText}
        </div>
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.participantNumber2.y}px`,
            left: `${BADGE_CONFIG.participantNumber2.x}px`,
            color: BADGE_CONFIG.participantNumber2.color,
            fontSize: `${BADGE_CONFIG.participantNumber2.fontSize}px`,
            fontFamily: "Adelle Mono",
            fontWeight: 500,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          {numberText}
        </div>
      </div>
    );

    const textElement = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1080px",
          height: "1440px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.firstName.y - firstNameFontSize}px`,
            left: `${BADGE_CONFIG.firstName.x}px`,
            color: "white",
            fontSize: `${firstNameFontSize}px`,
            fontFamily: "Adelle Mono",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "left",
            maxWidth: `${maxTextWidth}px`,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {finalFirstName}
        </div>
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.lastName.y - lastNameFontSize}px`,
            left: `${BADGE_CONFIG.lastName.x}px`,
            color: "white",
            fontSize: `${lastNameFontSize}px`,
            fontFamily: "Adelle Mono",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "left",
            maxWidth: `${maxTextWidth}px`,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {finalLastName}
        </div>
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.role.y - roleFontSize}px`,
            left: `${BADGE_CONFIG.role.x}px`,
            color: "white",
            fontSize: `${roleFontSize}px`,
            fontFamily: "Adelle Mono",
            fontWeight: 400,
            textTransform: "uppercase",
            textAlign: "left",
            maxWidth: `${maxTextWidth}px`,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {finalRoleText}
        </div>
      </div>
    );

    const svgNumbers = await satori(numbersElement, {
      width: 1080,
      height: 1440,
      fonts: [
        {
          name: "Adelle Mono",
          data: adelleMonoRegular,
          weight: 400,
          style: "normal",
        },
      ],
    });

    const svgText = await satori(textElement, {
      width: 1080,
      height: 1440,
      fonts: [
        {
          name: "Adelle Mono",
          data: adelleMonoRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Adelle Mono",
          data: adelleMonoBold,
          weight: 700,
          style: "normal",
        },
      ],
    });

    const badgeBuffer = await sharp(templatePath)
      .resize(1080, 1440, { fit: "fill" })
      .composite([
        {
          input: processedPixelArt,
          top: Math.round(BADGE_CONFIG.profilePicture.y),
          left: Math.round(BADGE_CONFIG.profilePicture.x),
        },
        {
          input: Buffer.from(svgNumbers),
          top: 0,
          left: 0,
        },
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
        {
          input: qrCode,
          top: Math.round(BADGE_CONFIG.qrCode.y),
          left: Math.round(BADGE_CONFIG.qrCode.x),
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    console.log("[badge] Badge composed, uploading to Vercel Blob");

    const timestamp = Date.now();
    const badgeBlobResult = await put(
      `badges/${participantId}-${timestamp}.png`,
      badgeBuffer,
      {
        access: "public",
        contentType: "image/png",
      },
    );

    console.log("[badge] Badge uploaded:", badgeBlobResult.url);

    await db
      .update(participants)
      .set({
        badgeBlobUrl: badgeBlobResult.url,
        badgeGeneratedAt: new Date(),
        lastBadgeGenerationAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(participants.id, participantId));

    console.log("[badge] Badge generation completed");
  } catch (error) {
    console.error("[badge] Error in badge generation:", error);
  }
}

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
      const data = await db.execute<{ participant_number: number }>(
        sql`SELECT MAX(COALESCE("participant_number", 0)) FROM participants`,
      );

      processedData.participantNumber = data.rows[0].participant_number + 1;
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
    const data = await db.execute<{ participant_number: number }>(
      sql`SELECT MAX(COALESCE("participant_number", 0)) FROM participants`,
    );

    const newParticipantNumber = data.rows[0].participant_number + 1;

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
