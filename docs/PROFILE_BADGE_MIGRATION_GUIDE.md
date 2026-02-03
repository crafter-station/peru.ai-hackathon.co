# Profile Section & Badge Generation Migration Guide

This document provides comprehensive instructions to copy the profile section and badge generation components from the IA Hackathon Peru project to another Next.js project.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Dependencies](#dependencies)
3. [File Structure](#file-structure)
4. [Copy Commands](#copy-commands)
5. [Database Schema](#database-schema)
6. [Environment Variables](#environment-variables)
7. [Configuration Files](#configuration-files)
8. [Component Dependencies Map](#component-dependencies-map)

---

## System Overview

### Profile System
- **Public Profile Page**: `/p/[number]` - Displays participant profiles with bio, social links, achievements, and tech stack
- **Profile Edit Page**: `/profile` - Allows authenticated users to edit their profile
- **Profile API Routes**: `/api/profile` and `/api/profile/[slug]` - CRUD operations for profiles

### Badge Generation System
- **Server-side Badge Generation**: Uses Sharp + Satori for image compositing
- **QR Code Generation**: Links to participant profile pages
- **Multiple Badge Templates**: Supports different roles (STAFF, MENTOR, JURADO, PARTICIPANTE, etc.)
- **Badge Preview Components**: 2D and 3D badge preview with Atropos

---

## Dependencies

### Required NPM Packages

```bash
# Core dependencies
bun add @clerk/nextjs @hookform/resolvers react-hook-form zod

# Database (Neon + Drizzle)
bun add @neondatabase/serverless drizzle-orm drizzle-kit

# Image Processing & Badge Generation
bun add sharp satori qrcode @vercel/blob
bun add -D @types/qrcode

# UI Components
bun add @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-tooltip
bun add class-variance-authority clsx tailwind-merge
bun add lucide-react

# Animations & Effects
bun add motion framer-motion atropos
bun add use-sound

# ID Generation
bun add nanoid
```

### Package.json Excerpt (Relevant Dependencies)

```json
{
  "dependencies": {
    "@clerk/nextjs": "^6.35.4",
    "@hookform/resolvers": "^5.2.2",
    "@neondatabase/serverless": "^1.0.1",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@vercel/blob": "^2.0.0",
    "atropos": "^2.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.44.5",
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.552.0",
    "motion": "^12.23.24",
    "nanoid": "^5.1.6",
    "qrcode": "^1.5.4",
    "react-hook-form": "^7.66.1",
    "satori": "^0.18.3",
    "sharp": "^0.34.5",
    "tailwind-merge": "^3.3.1",
    "use-sound": "^5.0.0",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.6",
    "drizzle-kit": "^0.31.5"
  }
}
```

---

## File Structure

```
target-project/
├── app/
│   ├── api/
│   │   ├── badge/
│   │   │   ├── participant/[participantId]/route.ts
│   │   │   └── og/[participantId]/route.ts
│   │   └── profile/
│   │       ├── route.ts
│   │       └── [slug]/route.ts
│   ├── p/
│   │   └── [number]/
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── fonts/
│       └── Adelle Mono/
│           ├── AdelleMono-Regular.ttf
│           └── AdelleMono-Bold.ttf
├── components/
│   ├── badge/
│   │   ├── badge-preview.tsx
│   │   ├── badge-preview-3d.tsx
│   │   └── badge-studio.tsx
│   ├── profile/
│   │   ├── achievements.tsx
│   │   ├── overview.tsx
│   │   ├── overview/intro-item.tsx
│   │   ├── panel.tsx
│   │   ├── profile-cover.tsx
│   │   ├── profile-edit-modal.tsx
│   │   ├── profile-header.tsx
│   │   ├── separator.tsx
│   │   ├── social-links.tsx
│   │   ├── social-links/social-link-item.tsx
│   │   ├── tech-stack.tsx
│   │   └── verified-icon.tsx
│   └── ui/
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── pixel-button.tsx
│       ├── retro-card.tsx
│       ├── retro-input.tsx
│       ├── retro-textarea.tsx
│       ├── simple-tooltip.tsx
│       ├── terminal-text.tsx
│       └── tooltip.tsx
├── hooks/
│   └── use-click-sound.ts
├── lib/
│   ├── db.ts
│   ├── generate-badge.tsx
│   ├── schema.ts
│   ├── utils.ts
│   └── validations/
│       └── profile.ts
├── public/
│   ├── onboarding/
│   │   ├── THC-IA HACK PE-ID-Participante.svg
│   │   ├── THC-IA HACK PE-ID-Participante.png
│   │   ├── THC-IA HACK PE-ID-Staff.svg
│   │   ├── THC-IA HACK PE-ID-Mentor.svg
│   │   └── THC-IA HACK PE-ID-Jurado.svg
│   ├── sounds/
│   │   ├── click.mp3
│   │   ├── success.mp3
│   │   ├── error.mp3
│   │   ├── hover.mp3
│   │   └── type.mp3
│   └── thc.svg
└── drizzle.config.ts
```

---

## Copy Commands

### Prerequisites
Replace `SOURCE_DIR` with the path to the ia-hackathon-peru project and `TARGET_DIR` with your target project path.

```bash
# Set environment variables
export SOURCE_DIR="/Users/cris/hackathons/ia-hackathon-peru"
export TARGET_DIR="/path/to/your/target-project"
```

### 1. Create Directory Structure

```bash
# Create required directories
mkdir -p $TARGET_DIR/app/api/badge/participant/\[participantId\]
mkdir -p $TARGET_DIR/app/api/badge/og/\[participantId\]
mkdir -p $TARGET_DIR/app/api/profile/\[slug\]
mkdir -p $TARGET_DIR/app/p/\[number\]
mkdir -p $TARGET_DIR/app/profile
mkdir -p $TARGET_DIR/app/fonts

mkdir -p $TARGET_DIR/components/badge
mkdir -p $TARGET_DIR/components/profile/overview
mkdir -p $TARGET_DIR/components/profile/social-links
mkdir -p $TARGET_DIR/components/ui

mkdir -p $TARGET_DIR/hooks
mkdir -p $TARGET_DIR/lib/validations

mkdir -p $TARGET_DIR/public/onboarding
mkdir -p $TARGET_DIR/public/sounds
```

### 2. Copy Profile Components

```bash
# Copy all profile components
cp $SOURCE_DIR/components/profile/achievements.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/overview.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/panel.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/profile-cover.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/profile-edit-modal.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/profile-header.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/separator.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/social-links.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/tech-stack.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/verified-icon.tsx $TARGET_DIR/components/profile/

# Copy nested profile components
cp $SOURCE_DIR/components/profile/overview/intro-item.tsx $TARGET_DIR/components/profile/overview/
cp $SOURCE_DIR/components/profile/social-links/social-link-item.tsx $TARGET_DIR/components/profile/social-links/
```

### 3. Copy Badge Components

```bash
# Copy badge components
cp $SOURCE_DIR/components/badge/badge-preview.tsx $TARGET_DIR/components/badge/
cp $SOURCE_DIR/components/badge/badge-preview-3d.tsx $TARGET_DIR/components/badge/
cp $SOURCE_DIR/components/badge/badge-studio.tsx $TARGET_DIR/components/badge/
```

### 4. Copy UI Components

```bash
# Copy required UI components
cp $SOURCE_DIR/components/ui/button.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/dialog.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/form.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/pixel-button.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/retro-card.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/retro-input.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/retro-textarea.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/simple-tooltip.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/terminal-text.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/tooltip.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/card.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/input.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/label.tsx $TARGET_DIR/components/ui/
cp $SOURCE_DIR/components/ui/textarea.tsx $TARGET_DIR/components/ui/
```

### 5. Copy API Routes

```bash
# Copy profile API routes
cp $SOURCE_DIR/app/api/profile/route.ts $TARGET_DIR/app/api/profile/
cp "$SOURCE_DIR/app/api/profile/[slug]/route.ts" "$TARGET_DIR/app/api/profile/[slug]/"

# Copy badge API routes
cp "$SOURCE_DIR/app/api/badge/participant/[participantId]/route.ts" "$TARGET_DIR/app/api/badge/participant/[participantId]/"
```

### 6. Copy Pages

```bash
# Copy profile pages
cp "$SOURCE_DIR/app/p/[number]/page.tsx" "$TARGET_DIR/app/p/[number]/"
cp $SOURCE_DIR/app/profile/page.tsx $TARGET_DIR/app/profile/
```

### 7. Copy Library Files

```bash
# Copy core library files
cp $SOURCE_DIR/lib/db.ts $TARGET_DIR/lib/
cp $SOURCE_DIR/lib/generate-badge.tsx $TARGET_DIR/lib/
cp $SOURCE_DIR/lib/schema.ts $TARGET_DIR/lib/
cp $SOURCE_DIR/lib/utils.ts $TARGET_DIR/lib/

# Copy validation schemas
cp $SOURCE_DIR/lib/validations/profile.ts $TARGET_DIR/lib/validations/
```

### 8. Copy Hooks

```bash
# Copy hooks
cp $SOURCE_DIR/hooks/use-click-sound.ts $TARGET_DIR/hooks/
```

### 9. Copy Configuration Files

```bash
# Copy drizzle config
cp $SOURCE_DIR/drizzle.config.ts $TARGET_DIR/
```

### 10. Copy Fonts

```bash
# Copy Adelle Mono fonts (required for badge generation)
cp -r "$SOURCE_DIR/app/fonts/Adelle Mono" "$TARGET_DIR/app/fonts/"
```

### 11. Copy Public Assets

```bash
# Copy badge templates
cp $SOURCE_DIR/public/onboarding/THC-IA\ HACK\ PE-ID-*.svg $TARGET_DIR/public/onboarding/
cp $SOURCE_DIR/public/onboarding/THC-IA\ HACK\ PE-ID-*.png $TARGET_DIR/public/onboarding/

# Copy sound files
cp $SOURCE_DIR/public/sounds/*.mp3 $TARGET_DIR/public/sounds/

# Copy logo
cp $SOURCE_DIR/public/thc.svg $TARGET_DIR/public/
```

---

## One-Liner Copy Script

```bash
#!/bin/bash
# Save as copy-profile-badge.sh and run with: bash copy-profile-badge.sh

SOURCE_DIR="/Users/cris/hackathons/ia-hackathon-peru"
TARGET_DIR="/path/to/your/target-project"

# Create directories
mkdir -p $TARGET_DIR/app/api/badge/participant/\[participantId\] \
         $TARGET_DIR/app/api/badge/og/\[participantId\] \
         $TARGET_DIR/app/api/profile/\[slug\] \
         $TARGET_DIR/app/p/\[number\] \
         $TARGET_DIR/app/profile \
         $TARGET_DIR/app/fonts \
         $TARGET_DIR/components/badge \
         $TARGET_DIR/components/profile/overview \
         $TARGET_DIR/components/profile/social-links \
         $TARGET_DIR/components/ui \
         $TARGET_DIR/hooks \
         $TARGET_DIR/lib/validations \
         $TARGET_DIR/public/onboarding \
         $TARGET_DIR/public/sounds

# Copy profile components
cp $SOURCE_DIR/components/profile/{achievements,overview,panel,profile-cover,profile-edit-modal,profile-header,separator,social-links,tech-stack,verified-icon}.tsx $TARGET_DIR/components/profile/
cp $SOURCE_DIR/components/profile/overview/intro-item.tsx $TARGET_DIR/components/profile/overview/
cp $SOURCE_DIR/components/profile/social-links/social-link-item.tsx $TARGET_DIR/components/profile/social-links/

# Copy badge components
cp $SOURCE_DIR/components/badge/{badge-preview,badge-preview-3d,badge-studio}.tsx $TARGET_DIR/components/badge/

# Copy UI components
cp $SOURCE_DIR/components/ui/{button,dialog,form,pixel-button,retro-card,retro-input,retro-textarea,simple-tooltip,terminal-text,tooltip,card,input,label,textarea}.tsx $TARGET_DIR/components/ui/ 2>/dev/null || true

# Copy API routes
cp $SOURCE_DIR/app/api/profile/route.ts $TARGET_DIR/app/api/profile/
cp "$SOURCE_DIR/app/api/profile/[slug]/route.ts" "$TARGET_DIR/app/api/profile/[slug]/"
cp "$SOURCE_DIR/app/api/badge/participant/[participantId]/route.ts" "$TARGET_DIR/app/api/badge/participant/[participantId]/"

# Copy pages
cp "$SOURCE_DIR/app/p/[number]/page.tsx" "$TARGET_DIR/app/p/[number]/"
cp $SOURCE_DIR/app/profile/page.tsx $TARGET_DIR/app/profile/

# Copy library files
cp $SOURCE_DIR/lib/{db,generate-badge,schema,utils}.ts $TARGET_DIR/lib/ 2>/dev/null || true
cp $SOURCE_DIR/lib/generate-badge.tsx $TARGET_DIR/lib/
cp $SOURCE_DIR/lib/validations/profile.ts $TARGET_DIR/lib/validations/

# Copy hooks
cp $SOURCE_DIR/hooks/use-click-sound.ts $TARGET_DIR/hooks/

# Copy config
cp $SOURCE_DIR/drizzle.config.ts $TARGET_DIR/

# Copy fonts
cp -r "$SOURCE_DIR/app/fonts/Adelle Mono" "$TARGET_DIR/app/fonts/"

# Copy public assets
cp $SOURCE_DIR/public/onboarding/THC-IA\ HACK\ PE-ID-*.svg $TARGET_DIR/public/onboarding/ 2>/dev/null || true
cp $SOURCE_DIR/public/onboarding/THC-IA\ HACK\ PE-ID-*.png $TARGET_DIR/public/onboarding/ 2>/dev/null || true
cp $SOURCE_DIR/public/sounds/*.mp3 $TARGET_DIR/public/sounds/ 2>/dev/null || true
cp $SOURCE_DIR/public/thc.svg $TARGET_DIR/public/ 2>/dev/null || true

echo "✅ Profile and Badge components copied successfully!"
```

---

## Database Schema

### Participants Table

```typescript
// lib/schema.ts - Relevant fields for profile & badge
export const participants = pgTable("participants", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  organization: text("organization"),
  role: text("role").default("PARTICIPANTE"),
  
  // Profile fields
  profilePhotoUrl: text("profile_photo_url"),
  profilePhotoAiUrl: text("profile_photo_ai_url"),
  badgeBlobUrl: text("badge_blob_url"),
  
  // Social & bio
  bio: text("bio"),
  techStack: text("tech_stack").array(),
  experienceLevel: text("experience_level"),
  linkedinUrl: text("linkedin_url"),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  websiteUrl: text("website_url"),
  
  // Badge generation
  participantNumber: integer("participant_number").unique(),
  badgeGeneratedAt: timestamp("badge_generated_at"),
  lastBadgeGenerationAt: timestamp("last_badge_generation_at"),
  
  // Registration
  registrationStatus: text("registration_status").default("in_progress"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Migration SQL

```sql
-- Create participants table
CREATE TABLE participants (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  organization TEXT,
  role TEXT DEFAULT 'PARTICIPANTE',
  
  profile_photo_url TEXT,
  profile_photo_ai_url TEXT,
  badge_blob_url TEXT,
  
  bio TEXT,
  tech_stack TEXT[],
  experience_level TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  website_url TEXT,
  
  participant_number INTEGER UNIQUE,
  badge_generated_at TIMESTAMP,
  last_badge_generation_at TIMESTAMP,
  
  registration_status TEXT DEFAULT 'in_progress',
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX idx_participants_clerk_user_id ON participants(clerk_user_id);
CREATE INDEX idx_participants_participant_number ON participants(participant_number);
CREATE INDEX idx_participants_registration_status ON participants(registration_status);
```

---

## Environment Variables

```bash
# .env.local

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Vercel Blob Storage (for badge images)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Vercel Environment (for badge URL generation)
VERCEL_ENV="production"
VERCEL_PROJECT_PRODUCTION_URL="your-domain.com"
```

---

## Component Dependencies Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PUBLIC PROFILE PAGE                          │
│                      /app/p/[number]/page.tsx                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│ ProfileHeader │        │   Overview    │        │  Achievements │
│  (avatar,     │        │  (org, links) │        │   (badge 3D)  │
│   name, bio)  │        └───────┬───────┘        └───────┬───────┘
└───────────────┘                │                        │
        │                        ▼                        ▼
        │                ┌───────────────┐        ┌───────────────┐
        │                │   IntroItem   │        │BadgePreview3D │
        │                └───────────────┘        └───────┬───────┘
        │                                                 │
        ▼                                                 ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│  VerifiedIcon │        │  SocialLinks  │        │    Atropos    │
└───────────────┘        └───────┬───────┘        │   (3D effect) │
                                 │                └───────────────┘
                                 ▼
                         ┌───────────────┐
                         │SocialLinkItem │
                         └───────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     BADGE GENERATION FLOW                           │
└─────────────────────────────────────────────────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│  lib/generate │        │    satori     │        │    sharp      │
│  -badge.tsx   │───────▶│  (SVG text)   │───────▶│  (composite)  │
└───────────────┘        └───────────────┘        └───────────────┘
        │                                                 │
        ▼                                                 ▼
┌───────────────┐                                ┌───────────────┐
│    qrcode     │                                │ @vercel/blob  │
│  (QR buffer)  │                                │  (upload)     │
└───────────────┘                                └───────────────┘
```

---

## CSS Utilities Required

Add these utilities to your `globals.css`:

```css
/* Profile-specific utilities */
.screen-line-before {
  @apply relative before:absolute before:top-0 before:-left-[100vw] before:-z-10 before:h-px before:w-[200vw] before:bg-edge;
}

.screen-line-after {
  @apply relative after:absolute after:bottom-0 after:-left-[100vw] after:-z-10 after:h-px after:w-[200vw] after:bg-edge;
}

.dither-bg {
  background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: 6px 6px;
}

.dark .dither-bg {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
}

/* Scanlines effect */
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px);
  pointer-events: none;
  z-index: 10;
}

/* Blink animation */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.blink {
  animation: blink 1s step-end infinite;
}

/* Pixel press animation */
.pixel-press:active {
  transform: translateY(2px);
}
```

---

## CSS Variables Required

```css
:root {
  --brand-red: #B91F2E;
  --edge: color-mix(in oklab, var(--border) 64%, var(--background));
}
```

---

## Next.js Config Updates

Update `next.config.ts` for external images:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // Add other domains for profile photos if needed
    ],
  },
};
```

---

## Post-Migration Checklist

- [ ] Install all required dependencies
- [ ] Copy all files using the commands above
- [ ] Set up environment variables
- [ ] Run database migrations
- [ ] Update badge template SVG/PNG files with your branding
- [ ] Test profile API routes
- [ ] Test badge generation
- [ ] Verify public profile page renders correctly
- [ ] Test profile editing functionality

---

## Customization Notes

### Changing Badge Templates
1. Replace SVG/PNG files in `public/onboarding/`
2. Update `getBadgeTemplatePath()` in `lib/generate-badge.tsx`
3. Adjust `BADGE_CONFIG` positions in both `generate-badge.tsx` and `badge-preview.tsx`

### Changing Role Types
1. Update the role map in `lib/generate-badge.tsx` (`getBadgeTemplatePath` and `getRoleDisplayText`)
2. Update `badge-preview.tsx` (`getBadgeTemplateSrc`)
3. Add new SVG templates to `public/onboarding/`

### Removing Retro/Sound Effects
1. Remove `use-click-sound.ts` hook
2. Remove sound-related code from UI components
3. Delete `public/sounds/` directory

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Source Project**: IA Hackathon Peru
