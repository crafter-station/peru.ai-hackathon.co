# 🎯 Hackathon Participant Onboarding System

## ✅ What's Been Implemented

### Core Infrastructure
- ✅ **Clerk Authentication** - Sign-in only (no sign-up)
- ✅ **Auto-Create Participants** - Participants created automatically from Clerk users
- ✅ **Database Schema** - 3 tables: participants, participant_avatars, social_posts
- ✅ **Middleware** - Protected routes with Clerk
- ✅ **API Routes** - Participant management (GET/PATCH)

### Pages & Components
- ✅ **Sign-in Page** (`/sign-in`) - Clerk authentication
- ✅ **Onboarding Dashboard** (`/onboarding`) - Main registration page with status
- ✅ **Completion Page** (`/onboarding/complete`) - Success screen
- ✅ **UI Components** - Form, Checkbox, Radio, Progress, Label

### Key Features
- ✅ **Clerk-Managed Users** - Users manually created in Clerk dashboard
- ✅ **Auto-Participant Creation** - First sign-in auto-creates participant record
- ✅ **Status Tracking** - in_progress → completed
- ✅ **No "Not Invited" Errors** - All Clerk users are automatically invited
- ✅ **Pre-filled Data** - Name/email from Clerk user

---

## 🚧 Still To Implement

### Priority: Medium
- [ ] **Step 2-5 Forms** - Personal info, photo upload, preferences, legal
- [ ] **File Upload** - Profile photo to Vercel Blob
- [ ] **Form Validation** - Zod schemas for each step
- [ ] **Auto-save** - Save progress on field blur
- [ ] **Calendar Download** - .ics file generation

### Priority: Low
- [ ] **Admin Dashboard** - View all participants
- [ ] **AI Social Kit** - Avatar & post generation
- [ ] **Email Notifications** - Confirmation emails
- [ ] **Clerk Webhooks** - Sync user updates

---

## 🔧 Setup Instructions

### 1. Environment Variables
Create `.env.local` from `.env.example`:

```bash
# Required
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
BLOB_READ_WRITE_TOKEN=...
```

### 2. Configure Clerk
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. **Disable sign-ups** in settings
3. Enable: Email/Password + Google OAuth
4. Set redirect: After sign-in → `/onboarding`
5. **Manually create users** for each participant

### 3. Run Migrations
```bash
bun drizzle-kit push
```

### 4. Start Development
```bash
bun dev
```

---

## 📊 Database Tables

### `participants`
```sql
- clerk_user_id (unique, NOT NULL) - Primary identifier from Clerk
- email (unique, NOT NULL) - Auto-filled from Clerk
- full_name - Auto-filled from Clerk (firstName + lastName)
- registration_status - in_progress | completed
- current_step - 1-5 tracking
- personal data fields (dni, phone, etc)
- preferences (dietary, tshirt, tech stack)
- legal acceptances (terms, consent, etc)
```

### `participant_avatars`
```sql
- participant_id (FK)
- style - professional | playful | artistic
- image_url, blob_url
```

### `social_posts`
```sql
- participant_id (FK)
- platform - linkedin | instagram | x | whatsapp
- content, image_url
```

---

## 🔄 User Flow

1. **Admin** creates user in Clerk dashboard
2. **User** visits landing page → Clicks "INICIA SESIÓN PARA REGISTRARTE"
3. **User** signs in with Clerk (Email/Password or Google)
4. **System** redirects to `/onboarding`
5. **API** checks if participant exists for this `clerk_user_id`
   - ❌ Not found → **Auto-creates** participant with Clerk data
   - ✅ Found → Returns existing participant
6. **User** sees onboarding dashboard
7. **User** completes forms (to be implemented)
8. **System** marks Status: `completed`
9. **User** redirected to `/onboarding/complete`

---

## 🎨 UI Components Available

