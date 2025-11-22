# IA Hackathon Peru 2025 - Onboarding Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `FAL_API_KEY` - FAL AI key (for avatar generation)
- `GROQ_API_KEY` - Groq API key (for chat/content generation)

### 3. Configure Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select existing
3. **Important**: Disable sign-up in Clerk settings
   - Go to "User & Authentication" → "Email, Phone, Username"
   - Disable "Allow sign-ups"
4. Enable sign-in methods:
   - Email/Password
   - Google OAuth (optional)
5. Set redirect URLs:
   - After sign-in: `/onboarding`
   - Sign-in URL: `/sign-in`

### 4. Run Database Migrations

```bash
# Generate migration (if not already done)
bun drizzle-kit generate

# Push to database
bun drizzle-kit push
```

This will create 3 new tables:
- `participants` - Main participant data
- `participant_avatars` - AI-generated avatars
- `social_posts` - Generated social media content

### 5. Start Development Server

```bash
bun dev
```

Visit `http://localhost:3000`

---

## 📊 Database Schema

### Participants Table
Pre-populated by admins with email addresses. Users claim their registration by signing in.

**Key fields:**
- `email` (unique) - Used to match user on sign-in
- `clerkUserId` - Linked when user claims registration
- `registrationStatus` - `invited` → `in_progress` → `completed`
- `currentStep` - Tracks onboarding progress (1-5)

### Workflow
1. **Admin** creates participant with email → Status: `invited`
2. **User** signs in with that email → Status: `in_progress`, `clerkUserId` linked
3. **User** completes forms → Status: `completed`

---

## 🔐 Authentication Flow

### Sign-In Only (No Sign-Up)
Users **cannot** create new accounts. They must:
1. Be pre-added to database by admin
2. Sign in with the email used by admin
3. If email not found → "Not invited" error

### Clerk Configuration
```typescript
// middleware.ts - Public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/tta(.*)',
  '/api/chat(.*)',
  '/api/gallery(.*)',
  '/sign-in(.*)',
])

// All other routes require auth
```

---

## 📝 Admin Tasks

### Pre-populate Participants
You need to manually insert participant records into the database:

```sql
INSERT INTO participants (email, full_name, invited_by)
VALUES 
  ('participant1@example.com', 'Juan Pérez', 'admin@hackathon.pe'),
  ('participant2@example.com', 'María García', 'admin@hackathon.pe');
```

Or use the admin dashboard (coming soon) to bulk upload via CSV.

### Bulk CSV Import (Future)
CSV format:
```csv
email,full_name
participant@example.com,Full Name
```

---

## 🎨 Customization

### Brand Colors
Defined in `app/globals.css`:
- Brand Red: `#B91F2E`
- Use `bg-brand-red` or `text-brand-red` in components

### Fonts
- Headings: Adelle Mono
- Body: Geist Sans
- Code: Geist Mono

---

## 🧪 Testing Locally

### 1. Create Test Participant
```sql
INSERT INTO participants (email, invited_at)
VALUES ('test@example.com', NOW());
```

### 2. Create Clerk Test Account
- Sign in to Clerk with `test@example.com`
- Should redirect to `/onboarding`
- Participant should be claimed automatically

### 3. Test Flow
1. Visit `/sign-in`
2. Sign in with test email
3. Should see onboarding dashboard
4. Complete steps (forms to be implemented)
5. Should redirect to `/onboarding/complete`

---

## 📁 File Structure

```
app/
├── onboarding/
│   ├── page.tsx              # Main onboarding dashboard
│   ├── layout.tsx            # Protected layout
│   └── complete/
│       └── page.tsx          # Success page
├── sign-in/
│   └── [[...sign-in]]/
│       └── page.tsx          # Clerk sign-in
└── api/
    └── onboarding/
        └── route.ts          # GET/POST/PATCH participant

components/
├── onboarding/               # Step forms (to be created)
└── ui/                       # Shared UI components

hooks/
└── use-participant.ts        # Participant data management

lib/
├── schema.ts                 # Database schema
└── db.ts                     # Drizzle instance

middleware.ts                 # Clerk auth protection
```

---

## 🐛 Troubleshooting

### "Not invited" error
- Check if participant exists in database
- Verify email matches exactly (case-sensitive)
- Run: `SELECT * FROM participants WHERE email = 'user@example.com';`

### Database connection errors
- Verify `DATABASE_URL` in `.env.local`
- Test connection: `bun drizzle-kit studio`

### Clerk errors
- Check publishable/secret keys
- Verify sign-up is disabled in Clerk dashboard
- Clear browser cache/cookies

---

## 🚢 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Migration
Run migrations before deploying:
```bash
bun drizzle-kit push
```

### Post-Deployment
1. Verify Clerk webhooks (if using)
2. Test sign-in flow
3. Pre-populate participants
4. Send invitation emails

---

## 📧 Next Steps

### Immediate
- [ ] Set up Clerk account
- [ ] Configure database
- [ ] Run migrations
- [ ] Create test participant
- [ ] Test sign-in flow

### Phase 2 (To Implement)
- [ ] Build step 2-5 form components
- [ ] Add file upload for profile photos
- [ ] Create admin dashboard
- [ ] Add email notifications
- [ ] Implement AI social kit

---

## 🆘 Support

For issues or questions:
- WhatsApp: [Event Group](https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR)
- GitHub Issues: [Report Issue](https://github.com/...)

---

Built with ❤️ for IA Hackathon Peru 2025
