# TapQR Loyalty - Quick Reference

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Stripe CLI (for local testing)
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Supabase CLI (optional)
```bash
# Install
npm install -g supabase

# Link project
supabase link --project-ref your-project-ref

# Generate TypeScript types
supabase gen types typescript --local > types/database.ts
```

## Important URLs

### Development
- Landing page: http://localhost:3000
- Customer check-in: http://localhost:3000/c/[merchantId]
- Dashboard: http://localhost:3000/dashboard (TODO)
- API docs: See README.md

### Production
- Main app: https://yourdomain.com
- Supabase Dashboard: https://app.supabase.com
- Stripe Dashboard: https://dashboard.stripe.com
- Vercel Dashboard: https://vercel.com/dashboard

## Database Quick Queries

### View all merchants
```sql
SELECT id, business_name, plan_tier, subscription_status
FROM merchants
ORDER BY created_at DESC;
```

### View customer count per merchant
```sql
SELECT m.business_name, COUNT(c.id) as customer_count
FROM merchants m
LEFT JOIN customers c ON c.merchant_id = m.id
GROUP BY m.id, m.business_name
ORDER BY customer_count DESC;
```

### View recent check-ins
```sql
SELECT 
  m.business_name,
  c.phone_last_4,
  ci.created_at
FROM check_ins ci
JOIN merchants m ON m.id = ci.merchant_id
JOIN customers c ON c.id = ci.customer_id
ORDER BY ci.created_at DESC
LIMIT 20;
```

### Find customers near reward
```sql
SELECT 
  m.business_name,
  c.phone_last_4,
  c.stamps_current,
  m.stamps_needed,
  (m.stamps_needed - c.stamps_current) as stamps_remaining
FROM customers c
JOIN merchants m ON m.id = c.merchant_id
WHERE c.stamps_current > 0
ORDER BY stamps_remaining ASC
LIMIT 10;
```

### Manually add stamps to customer (for testing)
```sql
UPDATE customers
SET stamps_current = stamps_current + 1,
    stamps_lifetime = stamps_lifetime + 1,
    visits_total = visits_total + 1
WHERE phone_hash = 'your-phone-hash'
AND merchant_id = 'your-merchant-id';
```

### Reset check-in cooldown (for testing)
```sql
UPDATE check_ins
SET created_at = created_at - INTERVAL '25 hours'
WHERE customer_id = 'your-customer-id';
```

### View subscription status
```sql
SELECT 
  business_name,
  plan_tier,
  subscription_status,
  trial_ends_at,
  subscription_current_period_end
FROM merchants
WHERE plan_tier = 'paid'
ORDER BY created_at DESC;
```

## Environment Variables Reference

### Required for All Environments
```bash
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY         # Supabase service role (server-side only)

STRIPE_SECRET_KEY                  # Stripe secret key
STRIPE_PUBLISHABLE_KEY             # Stripe publishable key
STRIPE_WEBHOOK_SECRET              # Stripe webhook signing secret
NEXT_PUBLIC_STRIPE_PRICE_ID        # Stripe price ID for $9/mo subscription

NEXT_PUBLIC_APP_URL                # Main app URL (e.g., https://yourdomain.com)
NEXT_PUBLIC_CUSTOMER_URL           # Customer-facing URL (usually same as APP_URL)
```

### Optional (for Phase 2)
```bash
RESEND_API_KEY                     # Resend.com API key for transactional emails
APPLE_PASS_TYPE_ID                 # Apple Wallet pass type ID
APPLE_TEAM_ID                      # Apple Developer team ID
GOOGLE_WALLET_ISSUER_ID            # Google Wallet issuer ID
```

## API Endpoints

### Public Endpoints (No Auth)

#### POST /api/checkin
Customer check-in. Creates customer if new, adds stamp, handles redemptions.

**Body:**
```json
{
  "merchantId": "uuid",
  "phone": "5551234567"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "stamps_current": 3,
  "stamps_needed": 10,
  "redeemed": false,
  "reward_text": "Free Coffee",
  "token": "base64-token",
  "customer_id": "uuid"
}
```

**Error Responses:**
- 400: Missing fields
- 403: Customer limit reached (free tier) OR account paused
- 404: Merchant not found
- 429: Already checked in today
- 500: Internal error

### Protected Endpoints (Requires Auth)

#### GET /api/merchant/stats
Dashboard statistics for authenticated merchant.

