# 🔄 Auto-Create Participants Migration Summary

## What Changed

### Before (Pre-populated Model)
- Admin manually inserts participants into database
- User signs in → System checks if email exists
- If found → Links Clerk user to participant
- If not found → "Not invited" error

### After (Auto-Create Model)
- Admin creates users in Clerk dashboard
- User signs in → System auto-creates participant
- Participant gets Clerk userId, email, name
- All authenticated users can fill forms

---

## Files Modified

### 1. Database Schema (`lib/schema.ts`)
**Removed:**
- `invitedAt` field
- `invitedBy` field

**Changed:**
- `clerkUserId` → Now `NOT NULL` (required)
- `registrationStatus` default → Changed from "invited" to "in_progress"

**Migration Generated:**
- `migrations/0006_round_blacklash.sql`

### 2. API Route (`app/api/onboarding/route.ts`)
**Removed:**
- `POST` endpoint (claiming)
- Email-based lookup

**Changed:**
- `GET` endpoint now:
  - Uses `auth()` to get Clerk userId
  - Looks up participant by `clerkUserId`
  - Auto-creates if not found
  - Pre-fills from Clerk user data

### 3. Hook (`hooks/use-participant.ts`)
**Removed:**
- `email` parameter
- `claimParticipant` mutation

**Simplified:**
- Fetches participant automatically (no params)
- Only has `updateParticipant` mutation

### 4. Onboarding Page (`app/onboarding/page.tsx`)
**Removed:**
- "Not invited" message component
- Email prop from `useParticipant()`
- Claiming logic in `useEffect`

**Simplified:**
- Just fetches participant
- Redirects if completed
- Shows loading state

### 5. Completion Page (`app/onboarding/complete/page.tsx`)
**Changed:**
- Removed `user` import
- Removed email prop from `useParticipant()`

---

## Database Migration Required

### Run Migration
```bash
bun drizzle-kit push
```

This will:
1. Drop `invited_at` column
2. Drop `invited_by` column
3. Make `clerk_user_id` NOT NULL
4. Update default for `registration_status`

### ⚠️ Important
- **Backup your database first** if you have existing data
- Existing participants without `clerk_user_id` will cause errors
- Recommended: Start fresh or migrate existing data first

---

## How to Test

### 1. Create Clerk User
1. Go to Clerk Dashboard
2. Navigate to "Users"
3. Click "Create User"
4. Enter email (e.g., `test@example.com`)
5. Set password

### 2. Test Sign-In
1. Visit `http://localhost:3000`
2. Click "INICIA SESIÓN PARA REGISTRARTE"
3. Sign in with Clerk user
4. Should redirect to `/onboarding`
5. Should see dashboard (no errors)

### 3. Verify Database
```sql
SELECT id, clerk_user_id, email, full_name, registration_status 
FROM participants 
WHERE email = 'test@example.com';
```

Should show:
- `clerk_user_id` = Clerk user ID (e.g., `user_abc123`)
- `email` = from Clerk
- `full_name` = from Clerk (if set)
- `registration_status` = 'in_progress'

### 4. Test Persistence
1. Refresh page
2. Should still see dashboard
3. Participant should NOT be created again
4. Same participant record used

---

## Benefits

✅ **Simpler Setup** - No pre-population needed  
✅ **Automatic** - Participant created on first sign-in  
✅ **Secure** - Only Clerk users can access  
✅ **No Errors** - No "not invited" messages  
✅ **Data-Rich** - Auto-fills from Clerk  
✅ **Clerk-Managed** - Single source of truth for users

---

## Admin Workflow

### Old Workflow
1. Admin creates participant in database (SQL/API)
2. Admin creates user in Clerk
3. User signs in
4. System links them

### New Workflow
1. Admin creates user in Clerk ✅ (That's it!)
2. User signs in
3. System auto-creates participant

---

## Rollback Plan

If needed, rollback steps:

1. Restore database backup
2. Git revert changes:
   ```bash
   git log --oneline  # Find commit hash
   git revert <commit-hash>
   ```
3. Re-run old migrations
4. Update `.env.local` if needed

---

## Next Steps

1. ✅ Push migration to database
2. ✅ Create test user in Clerk
3. ✅ Test auto-creation flow
4. 🚧 Build step forms (2-5)
5. 🚧 Implement file uploads
6. 🚧 Add validation

---

**Migration Date**: November 2024  
**Status**: Ready to deploy
