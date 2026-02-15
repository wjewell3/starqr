# StarQR - Project Overview for AI Assistants

## What This Project Is

StarQR is a **QR-based digital loyalty card system** for local businesses (coffee shops, ice cream parlors, bagel shops, etc.). It replaces paper punch cards with a simple web app.

## How It Works

1. **Merchant signs up** → creates account, customizes reward
2. **Merchant gets QR code** → prints it, displays at register
3. **Customer scans QR code** → opens web page on their phone
4. **Customer enters phone number** → gets a stamp
5. **After X stamps** → customer gets free reward (e.g., "Free Coffee")

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe (for Pro subscriptions)
- **QR Codes**: `qrcode` library
- **Deployment**: Vercel

## Project Structure

```
app/
├── page.tsx                        # Landing page
├── about/page.tsx                  # About page
├── (auth)/
│   ├── login/page.tsx             # Login
│   └── signup/page.tsx            # Signup
├── onboarding/page.tsx            # New user setup wizard
├── (dashboard)/
│   ├── layout.tsx                 # Dashboard shell with nav
│   └── dashboard/
│       ├── page.tsx               # Main dashboard
│       ├── settings/page.tsx      # Business settings + QR download
│       ├── billing/page.tsx       # Stripe billing portal
│       └── upgrade/page.tsx       # Upgrade to Pro
└── c/[merchantId]/page.tsx        # Customer check-in page

api/
├── checkin/route.ts               # Handle customer check-ins
├── merchant/stats/route.ts        # Dashboard analytics
└── stripe/
    ├── create-checkout/route.ts   # Start Stripe checkout
    ├── portal/route.ts            # Stripe billing portal
    └── webhook/route.ts           # Handle Stripe webhooks

lib/
├── supabase/
│   ├── client.ts                  # Client-side Supabase
│   └── server.ts                  # Server-side Supabase
└── utils/
    └── hash.ts                    # Phone number hashing
```

## Database Schema (Supabase)

```sql
merchants
  - id (uuid, primary key)
  - user_id (uuid, foreign key to auth.users)
  - business_name (text)
  - business_type ('coffee' | 'ice_cream' | 'bagel' | 'other')
  - reward_text (text, e.g., "Free Coffee")
  - stamps_needed (int, default 10)
  - plan_tier ('free' | 'paid')
  - subscription_status (text)
  - stripe_customer_id (text, nullable)
  - stripe_subscription_id (text, nullable)

customers
  - id (uuid, primary key)
  - merchant_id (uuid, foreign key)
  - phone_hash (text, SHA-256 hashed)
  - phone_last_4 (text)
  - stamps_current (int, default 0)
  - visits_total (int, default 0)

check_ins
  - id (uuid, primary key)
  - customer_id (uuid, foreign key)
  - merchant_id (uuid, foreign key)
  - created_at (timestamp)

rewards
  - id (uuid, primary key)
  - customer_id (uuid, foreign key)
  - merchant_id (uuid, foreign key)
  - redeemed_at (timestamp)
```

## Key Features

### ✅ Implemented
- QR code generation and download
- Customer check-in flow with phone number
- Stamp tracking (progress bars, visual stamps)
- Reward redemption
- Basic dashboard with stats (customers, check-ins, rewards)
- Free tier (25 customers max)
- Pro tier ($9/month, unlimited customers)
- Stripe integration (checkout, billing portal, webhooks)
- Phone number hashing (SHA-256) for privacy
- Business customization (name, type, reward text, stamps needed)

### Fixes needed
- Delete account not actually deleting (still able to sign in - needs to delete from database)
- icons on /dashboard/settings need to better reflect the customer type (could be better icons or emojis)
- http://localhost:3000/dashboard/upgrade should show free tier vs paid (FAQ should be in a different page - i.e. a header)
- Privacy link works and is filled out correctly
- Terms link works and is filled out correctly


### ❌ Not Yet Implemented
- making sure future implementation of digital wallet is seamless (Phone is just one authentication method) - that way adding digital wallets later doesn't break things
- Tiered rewards (i.e. cash out for coffee at 5 stamps, or latte at 10)
- Advanced analytics (trends, graphs, insights)
- Multiple locations per merchant
- discount for annual billing ($99 annually)
- custom email domain

## Privacy & Security

- Phone numbers are hashed with SHA-256 + merchant ID as salt
- Only last 4 digits stored in plain text (for merchant identification)
- Full number never stored in database
- Supabase Row Level Security (RLS) enabled on all tables
- Stripe handles all payment data (PCI compliant)

## Pricing Model

**Free Tier**
- Up to 25 active customers
- All core features
- No credit card required

**Pro Tier** - $9/month
- Unlimited customers
- Priority support
- Advanced analytics (planned)
- Customer export (planned)

## Common Issues & Solutions

### 1. Delete Account Not Working
**Problem**: Account deletion doesn't fully remove user
**Solution**: Must delete both merchant record AND auth user
```typescript
await supabase.from('merchants').delete().eq('id', merchantId);
await supabase.auth.admin.deleteUser(userId);
```

### 2. Stripe Price ID Mismatch
**Problem**: Using live mode price with test mode keys
**Solution**: Create test mode price in Stripe, update env variable
```
NEXT_PUBLIC_STRIPE_PRICE_ID=price_test_xxxxx
```

### 3. Check-in Not Creating Stamp
**Problem**: Phone hash mismatch or daily limit hit
**Solution**: Check hash function, verify one check-in per day logic

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_ID=

# URLs
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_CUSTOMER_URL=
```

## Design System

**Colors**
- Primary: `slate-900`
- Backgrounds: `white`, `slate-50`, gradient `from-slate-50 via-blue-50 to-slate-50`
- Borders: `slate-200`, `slate-300`
- Text: `slate-900`, `slate-600`, `slate-500`

**Typography**
- Headings: `font-bold` or `font-semibold`
- Body: `text-sm` (14px default)
- Large text: `text-xl` or `text-2xl`

**Components**
- Buttons: `bg-slate-900 text-white rounded-lg`
- Inputs: `border-slate-300 rounded-md focus:ring-slate-900`
- Cards: `bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl`

## What to Tell Copilot

When asking Copilot for help, provide:
1. **This document** (project-overview.md)
2. **The specific file** you're working on
3. **The issue** you're facing

Example prompt:
```
[Paste this entire document]

I'm working on app/(dashboard)/dashboard/page.tsx and need to add a 
feature that shows top 5 customers by visit count. The data should 
come from the database and display with their last 4 digits and 
total visits.
```

## Quick Reference: Common Tasks

### Add New Feature to Dashboard
1. Update `app/(dashboard)/dashboard/page.tsx`
2. Fetch data from API route or Supabase
3. Render with Tailwind classes matching design system

### Add New API Endpoint
1. Create `app/api/your-endpoint/route.ts`
2. Export async functions: `GET`, `POST`, `PUT`, `DELETE`
3. Use Supabase server client from `@/lib/supabase/server`

### Add New Database Table
1. Write SQL migration
2. Add Row Level Security policies
3. Update TypeScript types (if using)

### Debug Stripe Issues
1. Check test vs live mode (all keys must match)
2. Verify webhook events in Stripe dashboard
3. Check webhook secret in env variables
4. Test with Stripe test cards (4242 4242 4242 4242)

## Current Status

**Live**: Not yet deployed to production
**Development**: Active
**Main Branch**: Production-ready code
**Known Issues**: None blocking

## Contact

For questions about this project, refer to:
- This overview document
- Specific file comments
- Supabase/Stripe documentation

---

**Last Updated**: 2026-02-15
**Version**: 1.0.0