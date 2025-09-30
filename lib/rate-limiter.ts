import { db } from "@/lib/db";
import { anonymousUsers, ipRateLimits } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export interface RateLimitResult {
  success: boolean;
  error?: string;
  remaining?: {
    userGenerations: number;
    ipGenerations: number;
  };
}

export interface RateLimitConfig {
  maxUserGenerations: number;
  maxIpGenerations: number;
  resetIntervalHours: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxUserGenerations: 2,     // 2 per user fingerprint
  maxIpGenerations: 10,      // 10 per IP per day
  resetIntervalHours: 24,    // Daily reset
};

/**
 * Check if a user/IP combination can generate an image
 * Enforces multiple layers of rate limiting:
 * 1. User-based limiting (fingerprint)
 * 2. IP-based limiting (daily reset)
 * 3. Time-based validation
 */
export async function checkRateLimit(
  userId: string,
  ipAddress: string | null,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
  if (!db) {
    return { success: false, error: "Database not available" };
  }

  if (!ipAddress) {
    return { success: false, error: "IP address required for rate limiting" };
  }

  try {
    // Check user-based rate limit
    const user = await db.select().from(anonymousUsers).where(eq(anonymousUsers.id, userId)).limit(1);
    
    if (user.length === 0) {
      return { success: false, error: "User not found" };
    }

    const userRecord = user[0];
    
    // User rate limit check
    if (userRecord.generationsUsed >= userRecord.maxGenerations) {
      return {
        success: false,
        error: `User limit reached: ${userRecord.generationsUsed}/${userRecord.maxGenerations} generations used`,
        remaining: {
          userGenerations: 0,
          ipGenerations: await getIpRemainingGenerations(ipAddress, config),
        }
      };
    }

    // Check IP-based rate limit
    const ipLimit = await getOrCreateIpLimit(ipAddress, config);
    
    // Check if IP limit needs reset (daily)
    const now = new Date();
    if (ipLimit.resetAt < now) {
      // Reset IP limit
      await db
        .update(ipRateLimits)
        .set({
          generationsUsed: 0,
          resetAt: new Date(now.getTime() + config.resetIntervalHours * 60 * 60 * 1000),
          updatedAt: now,
        })
        .where(eq(ipRateLimits.ipAddress, ipAddress));
      
      // Refresh data after reset
      const refreshedIpLimit = await db.select().from(ipRateLimits).where(eq(ipRateLimits.ipAddress, ipAddress)).limit(1);
      if (refreshedIpLimit.length > 0) {
        ipLimit.generationsUsed = refreshedIpLimit[0].generationsUsed;
      }
    }

    // IP rate limit check
    if (ipLimit.generationsUsed >= ipLimit.maxGenerations) {
      const resetTime = ipLimit.resetAt.toLocaleString();
      return {
        success: false,
        error: `IP limit reached: ${ipLimit.generationsUsed}/${ipLimit.maxGenerations} generations used. Resets at ${resetTime}`,
        remaining: {
          userGenerations: userRecord.maxGenerations - userRecord.generationsUsed,
          ipGenerations: 0,
        }
      };
    }

    // All checks passed
    return {
      success: true,
      remaining: {
        userGenerations: userRecord.maxGenerations - userRecord.generationsUsed,
        ipGenerations: ipLimit.maxGenerations - ipLimit.generationsUsed,
      }
    };

  } catch (error) {
    console.error("Rate limit check error:", error);
    return { success: false, error: "Rate limit check failed" };
  }
}

/**
 * Increment rate limit counters for both user and IP
 */
export async function incrementRateLimit(
  userId: string,
  ipAddress: string | null
): Promise<RateLimitResult> {
  if (!db || !ipAddress) {
    return { success: false, error: "Database or IP not available" };
  }

  try {
    const now = new Date();

    // Increment user counter
    await db
      .update(anonymousUsers)
      .set({
        generationsUsed: sql`${anonymousUsers.generationsUsed} + 1`,
        lastGenerationAt: now,
        updatedAt: now,
      })
      .where(eq(anonymousUsers.id, userId));

    // Increment IP counter
    await db
      .update(ipRateLimits)
      .set({
        generationsUsed: sql`${ipRateLimits.generationsUsed} + 1`,
        lastGenerationAt: now,
        updatedAt: now,
      })
      .where(eq(ipRateLimits.ipAddress, ipAddress));

    return { success: true };

  } catch (error) {
    console.error("Rate limit increment error:", error);
    return { success: false, error: "Failed to increment rate limit" };
  }
}

/**
 * Get or create IP rate limit record
 */
async function getOrCreateIpLimit(ipAddress: string, config: RateLimitConfig) {
  if (!db) {
    throw new Error("Database not available");
  }

  let ipLimit = await db.select().from(ipRateLimits).where(eq(ipRateLimits.ipAddress, ipAddress)).limit(1);
  
  if (ipLimit.length === 0) {
    // Create new IP limit record
    const resetAt = new Date(Date.now() + config.resetIntervalHours * 60 * 60 * 1000);
    
    try {
      await db.insert(ipRateLimits).values({
        ipAddress,
        generationsUsed: 0,
        maxGenerations: config.maxIpGenerations,
        resetAt,
      });
    } catch {
      // Handle race condition - record might have been created by another request
    }
    
    // Fetch the record (either newly created or existing)
    ipLimit = await db.select().from(ipRateLimits).where(eq(ipRateLimits.ipAddress, ipAddress)).limit(1);
  }
  
  return ipLimit[0];
}

/**
 * Get remaining IP generations
 */
async function getIpRemainingGenerations(ipAddress: string, config: RateLimitConfig): Promise<number> {
  try {
    const ipLimit = await getOrCreateIpLimit(ipAddress, config);
    return Math.max(0, ipLimit.maxGenerations - ipLimit.generationsUsed);
  } catch {
    return 0;
  }
}

/**
 * Admin function to reset rate limits for testing/emergency
 */
export async function resetUserRateLimit(userId: string): Promise<boolean> {
  if (!db) return false;
  
  try {
    await db
      .update(anonymousUsers)
      .set({
        generationsUsed: 0,
        lastGenerationAt: null,
        updatedAt: new Date(),
      })
      .where(eq(anonymousUsers.id, userId));
    
    return true;
  } catch (error) {
    console.error("Failed to reset user rate limit:", error);
    return false;
  }
}

/**
 * Admin function to reset IP rate limits
 */
export async function resetIpRateLimit(ipAddress: string): Promise<boolean> {
  if (!db) return false;
  
  try {
    const resetAt = new Date(Date.now() + DEFAULT_CONFIG.resetIntervalHours * 60 * 60 * 1000);
    
    await db
      .update(ipRateLimits)
      .set({
        generationsUsed: 0,
        resetAt,
        updatedAt: new Date(),
      })
      .where(eq(ipRateLimits.ipAddress, ipAddress));
    
    return true;
  } catch (error) {
    console.error("Failed to reset IP rate limit:", error);
    return false;
  }
}

