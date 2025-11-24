# 🔧 Badge Generation Fix - IA Hackathon Peru

## Problem Identified

**Symptom**: Badge not found after pixel art generation
- Pixel art generates successfully ✅
- Badge generation triggered but fails silently ❌
- GET `/api/badge/[participantId]` returns 404 ❌
- UI stuck showing "Generate Animated Image" section

---

## Root Cause Analysis

### Issue 1: Silent Server-Side Failure
**Location**: `lib/actions/badge-pixel-art.ts:205-217`

**Original Code**:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
await fetch(`${baseUrl}/api/badge/generate`, {
  method: "POST",
  body: JSON.stringify({ participantId })
})
```

**Problem**:
- `NEXT_PUBLIC_APP_URL` not set in `.env.local`
- Server-side `fetch()` to localhost may fail/hang
- Error swallowed by `console.warn()` - no visibility

### Issue 2: No Client-Side Fallback
**Location**: `components/onboarding/pixel-art-generator.tsx`

**Problem**:
- Pixel art mutation succeeds
- BUT no badge generation trigger on success
- User sees pixel art but no badge appears

### Issue 3: No Manual Recovery
**Location**: `app/onboarding/complete/page.tsx`

**Problem**:
- If automatic badge generation fails
- No way for user to manually trigger it
- Dead end UX

---

## Solution Implemented

### ✅ Fix 1: Remove Server-Side Fetch
**File**: `lib/actions/badge-pixel-art.ts`

**Changes**:
- Removed unreliable `fetch()` to `NEXT_PUBLIC_APP_URL`
- Server action now returns `participantId` in result
- Client-side handles badge generation trigger

**Before**:
```typescript
if (participant?.participantNumber) {
  console.log("[badge-pixel-art] Triggering badge regeneration")
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    await fetch(`${baseUrl}/api/badge/generate`, { ... })
  } catch (error) {
    console.warn("[badge-pixel-art] Badge regeneration failed (non-critical):", error)
  }
}

return { imageUrl: blobResult.url, requestId: ... }
```

**After**:
```typescript
// Just return the data, let client handle badge trigger
return { 
  imageUrl: blobResult.url, 
  requestId: result.requestId || `gen-${timestamp}`,
  participantId,  // ← Added for client-side use
}
```

---

### ✅ Fix 2: Add Client-Side Badge Trigger
**File**: `components/onboarding/pixel-art-generator.tsx`

**Changes**:
- Import `useQueryClient` from `@tanstack/react-query`
- Add `onSuccess` callback to mutation
- Trigger badge generation after pixel art success
- Invalidate badge query to refetch

**Code Added**:
```typescript
import { useQueryClient } from "@tanstack/react-query"

const queryClient = useQueryClient()

const handleGenerate = async () => {
  if (!photoBase64) return

  generatePixelArt(
    { participantId, imageBase64: photoBase64 },
    {
      onSuccess: async () => {
        console.log("[PixelArtGenerator] Pixel art generated, triggering badge generation")
        
        try {
          const badgeResponse = await fetch("/api/badge/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ participantId }),
          })

          if (badgeResponse.ok) {
            console.log("[PixelArtGenerator] Badge generated successfully")
            // Refetch badge to show in UI
            queryClient.invalidateQueries({ queryKey: ["badge", participantId] })
          } else {
            console.error("[PixelArtGenerator] Badge generation failed:", await badgeResponse.text())
          }
        } catch (badgeError) {
          console.error("[PixelArtGenerator] Badge generation error:", badgeError)
        }
      },
    }
  )
}
```

---

### ✅ Fix 3: Add Manual "Generate Badge" Button
**File**: `app/onboarding/complete/page.tsx`

**Changes**:
- Add `handleGenerateBadge()` function
- Show fallback UI if badge doesn't exist but participant number assigned
- Allow user to manually trigger badge generation

**Code Added**:
```typescript
const handleGenerateBadge = async () => {
  if (!participant?.id) return

  try {
    const response = await fetch("/api/badge/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: participant.id }),
    })

    if (response.ok) {
      window.location.reload()  // Reload to show new badge
    } else {
      console.error("Badge generation failed:", await response.text())
      alert("Error generando badge. Por favor, recarga la página.")
    }
  } catch (error) {
    console.error("Badge generation error:", error)
    alert("Error generando badge. Por favor, recarga la página.")
  }
}

