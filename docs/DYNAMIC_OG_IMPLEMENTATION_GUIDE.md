# Dynamic Open Graph (OG) Images Implementation Guide

This document explains how dynamic OG images work for badges and profiles in the IA Hackathon Peru project, with detailed instructions for implementing in another project.

---

## Table of Contents

1. [What is Open Graph?](#what-is-open-graph)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Types](#implementation-types)
4. [Badge OG Images](#badge-og-images)
5. [Profile OG Images](#profile-og-images)
6. [Gallery Image OG](#gallery-image-og)
7. [Copy Commands](#copy-commands)
8. [Configuration](#configuration)

---

## What is Open Graph?

Open Graph (OG) meta tags control how URLs are displayed when shared on social platforms like Facebook, LinkedIn, Twitter, and messaging apps like WhatsApp.

```html
<!-- When someone shares https://yoursite.com/p/123 -->
<meta property="og:title" content="John Doe | IA Hackathon Perú 2025" />
<meta property="og:description" content="Participant profile..." />
<meta property="og:image" content="https://yoursite.com/api/badge/og-share/123" />
<meta property="og:url" content="https://yoursite.com/p/123" />
```

**Result**: Social platforms fetch the image and display a rich preview card instead of just a plain link.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DYNAMIC OG IMAGE FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

    USER SHARES LINK                 SOCIAL PLATFORM                YOUR SERVER
    ──────────────                   ───────────────                ───────────
         │                                 │                             │
         │  1. Shares URL                  │                             │
         │─────────────────────────────────▶                             │
         │                                 │                             │
         │                                 │  2. Fetches HTML page       │
         │                                 │────────────────────────────▶│
         │                                 │                             │
         │                                 │  3. Returns HTML with       │
         │                                 │     OG meta tags            │
         │                                 │◀────────────────────────────│
         │                                 │                             │
         │                                 │  4. Parses og:image URL     │
         │                                 │                             │
         │                                 │  5. Fetches OG image        │
         │                                 │────────────────────────────▶│
         │                                 │                             │
         │                                 │  6. Returns dynamic PNG     │
         │                                 │◀────────────────────────────│
         │                                 │                             │
         │  7. Shows rich preview card     │                             │
         │◀────────────────────────────────│                             │
         │                                 │                             │
```

---

## Implementation Types

This project uses **3 different OG implementations**:

| Type | URL Pattern | OG Image Source | Use Case |
|------|-------------|-----------------|----------|
| **Badge Share** | `/share/badge/[number]` | `/api/badge/og-share/[number]` | Sharing badge on social media |
| **Profile** | `/p/[number]` | Existing profile photo/badge URL | Profile page sharing |
| **Gallery Image** | `/i/[imageId]` | Stored blob URL | AI-generated image sharing |

---

## Badge OG Images

### How It Works

The badge OG system generates a **1200x630 image** (standard OG dimensions) from the participant's full badge.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BADGE OG GENERATION                                │
└─────────────────────────────────────────────────────────────────────────────┘

1. Share Page Request
   /share/badge/123
        │
        ▼
2. Next.js generateMetadata() runs
   • Fetches participant from database
   • Builds og:image URL pointing to API route
        │
        ▼
3. Social platform requests og:image
   /api/badge/og-share/123
        │
        ▼
4. API Route generates image:
   • Fetches pre-generated badge from Vercel Blob
   • Resizes to 1200x630 with black background
   • Returns PNG with cache headers
        │
        ▼
5. Social platform displays rich preview
```

### File: `/app/share/badge/[participantNumber]/page.tsx`

This page generates the metadata with OG tags:

```typescript
import { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { participantNumber } = await params;
  const participantNum = parseInt(participantNumber, 10);

  // Fetch participant from database
  const participant = await db.query.participants.findFirst({
    where: eq(participants.participantNumber, participantNum),
  });

  if (!participant?.badgeBlobUrl) {
    return { title: "Badge - IA Hackathon Perú" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
  const shareUrl = `${baseUrl}/share/badge/${participantNum}`;
  
  // THIS IS THE KEY: og:image points to the API route that generates the image
  const ogImageUrl = `${baseUrl}/api/badge/og-share/${participantNum}`;

  return {
    title: `${participant.fullName} - Credencial IA Hackathon Perú 2025`,
    description: `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025`,
    
    openGraph: {
      type: "website",
      url: shareUrl,
      title: `${participant.fullName} - Credencial IA Hackathon Perú 2025`,
      description: `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025`,
      images: [
        {
          url: ogImageUrl,           // Dynamic image URL
          width: 1200,               // Standard OG width
          height: 630,               // Standard OG height
          alt: `Credencial de ${participant.fullName}`,
        },
      ],
      siteName: "IA Hackathon Perú",
      locale: "es_PE",
    },
    
    twitter: {
      card: "summary_large_image",   // Large image card on Twitter
      title: `${participant.fullName} - Credencial IA Hackathon Perú 2025`,
      description: `🚀 ¡Ya estoy dentro!`,
      images: [ogImageUrl],          // Same dynamic image
    },
    
    alternates: {
      canonical: shareUrl,
    },
  };
}
```

### File: `/app/api/badge/og-share/[participantNumber]/route.ts`

This API route generates the actual OG image:

```typescript
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ participantNumber: string }> }
) {
  const { participantNumber } = await params;
  const participantNum = parseInt(participantNumber, 10);

  // 1. Fetch participant and validate
  const participant = await db.query.participants.findFirst({
    where: eq(participants.participantNumber, participantNum),
  });

  if (!participant?.badgeBlobUrl) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }

  // 2. Fetch the pre-generated badge image from Vercel Blob
  const badgeResponse = await fetch(participant.badgeBlobUrl, {
    cache: "no-store",
  });
  const badgeBuffer = Buffer.from(await badgeResponse.arrayBuffer());

  // 3. Resize badge (1080x1440) to OG dimensions (1200x630)
  //    Using "contain" to fit the portrait badge in landscape OG with padding
  const ogWidth = 1200;
  const ogHeight = 630;
  
  const ogImage = await sharp(badgeBuffer)
    .resize(ogWidth, ogHeight, {
      fit: "contain",                              // Maintain aspect ratio
      background: { r: 0, g: 0, b: 0, alpha: 1 }, // Black padding
    })
    .png()
    .toBuffer();

  // 4. Return with aggressive caching
  return new NextResponse(new Uint8Array(ogImage), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",  // Cache for 1 year
      "Content-Length": ogImage.length.toString(),
    },
  });
}
```

### Alternative: Generate OG Image On-The-Fly

For cases where you don't have a pre-generated badge, you can composite it dynamically:

**File: `/app/api/badge/og/[participantId]/route.ts`**

```typescript
import sharp from "sharp";
import QRCode from "qrcode";

export async function GET(request: NextRequest, { params }) {
  const { participantId } = await params;
  
  // Fetch participant
  const participant = await db.query.participants.findFirst({
    where: eq(participants.id, participantId),
  });

  // Load base template
  const bgPath = getBadgeTemplatePath(participant.role, "svg");
  const badge = sharp(bgPath).resize(1080, 1440);

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, { width: 179 });

  // Create SVG overlay with participant data
  const svg = `
    <svg width="1080" height="1440" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="grayscale">
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </defs>
      
      <!-- Profile photo (grayscale) -->
      ${participant.profilePhotoAiUrl 
        ? `<image href="${participant.profilePhotoAiUrl}" 
                  x="45.84" y="265.46" width="700" height="700" 
                  filter="url(#grayscale)"/>`
        : ""
      }
      
      <!-- Participant number strips -->
      <text x="407.8" y="343.35" text-anchor="middle" 
            font-size="32" fill="rgba(246,246,246,0.09)" 
            font-family="'Adelle Mono'" letter-spacing="0.34em">
        ${participantNumber} * ${participantNumber} * ${participantNumber}
      </text>
      
      <!-- Name -->
      <text x="473.58" y="1198.85" text-anchor="middle" 
            font-size="60" font-weight="700" fill="#FFFFFF">
        ${firstName.toUpperCase()}
      </text>
      <text x="458.34" y="1256.79" text-anchor="middle" 
            font-size="60" font-weight="700" fill="#FFFFFF">
        ${lastName.toUpperCase()}
      </text>
      
      <!-- Role -->
      <text x="467.93" y="1317.08" text-anchor="middle" 
            font-size="40" fill="#FFFFFF">
        ${roleText}
      </text>
      
      <!-- QR Code -->
      <image href="${qrCodeDataUrl}" x="107.53" y="1152.06" width="179" height="169"/>
    </svg>
  `;

  // Composite template + SVG overlay
  const composited = await badge
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  return new Response(new Uint8Array(composited), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
```

---

## Profile OG Images

Profile pages use a simpler approach: **existing images as OG images**.

### File: `/app/p/[number]/layout.tsx`

```typescript
import { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  const participant = await getParticipant(number);

  if (!participant) {
    return { title: "Participante no encontrado" };
  }

  const name = participant.fullName || `Participante #${participant.participantNumber}`;
  
  // Use existing image (priority order)
  const image = participant.profilePhotoAiUrl      // 1. AI-generated photo
             || participant.badgeBlobUrl           // 2. Generated badge
             || participant.profilePhotoUrl        // 3. Original photo
             || `${BASE_URL}/og-image.jpg`;        // 4. Default fallback

  return {
    title: `${name} | IA Hackathon Perú 2025`,
    description: participant.bio?.slice(0, 150) || `Perfil de ${name}`,
    
    openGraph: {
      title: `${name} | IA Hackathon Perú 2025`,
      description: participant.bio || `Perfil de ${name}`,
      url: `${BASE_URL}/p/${participant.participantNumber}`,
      images: [
        {
          url: image,           // Use existing image directly
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      type: "profile",          // Profile type for OpenGraph
      locale: "es_PE",
    },
    
    twitter: {
      card: "summary_large_image",
      title: `${name} | IA Hackathon Perú 2025`,
      description: participant.bio || `Perfil de ${name}`,
      images: [image],
    },
  };
}
```

---

## Gallery Image OG

For AI-generated images in the gallery:

### File: `/app/i/[imageId]/layout.tsx`

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { imageId } = await params;

  const [image] = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.id, imageId))
    .limit(1);

  if (!image) {
    return { title: "Image Not Found" };
  }

  const imageUrl = image.blobUrl || image.imageUrl;
  const shareUrl = `${BASE_URL}/i/${image.id}`;

  return {
    title: `"${image.prompt}" - AI Alpaca | IA Hackathon Perú`,
    description: `AI-generated alpaca: "${image.prompt}"`,
    
    openGraph: {
      type: "website",
      url: shareUrl,
      title: `"${image.prompt}" - AI Alpaca`,
      description: `Amazing AI-generated alpaca: "${image.prompt}"`,
      images: [
        {
          url: imageUrl,                    // Direct blob URL
          width: image.width || 512,
          height: image.height || 512,
          alt: image.prompt,
        },
      ],
    },
    
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
    
    // SEO enhancements
    robots: {
      index: true,
      follow: true,
      googleBot: {
        "max-image-preview": "large",      // Allow large image preview
      },
    },
  };
}
```

---

## Copy Commands

```bash
# Set paths
export SOURCE="/Users/cris/hackathons/ia-hackathon-peru"
export TARGET="/path/to/your/project"

# ═══════════════════════════════════════════════════════════════════
# 1. CREATE DIRECTORY STRUCTURE
# ═══════════════════════════════════════════════════════════════════

mkdir -p $TARGET/app/api/badge/og/\[participantId\]
mkdir -p $TARGET/app/api/badge/og-share/\[participantNumber\]
mkdir -p $TARGET/app/share/badge/\[participantNumber\]
mkdir -p $TARGET/app/p/\[number\]
mkdir -p $TARGET/app/i/\[imageId\]

# ═══════════════════════════════════════════════════════════════════
# 2. COPY OG API ROUTES (Image Generation)
# ═══════════════════════════════════════════════════════════════════

# Badge OG - generates on-the-fly from template
cp "$SOURCE/app/api/badge/og/[participantId]/route.ts" \
   "$TARGET/app/api/badge/og/[participantId]/"

# Badge OG Share - resizes pre-generated badge to OG dimensions
cp "$SOURCE/app/api/badge/og-share/[participantNumber]/route.ts" \
   "$TARGET/app/api/badge/og-share/[participantNumber]/"

# ═══════════════════════════════════════════════════════════════════
# 3. COPY SHARE PAGES (Metadata Generation)
# ═══════════════════════════════════════════════════════════════════

# Badge share page with metadata
cp "$SOURCE/app/share/badge/[participantNumber]/page.tsx" \
   "$TARGET/app/share/badge/[participantNumber]/"

# ═══════════════════════════════════════════════════════════════════
# 4. COPY LAYOUT FILES (Profile & Image OG Metadata)
# ═══════════════════════════════════════════════════════════════════

# Profile page layout with OG metadata
cp "$SOURCE/app/p/[number]/layout.tsx" \
   "$TARGET/app/p/[number]/"

# Gallery image layout with OG metadata
cp "$SOURCE/app/i/[imageId]/layout.tsx" \
   "$TARGET/app/i/[imageId]/"

# ═══════════════════════════════════════════════════════════════════
# 5. COPY PAGE COMPONENTS
# ═══════════════════════════════════════════════════════════════════

# Profile page
cp "$SOURCE/app/p/[number]/page.tsx" \
   "$TARGET/app/p/[number]/"

# Shared image page
cp "$SOURCE/app/i/[imageId]/page.tsx" \
   "$TARGET/app/i/[imageId]/"

# ═══════════════════════════════════════════════════════════════════
# 6. COPY DEPENDENCIES
# ═══════════════════════════════════════════════════════════════════

# Database
cp $SOURCE/lib/db.ts $TARGET/lib/
cp $SOURCE/lib/schema.ts $TARGET/lib/

# Badge components (for share page display)
cp $SOURCE/components/badge/badge-preview-3d.tsx $TARGET/components/badge/

echo "✅ Dynamic OG files copied successfully!"
```

---

## One-Liner Copy Script

```bash
#!/bin/bash
SOURCE="/Users/cris/hackathons/ia-hackathon-peru"
TARGET="/path/to/your/project"

# Create all directories
mkdir -p $TARGET/app/api/badge/{og/\[participantId\],og-share/\[participantNumber\]} \
         $TARGET/app/share/badge/\[participantNumber\] \
         $TARGET/app/p/\[number\] \
         $TARGET/app/i/\[imageId\] \
         $TARGET/components/badge \
         $TARGET/lib

# Copy OG API routes
cp "$SOURCE/app/api/badge/og/[participantId]/route.ts" "$TARGET/app/api/badge/og/[participantId]/"
cp "$SOURCE/app/api/badge/og-share/[participantNumber]/route.ts" "$TARGET/app/api/badge/og-share/[participantNumber]/"

# Copy share/layout pages
cp "$SOURCE/app/share/badge/[participantNumber]/page.tsx" "$TARGET/app/share/badge/[participantNumber]/"
cp "$SOURCE/app/p/[number]/layout.tsx" "$TARGET/app/p/[number]/"
cp "$SOURCE/app/p/[number]/page.tsx" "$TARGET/app/p/[number]/"
cp "$SOURCE/app/i/[imageId]/layout.tsx" "$TARGET/app/i/[imageId]/"
cp "$SOURCE/app/i/[imageId]/page.tsx" "$TARGET/app/i/[imageId]/"

# Copy dependencies
cp $SOURCE/lib/{db,schema}.ts $TARGET/lib/
cp $SOURCE/components/badge/badge-preview-3d.tsx $TARGET/components/badge/

echo "✅ Done!"
```

---

## Configuration

### Environment Variables

```bash
# .env.local

# Base URL for generating absolute URLs
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Database
DATABASE_URL="postgresql://..."

# Vercel Blob (for storing badges)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

### next.config.ts

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};
```

---

## Testing OG Images

### 1. Social Media Debuggers

Use these tools to test your OG implementation:

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/
- **OpenGraph.xyz**: https://www.opengraph.xyz/

### 2. Local Testing

```bash
# Test the OG image API directly
curl -o test-og.png "http://localhost:3000/api/badge/og-share/123"
open test-og.png

# View page source to check meta tags
curl http://localhost:3000/share/badge/123 | grep -i "og:"
```

### 3. Common Issues

| Issue | Solution |
|-------|----------|
| Image not showing | Check `og:image` is an absolute URL (https://...) |
| Wrong image size | Ensure API returns 1200x630 for standard OG |
| Cached old image | Add timestamp query param or clear social platform cache |
| Image loading slow | Use aggressive caching headers |

---

## Summary

| Component | Purpose | Location |
|-----------|---------|----------|
| **Share Page** | Generates OG metadata for social sharing | `/app/share/badge/[participantNumber]/page.tsx` |
| **OG Image API** | Generates/serves dynamic PNG image | `/app/api/badge/og-share/[participantNumber]/route.ts` |
| **Profile Layout** | Adds OG metadata to profile pages | `/app/p/[number]/layout.tsx` |
| **Gallery Layout** | Adds OG metadata to shared images | `/app/i/[imageId]/layout.tsx` |

The key insight is:
1. **Pages** use `generateMetadata()` to set `og:image` pointing to an API route
2. **API Routes** dynamically generate PNG images using Sharp
3. **Social platforms** fetch the API route URL to get the image

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Source Project**: IA Hackathon Peru