```typescript
// Forms
<Form>
  <FormField>
    <FormLabel />
    <FormControl>
      <Input />
    </FormControl>
    <FormMessage />
  </FormField>
</Form>

// Inputs
<Checkbox />
<RadioGroup>
  <RadioGroupItem />
</RadioGroup>
<Progress value={60} />
<Label />
<Input />
<Textarea />
<Select />
<Button />
```

---

## 📁 File Structure

```
app/
├── onboarding/
│   ├── page.tsx              ✅ Main dashboard (updated)
│   ├── layout.tsx            ✅ Protected layout
│   └── complete/
│       └── page.tsx          ✅ Success page (updated)
├── sign-in/
│   └── [[...sign-in]]/
│       └── page.tsx          ✅ Clerk sign-in
└── api/
    └── onboarding/
        └── route.ts          ✅ GET/PATCH (auto-create)

components/
├── onboarding/               ⏳ To be created
│   ├── step-2-personal.tsx
│   ├── step-3-security.tsx
│   ├── step-4-preferences.tsx
│   └── step-5-legal.tsx
└── ui/                       ✅ All created
    ├── form.tsx
    ├── checkbox.tsx
    ├── radio-group.tsx
    ├── progress.tsx
    └── label.tsx

hooks/
└── use-participant.ts        ✅ Updated (no email param)

lib/
├── schema.ts                 ✅ Updated (removed invitedBy/invitedAt)
└── validations/              ⏳ Zod schemas needed
    └── onboarding.ts

middleware.ts                 ✅ Clerk protection
```

---

## 🧪 Testing

### Test Auto-Creation Flow
1. Create user in Clerk dashboard (email: `test@example.com`)
2. Visit `http://localhost:3000`
3. Click "INICIA SESIÓN PARA REGISTRARTE"
4. Sign in with Clerk user
5. Should redirect to `/onboarding`
6. Should see onboarding dashboard
7. Check database - participant should exist with `clerk_user_id`

### Verify Auto-Creation
```sql
SELECT * FROM participants WHERE email = 'test@example.com';
```

Should show:
- `clerk_user_id` populated
- `email` from Clerk
- `full_name` from Clerk (if provided)
- `registration_status` = 'in_progress'
- `current_step` = 1

---

## 🚀 Next Steps

### Immediate (Week 1)
1. Build Step 2: Personal Info Form
   - DNI (8 digits)
   - Full name (pre-filled from Clerk, editable)
   - Date of birth (date picker)
   - Phone number (+51...)

2. Build Step 3: Security & Photo
   - File upload component
   - Upload to Vercel Blob
   - Laptop details (optional)

3. Build Step 4: Preferences
   - Dietary multi-select
   - Food allergies textarea
   - T-shirt size select
   - Tech stack chips
   - Experience level radio

4. Build Step 5: Legal
   - 5 required checkboxes
   - Terms & conditions links
   - Submit button

### Future (Week 2-3)
- Admin dashboard for viewing all participants
- AI social kit generator
- Email notifications
- Clerk webhooks for user sync

---

## 📚 Documentation

- **SETUP.md** - Detailed setup guide
- **ONBOARDING_README.md** (this file) - Implementation status
- **.env.example** - Environment variables template
- **AGENTS.md** - Coding guidelines for AI agents

---

## 🔄 Recent Changes (Nov 2024)

### Migration to Auto-Create Model
- ✅ Removed `invitedBy` and `invitedAt` fields
- ✅ Made `clerkUserId` required (NOT NULL)
- ✅ Changed default `registrationStatus` to "in_progress"
- ✅ Updated API to auto-create participants from Clerk
- ✅ Removed "not invited" error message
- ✅ Simplified hook - no email parameter needed

### New Flow
**Before**: Admin pre-populates participants → User claims by email  
**After**: Admin creates Clerk users → Participant auto-created on sign-in

---

## 🐛 Known Issues

- Form components for steps 2-5 not yet implemented
- No auto-save functionality yet
- No email notifications
- No Clerk webhook sync

---

## 📞 Support

Questions? Contact:
- WhatsApp: https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR

---

**Last Updated**: November 2024  
**Status**: Auto-creation flow complete, forms to be implemented
