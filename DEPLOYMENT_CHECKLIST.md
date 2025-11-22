# ✅ Deployment Checklist - Auto-Create Onboarding

## 🚀 Ready to Deploy

All code changes are complete. Follow these steps to deploy:

---

## 1️⃣ Push Database Migration

### Option A: Using Drizzle Kit (Recommended)
```bash
# Push migration to database
bun drizzle-kit push
```

### Option B: Manual SQL (if needed)
```sql
-- Drop old columns
ALTER TABLE participants DROP COLUMN IF EXISTS invited_at;
ALTER TABLE participants DROP COLUMN IF EXISTS invited_by;

-- Make clerk_user_id required
ALTER TABLE participants ALTER COLUMN clerk_user_id SET NOT NULL;

-- Update default status
ALTER TABLE participants ALTER COLUMN registration_status SET DEFAULT 'in_progress';
```

---

## 2️⃣ Verify Environment Variables

Ensure `.env.local` has:
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
BLOB_READ_WRITE_TOKEN=...
FAL_API_KEY=...
GROQ_API_KEY=...
```

---

## 3️⃣ Create Test User in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to "Users" → "Create User"
3. Enter test email: `test@yourdomain.com`
4. Set password
5. Click "Create"

---

## 4️⃣ Test Locally

```bash
# Start dev server
bun dev

# Open browser
open http://localhost:3000
```

### Test Steps:
1. ✅ Click "INICIA SESIÓN PARA REGISTRARTE"
2. ✅ Sign in with test Clerk user
3. ✅ Should redirect to `/onboarding`
4. ✅ Should see dashboard (no errors)
5. ✅ Should show email confirmed ✓
6. ✅ Should show "Paso 1 de 5"

### Verify Database:
```bash
# Check participant was created
bun drizzle-kit studio

# Or via SQL
psql $DATABASE_URL -c "SELECT * FROM participants;"
```

Should show:
- `clerk_user_id` populated
- `email` from Clerk
- `full_name` from Clerk (if set)
- `registration_status` = 'in_progress'

---

## 5️⃣ Deploy to Production

### Vercel Deployment
```bash
# Commit changes
git add .
git commit -m "Implement auto-create participant flow"
git push origin main

# Vercel will auto-deploy
```

### Environment Variables (Vercel)
Add to Vercel Dashboard → Settings → Environment Variables:
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `FAL_API_KEY`
- `GROQ_API_KEY`

### Run Migration on Production
```bash
# Option A: From local (if DATABASE_URL points to prod)
bun drizzle-kit push

# Option B: Via Vercel CLI
vercel env pull
bun drizzle-kit push
```

---

## 6️⃣ Configure Clerk for Production

### 1. Update Clerk Settings
- Go to Clerk Dashboard
- Select your application
- Navigate to "Paths"
- Set:
  - Sign-in URL: `/sign-in`
  - After sign-in: `/onboarding`

### 2. Disable Sign-Ups
- Go to "Settings" → "Restrictions"
- Toggle OFF "Enable sign-ups"
- This ensures only manually created users can sign in

### 3. Add Production Domain
- Go to "Domains"
- Add `yourapp.vercel.app` or custom domain
- Update `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` if needed

---

## 7️⃣ Create Production Users

### Bulk Create (Recommended)
Use Clerk API or dashboard to create users:

```bash
# Example: Bulk import via Clerk API
curl -X POST https://api.clerk.com/v1/users \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email_address": ["user1@example.com"],
    "password": "SecurePassword123!"
  }'
```

### Manual Create
1. Go to Clerk Dashboard → Users
2. Click "Create User"
3. Enter participant email
4. Set password
5. Repeat for each participant

---

## 8️⃣ Test Production

1. Visit production URL
2. Sign in with a test Clerk user
3. Verify:
   - Redirects to `/onboarding`
   - Dashboard loads
   - No console errors
   - Participant auto-created in database

---

## 9️⃣ Monitor & Verify

### Check Database
```sql
-- Count participants
SELECT COUNT(*) FROM participants;

-- Check recent sign-ups
SELECT email, full_name, created_at 
FROM participants 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Clerk Logs
- Clerk Dashboard → Logs
- Verify sign-in events
- Check for errors

### Monitor API Routes
- Check Vercel logs
- Look for `/api/onboarding` calls
- Verify no 500 errors

---

## 🐛 Troubleshooting

### Issue: "Database not configured"
**Fix**: Ensure `DATABASE_URL` is set in `.env.local`

### Issue: "Unauthorized" when accessing `/onboarding`
**Fix**: User is not signed in. Check Clerk middleware.

### Issue: Participant not created
**Fix**: Check API logs. Verify Clerk user has email address.

### Issue: "clerk_user_id violates not-null constraint"
**Fix**: Migration not applied. Run `bun drizzle-kit push`

### Issue: Multiple participants created for same user
**Fix**: Check unique constraint on `clerk_user_id`. Should only create once.

---

## ✅ Success Criteria

- [ ] Migration pushed to database
- [ ] Test user created in Clerk
- [ ] Local testing passes
- [ ] Production deployment succeeds
- [ ] Clerk configured correctly
- [ ] Sign-ups disabled
- [ ] Production users created
- [ ] Production testing passes
- [ ] No errors in logs
- [ ] Participants auto-created correctly

---

## 📊 Post-Deployment

### Next Steps
1. Build step 2-5 forms
2. Implement file uploads
3. Add form validation
4. Create admin dashboard
5. Set up email notifications

### Monitoring
- Check database daily for new participants
- Monitor Clerk usage
- Review error logs
- Track completion rates

---

## 🆘 Support

If issues arise:
1. Check Vercel logs
2. Check Clerk dashboard logs
3. Review database with Drizzle Studio
4. Check environment variables
5. Contact team via WhatsApp

---

**Last Updated**: November 2024  
**Status**: Ready for deployment
