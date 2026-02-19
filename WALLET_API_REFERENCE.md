# Wallet-Ready API Reference

## Check-In Endpoints

### POST /api/checkin
Main customer check-in endpoint. Now supports optional user authentication.

**Request Body:**
```json
{
  "merchantId": "uuid",
  "phone": "1234567890",           // Required for phone-based lookup
  "token": "supabase-access-token"  // Optional: Supabase auth token
}
```

**Response (Success):**
```json
{
  "success": true,
  "stamps_current": 3,
  "stamps_needed": 5,
  "redeemed": false,
  "reward_text": "Free Coffee",
  "business_name": "Coffee Shop",
  "isFirstSignup": true,          // New: first check-in with bonus
  "token": "cache-token",
  "customer_id": "uuid",
  "user_id": "uuid-if-auth"       // New: set when token provided
}
```

**Response (Error - Already Checked In):**
```json
{
  "error": "Already checked in today",
  "stamps_current": 3,
  "stamps_needed": 5,
  "nextCheckInAt": "2026-02-20T14:30:00Z",
  "status": 429
}
```

**Response (Error - Customer Limit):**
```json
{
  "error": "Customer limit reached",
  "upgradeRequired": true,
  "message": "This business has reached the free tier limit. Ask them to upgrade!",
  "status": 403
}
```

**Behavior:**
1. If `token` provided:
   - Validates token and extracts `user_id`
   - Looks up customer by `(merchant_id, user_id)`
   - Falls back to phone-hash if no user_id match
   - Sets `user_id` on new customer creation
2. If only `phone` provided:
   - Classic phone-hash lookup
   - Creates customer if not found (free tier limit check applies)
3. If both provided:
   - Prefers user_id, falls back to phone
4. If neither:
   - Returns 400 error

---

## Customer Linking Endpoints

### POST /api/customer/link
Link an authenticated user to their phone-based customer record.

**Request:**
```json
{
  "customer_id": "uuid",
  "merchant_id": "uuid",
  "token": "supabase-access-token"
}
```

**OR (Bearer token in header):**
```
POST /api/customer/link
Authorization: Bearer supabase-access-token
Content-Type: application/json

{
  "customer_id": "uuid",
  "merchant_id": "uuid"
}
```

**Response (Success):**
```json
{
  "success": true,
  "customer": {
    "id": "uuid",
    "merchant_id": "uuid",
    "user_id": "uuid",
    "phone_hash": "...",
    "phone_last_4": "1234",
    "stamps_current": 5,
    "stamps_lifetime": 7,
    "visits_total": 7,
    "apple_pass_provisioned_at": null,
    "google_pass_provisioned_at": null,
    "pass_revoked_at": null,
    "metadata": {},
    "created_at": "2026-02-10T...",
    "updated_at": "2026-02-19T..."
  }
}
```

**Response (Conflict - Already Claimed):**
```json
{
  "error": "Customer already claimed by another user",
  "status": 409
}
```

**Response (Unauthorized):**
```json
{
  "error": "Invalid auth token",
  "status": 401
}
```

**Response (Not Found):**
```json
{
  "error": "Customer not found",
  "status": 404
}
```

**Idempotence:**
- Safe to call multiple times with the same user and customer
- If already linked to that user, succeeds silently
- If linked to another user, returns 409 conflict

---

## Stats & Dashboard Endpoints

### GET /api/merchant/stats
Get merchant statistics including wallet adoption.

**Response (Enhanced):**
```json
{
  "stats": {
    "totalCustomers": 42,
    "checkInsThisMonth": 128,
    "rewardsThisMonth": 5,
    "freeTierLimit": 25,
    "approachingLimit": false,
    "planTier": "paid"
  },
  "topCustomers": [
    {
      "phone_last_4": "1234",
      "visits_total": 12,
      "stamps_current": 3,
      "user_id": "uuid-or-null",                      // New
      "apple_pass_provisioned_at": null,              // New
      "google_pass_provisioned_at": "2026-02-19T...", // New
      "pass_revoked_at": null                         // New
    }
  ],
  "recentCheckIns": [
    {
      "timestamp": "2026-02-19T14:30:00Z",
      "phoneLast4": "1234"
    }
  ]
}
```

**Includes wallet adoption metrics** for tracking transition to digital wallet.

---

## Auth & Lookup Endpoints

### GET /api/merchant/lookup
Look up merchant by slug.

**Query:**
```
GET /api/merchant/lookup?slug=coffee-shop
```

**Response:**
```json
{
  "id": "uuid",
  "business_name": "Coffee Shop",
  "slug": "coffee-shop"
}
```

---

## Migration & Setup

### Run Wallet Migration
```bash
psql -h db.supabase.co -U postgres -d postgres -f migrations/20260219_add_wallet_fields.sql
```

**What it does:**
- Adds `user_id`, phone lifecycle fields, pass provisioning timestamps
- Adds `metadata` and `wallet_config` JSONB columns
- Creates indexes for user_id lookups and wallet queries
- Adds foreign key constraint to auth.users (safe delete)

**Idempotence:**
- Uses `IF NOT EXISTS` - safe to run multiple times
- Uses `DO` blocks for conditional FK creation

---

## Client-Side Integration

### Send Token with Check-In Request

**React Example:**
```tsx
const supabase = createClient();

// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Include token if user is logged in
const token = session?.access_token;

const res = await fetch('/api/checkin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    merchantId,
    phone: '1234567890',
    token: token,  // Optional, will use phone lookup if missing
  }),
});
```

### Link Customer to Auth User

