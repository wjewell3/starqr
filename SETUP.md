# TapQR Loyalty - Complete Setup Guide

This guide will walk you through setting up TapQR Loyalty from scratch.

## Part 1: Supabase Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose organization and enter:
   - **Name**: tapqr-loyalty
   - **Database Password**: (generate strong password and save it)
   - **Region**: Choose closest to your target audience
4. Wait for project to finish setting up (~2 minutes)

### Step 2: Run Database Migration

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Merchants table
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT CHECK (business_type IN ('coffee', 'ice_cream', 'bagel', 'other')),
  reward_text TEXT DEFAULT 'Free Coffee' NOT NULL,
  stamps_needed INTEGER DEFAULT 10 CHECK (stamps_needed > 0),
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'paid')),
  
  -- Stripe fields
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'paused', 'canceled', 'free')),
  
  -- Trial/billing dates
  trial_ends_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  subscription_current_period_end TIMESTAMPTZ,
  
  -- Wallet integration prep (for Phase 2)
  apple_pass_type_id TEXT,
  google_issuer_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  
  -- Privacy-first phone storage
  phone_hash TEXT NOT NULL,
  phone_last_4 TEXT NOT NULL,
  
  -- Stamp tracking
  stamps_current INTEGER DEFAULT 0 CHECK (stamps_current >= 0),
  stamps_lifetime INTEGER DEFAULT 0 CHECK (stamps_lifetime >= 0),
  
  -- Visit tracking
  visits_total INTEGER DEFAULT 0,
  first_visit_at TIMESTAMPTZ DEFAULT NOW(),
  last_visit_at TIMESTAMPTZ,
  
  -- Wallet integration prep
  apple_pass_serial TEXT UNIQUE,
  google_pass_id TEXT UNIQUE,
  wallet_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(merchant_id, phone_hash)
);

-- Check-ins table
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  stamps_added INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards redeemed
CREATE TABLE rewards_redeemed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  stamps_used INTEGER DEFAULT 10,
  redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_customers_merchant ON customers(merchant_id);
CREATE INDEX idx_customers_phone_hash ON customers(merchant_id, phone_hash);
CREATE INDEX idx_checkins_merchant_customer ON check_ins(merchant_id, customer_id);
CREATE INDEX idx_checkins_created ON check_ins(merchant_id, created_at DESC);
CREATE INDEX idx_merchants_user ON merchants(user_id);
CREATE INDEX idx_merchants_stripe_customer ON merchants(stripe_customer_id);

-- Updated_at trigger for merchants
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click "Run" to execute the migration
5. Verify all tables were created in the **Table Editor**

### Step 3: Set Up Row Level Security (RLS)

In a new SQL query, run:

```sql
-- Enable RLS on all tables
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_redeemed ENABLE ROW LEVEL SECURITY;

-- Merchants: Users can only see/edit their own merchant record
CREATE POLICY "Users can view own merchant" ON merchants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own merchant" ON merchants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own merchant" ON merchants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Customers: Merchants can view their own customers
CREATE POLICY "Merchants can view own customers" ON customers
  FOR SELECT USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can manage customers" ON customers
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Check-ins: Merchants can view their own check-ins
CREATE POLICY "Merchants can view own check-ins" ON check_ins
  FOR SELECT USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can manage check-ins" ON check_ins
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Rewards: Merchants can view their own redemptions
CREATE POLICY "Merchants can view own rewards" ON rewards_redeemed
  FOR SELECT USING (
    merchant_id IN (SELECT id FROM merchants WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can manage rewards" ON rewards_redeemed
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

### Step 4: Copy Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for .env.local):
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGc...`)
   - **service_role key** (starts with `eyJhbGc...`) - **Keep this secret!**

## Part 2: Stripe Setup

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Enable "Test mode" toggle in top-right

### Step 2: Create Product & Price

1. Go to **Products** → **Add Product**
2. Enter:
   - **Name**: TapQR Loyalty - Monthly
   - **Description**: Unlimited customers and premium features
   - **Pricing**: Recurring
   - **Price**: $9.00 USD
   - **Billing Period**: Monthly
3. Click "Save product"
4. Copy the **Price ID** (starts with `price_...`)

### Step 3: Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - **Keep this secret!**

### Step 4: Set Up Webhook (Do this AFTER deploying to production)

For now, use Stripe CLI for local testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook signing secret (starts with whsec_...)
```

## Part 3: Environment Setup

### Step 1: Create .env.local File

In your project root, create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3000
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Part 4: Testing the Check-in Flow

### Test Customer Check-in

1. Create a test merchant record in Supabase:
   - Go to **Table Editor** → **merchants**
   - Click "Insert row"
   - Fill in:
     - `user_id`: (you'll need to create a test user first)
     - `business_name`: Test Coffee Shop
     - `business_type`: coffee
     - `reward_text`: Free Coffee
     - `stamps_needed`: 10
   - Copy the generated `id`

2. Visit check-in page:
   ```
   http://localhost:3000/c/[merchant-id-here]
   ```

3. Enter a test phone number (e.g., 5551234567)

4. Verify in Supabase:
   - Check `customers` table for new record
   - Check `check_ins` table for new check-in
   - Customer should have `stamps_current: 1`

### Test Multiple Check-ins

1. Try checking in again immediately
   - Should show error: "Already checked in today"

2. Test 24-hour limit by temporarily modifying the database:
   ```sql
   UPDATE check_ins
   SET created_at = created_at - INTERVAL '25 hours'
   WHERE customer_id = 'your-customer-id';
   ```

3. Check in again - should work

### Test Reward Redemption

1. Manually add stamps to test customer:
   ```sql
   UPDATE customers
   SET stamps_current = 9
   WHERE id = 'your-customer-id';
   ```

2. Check in one more time

3. Should see:
   - "Reward Unlocked!" message
   - `stamps_current` reset to 0
   - New record in `rewards_redeemed` table

## Part 5: Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/tapqr-loyalty.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add all variables from `.env.local`

**Important**: Change these to production values:
- Use Supabase production keys (not the same project)
- Use Stripe live keys (remove `_test_`)
- Update URLs:
  ```
  NEXT_PUBLIC_APP_URL=https://yourdomain.com
  NEXT_PUBLIC_CUSTOMER_URL=https://yourdomain.com
  ```

### Step 4: Set Up Production Stripe Webhook

1. Go to Stripe Dashboard → **Webhooks**
2. Click "Add endpoint"
3. Enter:
   - **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
   - **Events to send**:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
4. Copy the **Signing secret** (starts with `whsec_...`)
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

### Check-in Not Working

1. Check browser console for errors
2. Check Supabase logs: **Logs** → **API Logs**
3. Verify merchant exists in database
4. Check RLS policies are set up correctly

### Stripe Webhook Not Triggering

1. Check Stripe Dashboard → **Webhooks** for delivery attempts
2. Verify `STRIPE_WEBHOOK_SECRET` matches
3. Check Vercel function logs

### Database Errors

1. Verify all tables exist in Supabase
2. Check RLS policies with:
   ```sql
   SELECT * FROM pg_policies;
   ```
3. Test with service role key in API routes

## Next Steps

Now that the core check-in flow works, implement:

1. Authentication pages (`/login`, `/signup`)
2. Merchant dashboard (`/dashboard`)
3. Settings page (edit rewards, download QR)
4. Billing page (Stripe customer portal)

See the main spec document for detailed requirements.

## Support

For issues:
1. Check Supabase logs
2. Check Vercel function logs
3. Review this setup guide
4. Check the main README.md
