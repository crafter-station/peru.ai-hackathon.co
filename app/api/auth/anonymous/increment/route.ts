import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { anonymousUsers } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Since we're now using fingerprint IDs directly, try to find the user
    // If not found directly, create the fingerprint user first
    let userRecord = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, userId)).limit(1);
    
    if (userRecord.length === 0) {
      // If fingerprint user doesn't exist, create it
      try {
        await db.insert(anonymousUsers).values({
          id: userId,
          fingerprint: null, // This is a fingerprint user itself
        });
        userRecord = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, userId)).limit(1);
      } catch {
        console.log('Fingerprint user already exists or error creating:', userId);
        userRecord = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, userId)).limit(1);
        if (userRecord.length === 0) {
          return NextResponse.json({ error: "User not found and could not create" }, { status: 404 });
        }
      }
    }

    // Increment generations used directly on the fingerprint user
    const updatedUser = await db
      .update(anonymousUsers)
      .set({ 
        generationsUsed: sql`${anonymousUsers.generationsUsed} + 1`,
        updatedAt: new Date()
      })
      .where(eq(anonymousUsers.id, userId))
      .returning();

    // Also update any linked session users to keep them in sync
    await db
      .update(anonymousUsers)
      .set({ 
        generationsUsed: sql`${anonymousUsers.generationsUsed} + 1`,
        updatedAt: new Date()
      })
      .where(eq(anonymousUsers.fingerprint, userId));

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    const user = updatedUser[0];
    
    return NextResponse.json({
      generationsUsed: user.generationsUsed,
      maxGenerations: user.maxGenerations,
      canGenerate: user.generationsUsed < user.maxGenerations,
    });
  } catch (error) {
    console.error("Error incrementing generations:", error);
    return NextResponse.json(
      { error: "Failed to increment generations" },
      { status: 500 }
    );
  }
}
