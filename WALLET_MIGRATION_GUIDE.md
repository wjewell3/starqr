# Digital Wallet Migration Guide

## Overview

This document describes the wallet-ready architecture that has been implemented to support future migration from phone-based customer identification to digital wallets (Apple Wallet, Google Wallet) while maintaining backward compatibility with the current phone-based system.

**Key principle:** The system remains fully functional with phone-based check-ins while infrastructure is in place for authenticated wallet-based flows.

---

## Current Architecture (Phone-Based)

### Flow
1. Customer visits `starqr.app/c/{merchant-slug}` (public check-in page)
2. Enters 10-digit phone number
3. Server hashes the phone number and looks up customer by `(merchant_id, phone_hash)`
4. If not found, creates a new customer row with phone hash
5. Records a check-in, updates stamps, awards bonus on first signup
6. Caches a simple token in localStorage for future auto-detection

### Database Schema (Customers Table)
- `id` (uuid, primary key)
- `merchant_id` (uuid, FK)
- `phone_hash` (text, NOT NULL) - hashed phone number
- `phone_last_4` (text) - last 4 digits for display
- `stamps_current` (integer)
- `stamps_lifetime` (integer)
- `visits_total` (integer)
- `last_visit_at` (timestamptz)
- `created_at`, `updated_at` (timestamps)

---

## New Wallet-Ready Architecture

### Phase 1: Prepare Database (Migration 20260219_add_wallet_fields.sql)

The following columns have been added to support wallet features, **all nullable** to avoid breaking existing code:

#### Customers Table Additions
- `user_id` (uuid NULL) - Maps customer to Supabase `auth.users.id`
- `phone_verified_at` (timestamptz NULL) - When phone was verified
- `phone_deleted_at` (timestamptz NULL) - When phone was unlinked/deleted
- `apple_pass_provisioned_at` (timestamptz NULL) - When Apple Wallet pass was created
- `google_pass_provisioned_at` (timestamptz NULL) - When Google Wallet pass was created
- `pass_revoked_at` (timestamptz NULL) - When wallet pass was revoked
- `metadata` (jsonb DEFAULT '{}') - Flexible store for pass payloads, device IDs, etc.

#### Merchants Table Additions
- `wallet_config` (jsonb DEFAULT '{}') - Per-merchant wallet settings (pass design, colors, etc.)
- `wallet_enabled` (boolean DEFAULT false) - Feature flag to enable wallet flows per merchant

#### Indexes Created
- `idx_customers_user_id` - Fast lookups by user_id
- `idx_merchants_wallet_enabled` - Query enabled merchants
- `idx_customers_merchant_user` (unique, partial) - Prevent duplicate (merchant_id, user_id) pairs when user_id is present

#### Foreign Key
- `customers.user_id` → `auth.users.id` (ON DELETE SET NULL)

### Phase 2: Add User-Linking Endpoints

#### Endpoint: POST /api/customer/link
Allows an authenticated user to claim/link a phone-based customer record to their `user_id`.

**Request:**
```json
{
  "customer_id": "uuid",
  "merchant_id": "uuid",
  "token": "supabase-access-token"
}
```

**Response (success):**
```json
{
  "success": true,
  "customer": { /* updated customer row */ }
}
```

**Response (conflict):**
```json
{
  "error": "Customer already claimed by another user",
  "status": 409
}
```

**Use case:** When a user creates an account and wants to link their existing phone-based loyalty history.

### Phase 3: Enhanced Check-In Flow

#### Updated: POST /api/checkin
The check-in endpoint now accepts an optional `token` (Supabase auth token) and:

1. **Prefers `user_id` lookup** if token is provided and valid
2. **Falls back to phone hash lookup** if user_id match not found
3. **Sets `user_id` on creation** when both token and phone are provided
4. **Returns `isFirstSignup` flag** to trigger welcome flow

**Request:**
```json
{
  "merchantId": "uuid",
  "phone": "1234567890",
  "token": "supabase-access-token"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "stamps_current": 3,
  "stamps_needed": 5,
  "redeemed": false,
  "business_name": "Coffee Shop",
  "isFirstSignup": true,
  "token": "cache-token",
  "customer_id": "uuid",
  "user_id": "uuid-if-auth"  // New field
}
```

#### Updated: Customer-Facing Check-In Page
- Fetches Supabase auth session on mount
- Includes `token` in check-in request when user is logged in
- Falls back gracefully to phone-only flow if not authenticated

#### Updated: Check-In Form Component
- Checks localStorage for cached token
- Sends token with check-in request

---

## Migration Roadmap

### Recommended Phase Order

#### **Phase A: Current (Stable)**
- ✅ Phone-based check-ins work as before
- ✅ First signup bonus and stars display implemented
- ✅ Database schema prepared with nullable wallet columns
- ✅ Authentication endpoints ready (`/api/customer/link`)
- ✅ Token-aware check-in flow operational

#### **Phase B: Optional — Link Existing Customers to Auth (3-6 months out)**
1. Invite merchants to create accounts and link their phone customers
2. Run backfill script (`scripts/backfill-link-customers.js`) for automated linking where phone+email match
3. Set `user_id` on matched customer rows
4. Start using `wallet_config` to store pass designs per merchant

