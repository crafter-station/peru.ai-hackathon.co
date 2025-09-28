import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { imageLikes, galleryImages } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }
    
    const { imageId } = await params;
    const imageIdNum = parseInt(imageId);
    
    if (isNaN(imageIdNum)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if image exists
    const imageExists = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, imageIdNum))
      .limit(1);

    if (imageExists.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Check if user already liked this image
    const existingLike = await db
      .select()
      .from(imageLikes)
      .where(
        and(
          eq(imageLikes.imageId, imageIdNum),
          eq(imageLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      return NextResponse.json({ error: "Image already liked" }, { status: 409 });
    }

    // Add the like
    await db.insert(imageLikes).values({
      imageId: imageIdNum,
      userId,
    });

    // Get updated like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(imageLikes)
      .where(eq(imageLikes.imageId, imageIdNum));

    const likeCount = likeCountResult[0]?.count || 0;

    return NextResponse.json({ 
      success: true, 
      liked: true,
      likeCount 
    });

  } catch (error) {
    console.error("Error liking image:", error);
    return NextResponse.json({ error: "Failed to like image" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }
    
    const { imageId } = await params;
    const imageIdNum = parseInt(imageId);
    
    if (isNaN(imageIdNum)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Remove the like
    await db
      .delete(imageLikes)
      .where(
        and(
          eq(imageLikes.imageId, imageIdNum),
          eq(imageLikes.userId, userId)
        )
      );

    // Get updated like count
    const likeCountResult = await db
      .select({ count: count() })
      .from(imageLikes)
      .where(eq(imageLikes.imageId, imageIdNum));

    const likeCount = likeCountResult[0]?.count || 0;

    return NextResponse.json({ 
      success: true, 
      liked: false,
      likeCount 
    });

  } catch (error) {
    console.error("Error unliking image:", error);
    return NextResponse.json({ error: "Failed to unlike image" }, { status: 500 });
  }
}