**Response:**
```json
{
  "stats": {
    "totalCustomers": 15,
    "checkInsThisMonth": 45,
    "rewardsThisMonth": 3,
    "freeTierLimit": 25,
    "approachingLimit": false,
    "planTier": "free"
  },
  "topCustomers": [
    { "phone_last_4": "4567", "visits_total": 12, "stamps_current": 3 }
  ],
  "recentCheckIns": [
    { "timestamp": "2024-01-15T10:30:00Z", "phoneLast4": "4567" }
  ]
}
```

#### POST /api/stripe/create-checkout
Create Stripe checkout session for upgrading to paid plan.

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### POST /api/stripe/create-portal
Create Stripe billing portal session for subscription management.

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

#### POST /api/stripe/webhook
Stripe webhook endpoint (called by Stripe, not by your app).

Events handled:
- `checkout.session.completed` - Subscription created
- `customer.subscription.updated` - Subscription status changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_failed` - Payment failed

## Testing Checklist

### Basic Check-in Flow
- [ ] Customer can access /c/[merchantId] page
- [ ] Phone number formats correctly as typed
- [ ] Check-in succeeds and shows stamp progress
- [ ] Duplicate check-in within 24 hours is blocked
- [ ] Stamps increment correctly
- [ ] Reward unlocks at 10 stamps (or configured amount)
- [ ] Stamps reset to 0 after redemption
- [ ] Phone hash is stored correctly in database

### Free Tier Limits
- [ ] 25th customer can check in successfully
- [ ] 26th customer sees "Customer limit reached" message
- [ ] Merchant sees "approaching limit" warning at 20 customers
- [ ] After upgrading to paid, can add unlimited customers

### Stripe Integration
- [ ] Checkout session creates successfully
- [ ] After payment, subscription status updates to "active"
- [ ] Billing portal opens correctly
- [ ] Webhook updates subscription status on changes
- [ ] Failed payment sets status to "paused"
- [ ] Canceled subscription downgrades to free tier

### Security
- [ ] RLS policies prevent cross-merchant data access
- [ ] Service role key not exposed to client
- [ ] Phone numbers are hashed in database
- [ ] Only last 4 digits visible in UI
- [ ] Stripe webhook signature is verified

### Performance
- [ ] Customer check-in completes in < 1 second
- [ ] Dashboard loads stats quickly
- [ ] QR code generates instantly
- [ ] No N+1 queries in database

## Common Issues & Solutions

### Issue: "Merchant not found" error
**Solution:** Check that merchant record exists in database with correct ID

### Issue: Check-in says "Already checked in" immediately
**Solution:** Check timezone settings. created_at should be UTC. Reset check-in:
```sql
DELETE FROM check_ins WHERE customer_id = 'your-id';
```

### Issue: Free tier limit not enforcing
**Solution:** Verify plan_tier is set to 'free' in merchants table

### Issue: Stripe webhook not triggering
**Solution:**
1. Check webhook URL in Stripe dashboard matches deployment URL
2. Verify STRIPE_WEBHOOK_SECRET matches
3. Check Vercel function logs for errors
4. Test with Stripe CLI: `stripe trigger checkout.session.completed`

### Issue: Customer phone hash collision
**Solution:** Unlikely but possible. Each hash includes merchantId, so collisions only affect single merchant. Use longer hash or add salt.

### Issue: Database connection errors
**Solution:**
1. Verify SUPABASE_URL and keys are correct
2. Check Supabase project status
3. Review RLS policies
4. Test with service role key

## Feature Roadmap

### ✅ Phase 1 - MVP (Current)
- Customer check-in via QR
- Stamp tracking and redemption
- Free tier (25 customers)
- Paid tier ($9/mo unlimited)
- Basic dashboard stats

### 🚧 Phase 2 - Dashboard & Auth (Next)
- Login/signup pages
- Merchant onboarding flow
- Full dashboard with charts
- Settings page (edit rewards, QR download)
- Billing page (Stripe portal integration)

### 📋 Phase 3 - Enhanced Features
- Email notifications (welcome, trial ending, etc.)
- Customer export (CSV)
- Manual stamp adjustment
- Customer notes
- Analytics charts (30-day trends)

### 🎯 Phase 4 - Apple/Google Wallet
- Apple Wallet pass generation
- Google Wallet pass generation
- Push notifications for stamp updates
- Automatic pass updates

## Performance Optimization Tips

### Database Indexes
All critical indexes are already created. Monitor slow queries:
```sql
-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Caching Strategy
- Customer tokens cached in localStorage
- QR codes can be cached (don't change)
- Dashboard stats can be cached for 1 minute

### Edge Functions (Future)
Consider moving check-in logic to Supabase Edge Functions for lower latency.

## License

Proprietary - All rights reserved
