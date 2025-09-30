import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { anonymousUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createAnonymousUserId, getClientIP, generateRandomAnonId } from "@/lib/anonymous-user";

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const cookieStore = await cookies();
    
    // Layer 1: Check for existing cookie
    const existingAnon = cookieStore.get("anon_user_id")?.value;
    if (existingAnon) {
      // Return existing user or create if not found in DB
      let user = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, existingAnon)).limit(1);
      
      if (user.length === 0) {
        // Cookie exists but user not in DB, create them (handle race conditions)
        try {
          await db.insert(anonymousUsers).values({
            id: existingAnon,
            fingerprint: null,
          });
        } catch {
          // Ignore duplicate key errors - user already exists
          console.log('User already exists, ignoring duplicate:', existingAnon);
        }
        user = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, existingAnon)).limit(1);
      }
      
      // For existing users, find their fingerprint ID for rate limiting
      const fingerprintUserId = user[0].fingerprint || existingAnon;
      
      return NextResponse.json({ 
        userId: fingerprintUserId,    // Use fingerprint ID for rate limiting
        sessionId: existingAnon,      // Keep session ID for session management
        generationsUsed: user[0].generationsUsed,
        maxGenerations: user[0].maxGenerations,
        canGenerate: user[0].generationsUsed < user[0].maxGenerations
      });
    }

    // Layer 2: Create fingerprint-based ID as fallback
    const ip = getClientIP(request.headers);
    const userAgent = request.headers.get("user-agent");
    const acceptLanguage = request.headers.get("accept-language");  
    const acceptEncoding = request.headers.get("accept-encoding");

    const fingerprintId = createAnonymousUserId(ip, userAgent, acceptLanguage, acceptEncoding);
    
    // Check if fingerprint user already exists
    let user = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, fingerprintId)).limit(1);
    
    if (user.length === 0) {
      // Create new fingerprint user (handle race conditions)
      try {
        await db.insert(anonymousUsers).values({
          id: fingerprintId,
          fingerprint: `${ip}|${userAgent}|${acceptLanguage}|${acceptEncoding}`.substring(0, 500),
        });
      } catch {
        // Ignore duplicate key errors - user already exists
        console.log('Fingerprint user already exists, ignoring duplicate:', fingerprintId);
      }
      user = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, fingerprintId)).limit(1);
    }

    // Create new cookie ID for this session
    const newAnonId = generateRandomAnonId();
    
    // Set cookie for 1 year
    const response = NextResponse.json({ 
      userId: fingerprintId,        // Use fingerprint ID for rate limiting
      sessionId: newAnonId,         // Session ID for session management  
      generationsUsed: user[0].generationsUsed,
      maxGenerations: user[0].maxGenerations,
      canGenerate: user[0].generationsUsed < user[0].maxGenerations
    });

    response.cookies.set("anon_user_id", newAnonId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    // Create cookie user linked to fingerprint user
    await db.insert(anonymousUsers).values({
      id: newAnonId,
      fingerprint: fingerprintId, // Link to fingerprint user
      generationsUsed: user[0].generationsUsed, // Inherit usage count
      maxGenerations: user[0].maxGenerations,
    });

    return response;
  } catch (error) {
    console.error("Error handling anonymous user:", error);
    return NextResponse.json(
      { error: "Failed to create anonymous user" },
      { status: 500 }
    );
  }
}