// In JSX:
{badgeLoading ? (
  <Spinner />
) : !badge && participant?.participantNumber ? (
  <div className="text-center py-12 space-y-4">
    <p className="text-muted-foreground">
      Tu badge aún no ha sido generado.
    </p>
    <Button onClick={handleGenerateBadge} size="lg">
      Generar Badge Ahora
    </Button>
  </div>
) : badge ? (
  <BadgeDisplay />
) : null}
```

---

## Flow Diagram

### **New Badge Generation Flow**

```
User uploads photo
      ↓
[PixelArtGenerator] Click "Generate Pixel Art"
      ↓
Server action: generateBadgePixelArt()
      ├─ Upload to fal.ai
      ├─ Generate pixel art
      ├─ Remove background
      ├─ Upload to Vercel Blob
      └─ Update participant.profilePhotoBlobUrl
      ↓
Client receives success ✅
      ↓
onSuccess callback triggers:
      ├─ POST /api/badge/generate
      │     ├─ Generate 5 badge variants
      │     ├─ Upload all to Vercel Blob
      │     └─ Save to participant_badges table
      └─ Invalidate badge query
      ↓
useBadge() refetches automatically
      ↓
Badge appears in UI! 🎉

──────────────────────────────
FALLBACK (if badge generation fails):

Badge not found
      ↓
Show "Generar Badge Ahora" button
      ↓
User clicks button
      ↓
POST /api/badge/generate
      ↓
Reload page
      ↓
Badge appears! ✅
```

---

## Files Modified

```
lib/actions/badge-pixel-art.ts
├─ Line 13-16: Added participantId to GenerationResult type
└─ Line 199-219: Removed server-side fetch, return participantId

components/onboarding/pixel-art-generator.tsx
├─ Line 3: Import useQueryClient
├─ Line 22: Initialize queryClient
└─ Line 117-145: Add onSuccess callback with badge trigger

app/onboarding/complete/page.tsx
├─ Line 17-36: Add handleGenerateBadge function
└─ Line 92-99: Add fallback UI with manual button
```

---

## Testing Checklist

### **Scenario 1: Happy Path**
- [ ] User completes onboarding
- [ ] Uploads photo in PixelArtGenerator
- [ ] Clicks "Generate Pixel Art"
- [ ] Wait 10-15 seconds
- [ ] Pixel art appears ✅
- [ ] Badge automatically generates ✅
- [ ] All 5 variants downloadable ✅

### **Scenario 2: Badge Generation Fails**
- [ ] Pixel art generates successfully
- [ ] Badge generation fails (network error, etc.)
- [ ] UI shows "Generar Badge Ahora" button ✅
- [ ] User clicks button
- [ ] Badge generates and page reloads ✅

### **Scenario 3: Rate Limiting**
- [ ] Generate pixel art once
- [ ] Try again immediately
- [ ] See cooldown timer ✅
- [ ] Wait 5 minutes
- [ ] Can generate again ✅

---

## Error Handling Improvements

### **Before** (Silent Failures):
```typescript
} catch (error) {
  console.warn("[badge-pixel-art] Badge regeneration failed (non-critical):", error)
}
// User never knows it failed!
```

### **After** (Visible Feedback):
```typescript
} catch (badgeError) {
  console.error("[PixelArtGenerator] Badge generation error:", badgeError)
  // Client-side can show error to user
  // OR fallback button appears
}
```

---

## Performance Notes

### **Before**:
- Server action makes HTTP fetch to itself
- Extra network roundtrip
- Potential timeout issues

### **After**:
- Server action returns immediately
- Client makes direct API call (faster)
- Better error visibility
- More reliable

---

## Future Improvements

- [ ] Add loading spinner during badge generation
- [ ] Show toast notification on badge success/failure  
- [ ] Add retry logic with exponential backoff
- [ ] Queue badge generation jobs (e.g., BullMQ)
- [ ] Add webhook to notify when badge is ready
- [ ] Cache badge generation to avoid regenerating unnecessarily

---

**Status**: ✅ FIXED  
**Lint**: ✅ PASSING  
**Ready for Testing**: YES 🚀
