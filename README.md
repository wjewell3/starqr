# StarQR Loyalty - QR-Based Loyalty System

A modern, QR-based loyalty card system for small businesses like coffee shops, ice cream parlors, and bagel shops. Customers scan a QR code, enter their phone number, and earn stamps toward free rewards.

## Features

- **No App Required**: Customers use their phone's camera to scan QR codes
- **Privacy-First**: Phone numbers are hashed; only last 4 digits stored for display
- **Free Tier**: Up to 25 customers free forever
- **Paid Tier**: $9/month for unlimited customers
- **Dashboard**: Real-time analytics and customer insights
- **Stripe Integration**: Seamless subscription management
- **Apple/Google Wallet Ready**: Architecture prepared for Phase 2 wallet integration

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Hosting**: Vercel
- **QR Generation**: `qrcode` npm package

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account
- Vercel account (for deployment)

### 2. Clone and Install

```bash
git clone <your-repo>
cd starqr
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration from `SETUP.md`
3. Copy your project URL and keys

### 4. Set Up Stripe

1. Create a product at [stripe.com](https://stripe.com/dashboard)
2. Set price to $9/month recurring
3. Copy your API keys and price ID
4. Set up webhook endpoint (see below)

### 5. Environment Variables

Create `.env.local`:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Fill in your actual values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
starqr/
├── app/
│   ├── api/                    # API routes
│   │   ├── checkin/           # Customer check-in logic
│   │   ├── merchant/stats/    # Dashboard analytics
│   │   └── stripe/            # Stripe webhooks & checkout
│   ├── c/[merchantId]/        # Customer check-in page
│   ├── dashboard/             # Merchant dashboard (TODO)
│   ├── login/                 # Auth pages (TODO)
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── CheckInForm.tsx        # Customer phone entry
│   └── StampProgress.tsx      # Visual stamp card
├── lib/
│   ├── supabase/              # Database clients
│   ├── stripe.ts              # Stripe helpers
│   ├── qr-generator.ts        # QR code generation
│   └── phone-hash.ts          # Privacy utilities
└── types/
    └── database.ts            # TypeScript types
```

## Database Schema

See `SETUP.md` for complete SQL migration.

Key tables:
- `merchants` - Business accounts
- `customers` - Customer records (phone hashed)
- `check_ins` - Stamp history
- `rewards_redeemed` - Redemption tracking

## API Routes

### POST /api/checkin
Customer check-in endpoint.

**Request:**
```json
{
  "merchantId": "uuid",
  "phone": "5551234567"
}
```

**Response:**
```json
{
  "success": true,
  "stamps_current": 3,
  "stamps_needed": 10,
  "redeemed": false,
  "reward_text": "Free Coffee",
  "token": "..."
}
```

### GET /api/merchant/stats
Dashboard statistics (requires auth).

**Response:**
```json
{
  "stats": {
    "totalCustomers": 15,
    "checkInsThisMonth": 45,
    "rewardsThisMonth": 3,
    "freeTierLimit": 25,
    "approachingLimit": false
  },
  "topCustomers": [...],
  "recentCheckIns": [...]
}
```

## Stripe Webhooks

Set up webhook endpoint in Stripe Dashboard:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

For local testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel
```

Add environment variables in Vercel dashboard.

### Set Up Production Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Copy webhook secret to Vercel env vars

## TODO - Dashboard & Auth Pages

The following pages still need to be implemented:

- `/login` - Login page
- `/signup` - Signup with onboarding
- `/dashboard` - Main merchant dashboard
- `/dashboard/settings` - Edit rewards, download QR
- `/dashboard/billing` - Subscription management
- `/dashboard/upgrade` - Free → Paid upgrade flow

See the original spec document for detailed requirements.

## Security

- Row Level Security (RLS) enabled on all tables
- Phone numbers hashed with SHA-256
- Service role key only used server-side
- Stripe webhooks signature verified
- 24-hour check-in rate limiting

## Support

For issues or questions:
1. Check the spec document
2. Review Supabase logs
3. Check Stripe webhook logs

## License

Proprietary - All rights reserved

---

**Built with ❤️ for small businesses**
