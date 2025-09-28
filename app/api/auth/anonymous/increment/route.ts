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

    // Increment generations used and get updated user
    const updatedUser = await db
      .update(anonymousUsers)
      .set({ 
        generationsUsed: sql`${anonymousUsers.generationsUsed} + 1`,
        updatedAt: new Date()
      })
      .where(eq(anonymousUsers.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