#### **Phase C: Optional — Deploy Wallet Passes (6-12 months out)**
1. Enable Apple Wallet / Google Wallet pass generation
2. Add `apple_pass_provisioned_at` / `google_pass_provisioned_at` timestamps
3. Store pass serial/device IDs in `metadata`
4. Switch UI to show digital wallet pass instead of phone number
5. Deprecate phone-only lookup (move to legacy fallback)

#### **Phase D: Optional — Full Wallet Migration (12+ months out)**
1. Require phone verification via OTP before issuing wallet pass
2. Deprecate phone-based check-ins for new merchants
3. Require Supabase auth for all new check-ins
4. Archive phone-hash data (optional cleanup)

---

## Backward Compatibility & Safety

✅ **No breaking changes**
- Phone-based flow unchanged: `phone` + `phone_hash` lookup still works
- All new columns are nullable
- Existing customers continue to work without `user_id`
- Check-in endpoint accepts requests with or without token

✅ **Graceful degradation**
- If auth token is invalid, falls back to phone hash lookup
- If both phone and token are provided, uses both (phone creates row if needed)
- No automatic linking of customers without explicit user action

✅ **Data safety**
- Foreign keys use `ON DELETE SET NULL` (don't cascade delete customers)
- Unique partial index prevents duplicate wallet records
- Unique index on `(merchant_id, user_id)` where user_id IS NOT NULL ensures no duplicates

---

## Implementation Checklist

### Done (Completed in Current Work)
- [x] Create migration with wallet fields
- [x] Add `user_id` nullable column with FK to auth.users
- [x] Create indexes for user_id and wallet_enabled queries
- [x] Create partial unique index for (merchant_id, user_id)
- [x] Add `/api/customer/link` endpoint for claiming customer rows
- [x] Update `/api/checkin` to accept and use auth tokens
- [x] Update customer check-in page to fetch and send auth token
- [x] Update check-in form to send cached token
- [x] Update `/api/merchant/stats` to select wallet fields
- [x] Create backfill script template

### To Do (When Ready for Phase B)
- [ ] Add Supabase Auth sign-up to customer-facing app (optional)
- [ ] Run backfill script to match legacy customers to auth users
- [ ] Add UI in dashboard to show wallet-enabled merchants
- [ ] Implement Apple Wallet pass generation library
- [ ] Implement Google Wallet pass generation library
- [ ] Add pass provisioning endpoints

### To Do (When Ready for Phase C)
- [ ] Implement wallet pass display on check-in page
- [ ] Add device/pass serial tracking to metadata
- [ ] Implement pass revocation/refresh logic
- [ ] Add merchant configuration UI for wallet design (colors, logo, etc.)
- [ ] Deprecate phone-only queries in favor of user_id lookups

---

## Database State Summary

### Customers Table
```
id                               | customer id
merchant_id                      | which loyalty program
phone_hash (NOT NULL)            | current: phone lookup
phone_last_4                     | display last 4 digits
user_id (NEW, NULL)              | future: auth user link
phone_verified_at (NEW, NULL)    | when phone verified
phone_deleted_at (NEW, NULL)     | when phone unlinked
apple_pass_provisioned_at (NEW)  | when Apple pass created
google_pass_provisioned_at (NEW) | when Google pass created
pass_revoked_at (NEW, NULL)      | when pass revoked
metadata (NEW)                   | flexible store
stamps_current                   | current stamps
stamps_lifetime                  | all-time stamps
visits_total                     | visit count
last_visit_at                    | last check-in time
created_at, updated_at           | row timestamps
```

### Merchants Table (Additions)
```
wallet_config (NEW)     | per-merchant pass settings
wallet_enabled (NEW)    | feature flag
```

---

## Next Steps

1. **Run migration** against your database:
   ```sql
   psql -h db.xxx.supabase.co -U postgres -d postgres -f migrations/20260219_add_wallet_fields.sql
   ```

2. **Test current flow** to ensure phone-based check-ins still work

3. **Optional: Deploy auth signup** to customer-facing app when ready for Phase B

4. **Optional: Run backfill** script when you have auth users to associate

5. **Future: Implement wallet pass generation** when APIs are ready

---

## Questions & Troubleshooting

**Q: Will existing customers lose their data?**
A: No. All new columns are nullable and default to NULL. Existing customers continue to work via phone-hash lookup.

**Q: Can I test wallet features before deploying to production?**
A: Yes. The `/api/customer/link` endpoint is ready to test. Create a test Supabase auth user, then call the endpoint with a test customer_id.

**Q: What if a customer has both phone_hash and user_id linked?**
A: The check-in endpoint prefers user_id lookup first, so they'll always be found via auth. If auth token is invalid, it falls back to phone hash.

**Q: How do I backfill existing customers to auth users?**
A: Use the template script at `scripts/backfill-link-customers.js` and customize the matching logic for your data (phone_last_4, email, created_at window, etc.).

**Q: When should I require wallet passes?**
A: Not until Phase D. For now, phone-based flow remains the default and recommended approach.

---

## Support Files

- [Migration file](migrations/20260219_add_wallet_fields.sql)
- [Customer link endpoint](app/api/customer/link/route.ts)
- [Updated check-in endpoint](app/api/checkin/route.ts)
- [Backfill script template](scripts/backfill-link-customers.js)