**React Example:**
```tsx
const res = await fetch('/api/customer/link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`,
  },
  body: JSON.stringify({
    customer_id: 'uuid',
    merchant_id: 'uuid',
  }),
});

const data = await res.json();
console.log('Customer linked:', data.customer);
```

---

## Database Queries

### Find Customers by User ID
```sql
SELECT * FROM customers 
WHERE merchant_id = 'uuid' 
  AND user_id = 'auth-user-id';
```

### Find Wallet-Enabled Merchants
```sql
SELECT * FROM merchants 
WHERE wallet_enabled = true 
  AND plan_tier = 'paid';
```

### Count Customers with Wallet Pass
```sql
SELECT COUNT(*) FROM customers 
WHERE merchant_id = 'uuid' 
  AND (apple_pass_provisioned_at IS NOT NULL 
       OR google_pass_provisioned_at IS NOT NULL)
  AND pass_revoked_at IS NULL;
```

### Find All Unlinked Customers (for backfill)
```sql
SELECT * FROM customers 
WHERE merchant_id = 'uuid' 
  AND user_id IS NULL
LIMIT 100;
```

---

## Error Codes & Handling

| Code | Endpoint | Meaning | Action |
|------|----------|---------|--------|
| 400 | /api/checkin | Missing required fields | Ensure phone OR token provided |
| 401 | /api/customer/link | Invalid auth token | Refresh session and retry |
| 403 | /api/checkin | Free tier limit reached | Prompt merchant to upgrade |
| 404 | /api/merchant/lookup | Slug not found | Verify merchant slug |
| 404 | /api/customer/link | Customer not found | Verify customer_id and merchant_id |
| 409 | /api/customer/link | Already claimed by another user | Cannot reassign customer |
| 429 | /api/checkin | Already checked in today | Show next check-in time |
| 500 | any | Internal error | Check server logs |

---

## Best Practices

### For Phone-Based Flows (Current)
- ✅ Always validate phone format (10 digits)
- ✅ Cache token in localStorage for repeat visits
- ✅ Show user-friendly error messages
- ✅ Handle 429 (duplicate check-in) gracefully

### For Auth Integration (Future)
- ✅ Fetch session on page load
- ✅ Include token only if session exists
- ✅ Gracefully degrade if session is missing
- ✅ Call `/api/customer/link` after first auth signup
- ✅ Monitor user_id adoption via stats endpoint

### For Wallet Passes (Future)
- ✅ Track `apple_pass_provisioned_at` / `google_pass_provisioned_at`
- ✅ Store pass serial/device info in `metadata`
- ✅ Implement pass refresh on check-in
- ✅ Implement pass revocation via `pass_revoked_at`

---

## Performance Considerations

### Indexes Created
- `idx_customers_user_id` - Fast user_id lookups (O(log n))
- `idx_merchants_wallet_enabled` - Fast wallet merchant queries
- `idx_customers_merchant_user` (unique, partial) - Prevents duplicates

### Query Optimization
- Use indexed lookups: `WHERE merchant_id = ? AND user_id = ?`
- Avoid full table scans: always include `merchant_id` in WHERE clause
- Use partial index for wallet queries: `WHERE user_id IS NOT NULL`

### Recommended Database Connection Pool Size
- Development: 5-10
- Production: 20-50 (adjust based on concurrent users)

---

## Migration Timeline

**Phase A (Current ✅)**
- Phone-based check-ins work
- Auth endpoints ready
- Backward compatible

**Phase B (3-6 months, optional)**
- Add customer auth signup
- Run backfill script
- Monitor user_id adoption

**Phase C (6-12 months, optional)**
- Implement Apple Wallet passes
- Implement Google Wallet passes
- Show wallet UI

**Phase D (12+ months, optional)**
- Require phone verification
- Deprecate phone-only check-in for new merchants
- Archive phone data

---

## Example Workflows

### Workflow 1: Phone-Only Check-In (Current)
```
1. Customer visits starqr.app/c/coffee-shop
2. Enters phone number
3. POST /api/checkin { merchantId, phone }
4. Server returns stamps and punchcard
```

### Workflow 2: Link Auth to Phone Customer
```
1. User creates account at starqr.app/signup
2. User visits merchant check-in page: starqr.app/c/coffee-shop
3. System detects auth session, sends token with check-in
4. Server finds/creates customer with user_id
5. User can now check in with auth instead of phone
```

### Workflow 3: Explicit Customer Linking
```
1. User logs in to merchant dashboard
2. Clicks "Link My Loyalty Account"
3. User provides phone number (or selects from history)
4. POST /api/customer/link { customer_id, merchant_id, token }
5. Customer row updated with user_id
```

### Workflow 4: Wallet Pass Issuance (Future)
```
1. User checks in (auth or phone)
2. System detects wallet_enabled=true
3. Generate Apple/Google pass
4. Update customer.apple_pass_provisioned_at / google_pass_provisioned_at
5. Return pass URL in check-in response
6. User installs pass to wallet
```

---

## Troubleshooting

**Q: Check-in fails with "Invalid auth token"**
A: Token may be expired. Refresh session with `supabase.auth.refreshSession()` and retry.

**Q: Customer appears twice (phone and auth)**
A: Old customer record hasn't been linked yet. Call `/api/customer/link` to merge.

**Q: Partial index query is slow**
A: Ensure `WHERE user_id IS NOT NULL` included in query for index to be used.

**Q: Migration won't apply**
A: Check migration file permissions and database user role. Ensure `postgres` role has schema modification rights.

---

See `WALLET_MIGRATION_GUIDE.md` for full architecture overview.
