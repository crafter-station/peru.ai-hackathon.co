import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages, imageLikes } from "@/lib/schema";
import { desc, eq, count, sql, lt } from "drizzle-orm";
import { put } from "@vercel/blob";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const cursor = searchParams.get("cursor");
    const userId = searchParams.get("userId");

    // Base query with like counts
    const query = db
      .select({
        id: galleryImages.id,
        userId: galleryImages.userId,
        imageUrl: galleryImages.imageUrl,
        blobUrl: galleryImages.blobUrl,
        prompt: galleryImages.prompt,
        description: galleryImages.description,
        enhancedPrompt: galleryImages.enhancedPrompt,
        width: galleryImages.width,
        height: galleryImages.height,
        createdAt: galleryImages.createdAt,
        updatedAt: galleryImages.updatedAt,
        likeCount: count(imageLikes.id),
        isLikedByUser: userId ? 
          sql<boolean>`EXISTS(SELECT 1 FROM ${imageLikes} WHERE ${imageLikes.imageId} = ${galleryImages.id} AND ${imageLikes.userId} = ${userId})` :
          sql<boolean>`false`
      })
      .from(galleryImages)
      .leftJoin(imageLikes, eq(galleryImages.id, imageLikes.imageId))
      .groupBy(galleryImages.id)
      .orderBy(desc(count(imageLikes.id)), desc(galleryImages.createdAt)) // Order by likes first, then creation date
      .limit(limit + 1); // Get one extra to check if there are more

    if (cursor) {
      // Parse cursor date and add proper filtering
      const cursorDate = new Date(cursor);
      query.where(lt(galleryImages.createdAt, cursorDate));
    }

    const results = await query;
    const hasMore = results.length > limit;
    const images = hasMore ? results.slice(0, -1) : results;
    const nextCursor = hasMore ? results[results.length - 1].createdAt.toISOString() : null;

    return NextResponse.json({
      images,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { imageUrl, prompt, description, enhancedPrompt, width, height, userId } = body;

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: "Image URL and prompt are required" },
        { status: 400 }
      );
    }

    let blobUrl = null;

    try {
      // Download the image from the original URL
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image");
      }

      const imageBlob = await imageResponse.blob();
      
      // Upload to Vercel Blob Storage
      const filename = `alpaca-${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const blob = await put(filename, imageBlob, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      blobUrl = blob.url;
    } catch (blobError) {
      console.warn("Failed to upload to blob storage:", blobError);
      // Continue without blob storage if it fails
    }

    const [savedImage] = await db
      .insert(galleryImages)
      .values({
        userId: userId || "user_anonymous",
        imageUrl,
        blobUrl,
        prompt,
        description,
        enhancedPrompt,
        width,
        height,
      })
      .returning();

    return NextResponse.json(savedImage);
  } catch (error) {
    console.error("Error saving image to gallery:", error);
    return NextResponse.json(
      { error: "Failed to save image to gallery" },
      { status: 500 }
    );
  }
}
