# 🎨 Marketing Badge System - IA Hackathon Peru

## Overview
Professional marketing badge system with dark mode design, glowing effects, and tech-style typography. Generates badges in 5 different sizes optimized for social media platforms.

---

## Design Specs

### **Style: Dark Modern + Tech**
- **Background**: Near-black (#0a0a0a)
- **Accent Colors**: Cyan (#00d9ff) + Purple (#7c3aed) gradient
- **Typography**: Monospace + Sans-serif mix
- **Effects**: Glowing borders with SVG filters

### **Badge Variants**

| Variant | Dimensions | Aspect Ratio | Use Case |
|---------|-----------|--------------|----------|
| **Base** | 1600x900 | 16:9 | Website display, downloads |
| **Instagram Square** | 1080x1080 | 1:1 | Instagram posts |
| **Instagram Story** | 1080x1920 | 9:16 | IG Stories, reels |
| **LinkedIn** | 1200x627 | ~1.91:1 | LinkedIn posts |
| **Twitter** | 1500x500 | 3:1 | Twitter header/banner |

---

## Layout Structure

### **Base Badge (1600x900)**

```
┌─────────────────────────────────────────────┐
│          [IA HACKATHON PERU LOGO]           │  ← Header (top 150px)
│                                             │
│         ╔═══════════════════╗               │
│         ║   [PIXEL ART]     ║               │  ← Avatar (400x400)
│         ║    CENTERED       ║               │     with GLOW effect
│         ║   (COLORED)       ║               │
│         ╚═══════════════════╝               │
│                                             │
│       >>> PARTICIPANT_ID:                   │  ← Tech-style label
│              #0001                          │  ← Giant gradient number
│          ANTHONY CUEVA                      │  ← Name (uppercase)
│       ─────────────────                     │  ← Divider line
│        IA HACKATHON PERU                    │  ← Event title
│      2025.11.29-30 | LIMA 🇵🇪              │  ← Date/location
└─────────────────────────────────────────────┘
```

---

## Key Features

### ✅ **Pixel Art Avatar**
- **Size**: 400x400px (Base), 350px (Instagram), 450px (Story)
- **Treatment**: COLORED (not grayscale!) - preserves pixel art colors
- **Frame**: Glowing gradient border (cyan → purple)
- **Effect**: SVG filter with Gaussian blur for neon glow

### ✅ **Typography Hierarchy**

```typescript
PARTICIPANT_ID:     // Monospace, 18px, muted gray, letter-spacing 3px
#0001              // Monospace, 80px, gradient fill, ultra-bold
ANTHONY CUEVA      // Sans-serif, 42px, white, bold uppercase
────────────       // Gradient divider line
IA HACKATHON PERU  // Sans-serif, 28px, gradient, bold
2025.11.29-30      // Monospace, 20px, light gray
```

### ✅ **Gradient Effects**
- **Border Gradient**: Linear from cyan to purple
- **Text Gradient**: Same gradient applied to participant number & event title
- **Glow Filter**: 8px blur for base/Instagram, 10px for Story

---

## API Endpoints

### **POST `/api/badge/generate`**
Generates all 5 badge variants for a participant.

**Request:**
```json
{
  "participantId": "abc123"
}
```

**Response:**
```json
{
  "participantNumber": 1,
  "badgeUrl": "https://...",
  "variants": {
    "linkedin": "https://...",
    "instagram": "https://...",
    "twitter": "https://...",
    "story": "https://..."
  }
}
```

### **GET `/api/badge/[participantId]`**
Fetches existing badge URLs from database.

---

## Database Schema

### **participant_badges**
```sql
CREATE TABLE participant_badges (
  id TEXT PRIMARY KEY,
  participant_id TEXT UNIQUE NOT NULL,
  participant_number INTEGER UNIQUE NOT NULL,
  
  base_badge_url TEXT,
  linkedin_variant_url TEXT,
  instagram_variant_url TEXT,
  twitter_variant_url TEXT,
  story_variant_url TEXT,
  
  generated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## File Structure

```
app/api/badge/
├── generate/
│   └── route.ts                    # Main badge generator
│       ├── generateBaseBadge()
│       ├── generateInstagramVariant()
│       ├── generateStoryVariant()
│       ├── generateLinkedInVariant()
│       └── generateTwitterVariant()
└── [participantId]/
    └── route.ts                    # Fetch badge endpoint

lib/
└── schema.ts                       # Added storyVariantUrl field

migrations/
└── 0009_add_story_variant.sql      # Story variant migration

app/onboarding/complete/
└── page.tsx                        # Enhanced UI with preview grid
```

---

## Usage Flow

### **1. Badge Generation (Automatic)**
Triggered when participant completes onboarding:
```typescript
// After pixel art generation completes
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
await fetch(`${baseUrl}/api/badge/generate`, {
  method: "POST",
  body: JSON.stringify({ participantId })
})
```

### **2. Display on Complete Page**
```tsx
<PixelArtGenerator participantId={participant.id} />
{/* After pixel art is generated, badges auto-regenerate */}

{/* Badge preview grid */}
<div className="grid grid-cols-3 gap-4">
  <Image src={badge.instagramVariantUrl} />
  <Image src={badge.storyVariantUrl} />
  <Image src={badge.linkedinVariantUrl} />
  {/* ... */}
</div>
```

### **3. Download Buttons**
Each variant has its own download button:
```tsx
<Button onClick={() => downloadImage(
  badge.instagramVariantUrl, 
  `ia-hack-badge-instagram-${participantNumber}.png`
)}>
  Download Instagram
</Button>
```

---

## Technical Implementation

### **SVG Glow Effect**
```xml
<defs>
  <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#00d9ff" />
    <stop offset="100%" stop-color="#7c3aed" />
  </linearGradient>
  
  <filter id="glow">
    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
    <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>

<rect 
  x="25" y="25" width="400" height="400"
  fill="none"
  stroke="url(#borderGrad)"
  stroke-width="4"
  rx="16"
  filter="url(#glow)"
/>
```

### **Sharp Image Processing**
```typescript
// Avatar processing (COLORED, not grayscale)
const processedPhoto = await sharp(photoBuffer)
  .resize(400, 400, { fit: "cover" })
  .png()  // NO .greyscale() - keep colors!
  .toBuffer()

// Composite with glow border
await sharp({
  create: { width, height, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 1 } }
})
  .composite([
    { input: processedPhoto, top: 250, left: 600 },
    { input: glowBorderBuffer, top: 225, left: 575, blend: "over" }
  ])
  .png()
  .toBuffer()
```

---

## Marketing Copy Templates

### **Current (Tech Style)**
```
>>> PARTICIPANT_ID:
#0001
ANTHONY CUEVA
─────────────────
IA HACKATHON PERU
2025.11.29-30 | LIMA 🇵🇪
```

### **Alternative Styles**
You can easily swap the text in `participantText` SVG:

**Formal:**
```
OFFICIAL PARTICIPANT
#0001
────────────────
ANTHONY CUEVA
IA HACKATHON PERU 2025
```

**Energetic:**
```
🚀 HACKATHON PARTICIPANT
#0001 · ANTHONY CUEVA
────────────────
IA HACKATHON PERU
29-30 NOV 2025 · LIMA
```

---

## Social Media Download Grid

The complete page now shows:
1. **Large preview** - Base badge (1600x900)
2. **Download grid** - 5 variants with aspect-ratio preserved thumbnails:
   - Instagram Square (1:1)
   - Instagram Story (9:16)
   - LinkedIn Post (~1.91:1)
   - Twitter Banner (3:1)
   - HD Complete (16:9)

---

## Color Palette

```css
--background: #0a0a0a;        /* Near-black */
--accent-cyan: #00d9ff;       /* Bright cyan */
--accent-purple: #7c3aed;     /* Vibrant purple */
--text-primary: #ffffff;      /* Pure white */
--text-secondary: #cccccc;    /* Light gray */
--text-muted: #999999;        /* Muted gray */
```

---

## Future Enhancements

- [ ] Add animated GIF variant (with pulsing glow)
- [ ] QR code linking to participant profile
- [ ] Sponsor logos in footer
- [ ] "Download All" button (ZIP archive)
- [ ] Custom background patterns per participant
- [ ] Achievements/badges overlay
- [ ] Event countdown timer on badge

---

**Created**: November 2025  
**Stack**: Next.js 15, Sharp, Vercel Blob, TypeScript  
**Design**: Dark Mode + Tech + Neon Glow
