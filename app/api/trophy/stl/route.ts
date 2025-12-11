import { NextRequest, NextResponse } from "next/server";

const TROPHY_STL_URL = process.env.TROPHY_STL_URL;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function getClientIdentifier(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
              request.headers.get("x-real-ip") ||
              "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `${ip}-${userAgent}`;
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function GET(request: NextRequest) {
  if (!TROPHY_STL_URL) {
    console.error("[trophy/stl] TROPHY_STL_URL environment variable not set");
    return NextResponse.json(
      { error: "Trophy asset not configured" },
      { status: 500 }
    );
  }

  const identifier = getClientIdentifier(request);
  if (!checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  const referer = request.headers.get("referer");
  const origin = request.headers.get("origin");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://peru.ai-hackathon.co";
  
  const normalizeUrl = (url: string | null): string | null => {
    if (!url) return null;
    return url.replace(/^https?:\/\/(www\.)?/, "").toLowerCase();
  };

  const baseDomain = normalizeUrl(baseUrl);
  const refererDomain = normalizeUrl(referer);
  const originDomain = normalizeUrl(origin);
  
  const isLocalhost = referer?.includes("localhost") || 
                      referer?.includes("127.0.0.1") ||
                      referer?.match(/^https?:\/\/192\.168\.\d+\.\d+/) ||
                      origin?.includes("localhost") ||
                      origin?.includes("127.0.0.1") ||
                      origin?.match(/^https?:\/\/192\.168\.\d+\.\d+/);

  const isAllowedOrigin =
    isLocalhost ||
    (refererDomain && refererDomain === baseDomain) ||
    (originDomain && originDomain === baseDomain) ||
    (referer && referer.includes("peru.ai-hackathon.co")) ||
    (origin && origin.includes("peru.ai-hackathon.co"));

  if (!isAllowedOrigin) {
    console.warn("[trophy/stl] Unauthorized access attempt:", { referer, origin, baseDomain, refererDomain, originDomain });
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 403 }
    );
  }

  try {
    const response = await fetch(TROPHY_STL_URL, {
      headers: {
        "User-Agent": "IA-Hackathon-Peru/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "[trophy/stl] Failed to fetch STL file:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch trophy asset" },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'inline; filename="trophy.stl"',
        "Cache-Control": "private, max-age=3600, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error) {
    console.error("[trophy/stl] Error fetching STL file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
