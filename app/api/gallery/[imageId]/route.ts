import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages, imageLikes } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const imageId = resolvedParams.imageId;

    if (!imageId || typeof imageId !== 'string') {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    const [image] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, imageId))
      .limit(1);

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Get like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(imageLikes)
      .where(eq(imageLikes.imageId, imageId));

    const likeCount = likeCountResult[0]?.count || 0;

    // Check if user liked (get userId from query params)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let isLikedByUser = false;
    if (userId) {
      const userLike = await db
        .select()
        .from(imageLikes)
        .where(
          and(
            eq(imageLikes.imageId, imageId),
            eq(imageLikes.userId, userId)
          )
        )
        .limit(1);

      isLikedByUser = userLike.length > 0;
    }

    return NextResponse.json({
      ...image,
      likeCount,
      isLikedByUser,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
