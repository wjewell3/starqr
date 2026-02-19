-- Migration: add wallet-friendly fields to support future digital-wallet migration
-- Adds nullable user mapping, provisioning timestamps, metadata, and merchant wallet config

BEGIN;

-- 1) Add nullable `user_id` to customers to map to authenticated users (Supabase `auth.users`)
ALTER TABLE IF EXISTS public.customers
  ADD COLUMN IF NOT EXISTS user_id uuid NULL;

-- 2) Add optional phone lifecycle fields
ALTER TABLE IF EXISTS public.customers
  ADD COLUMN IF NOT EXISTS phone_verified_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS phone_deleted_at timestamptz NULL;

-- 3) Add pass provisioning / wallet lifecycle timestamps
ALTER TABLE IF EXISTS public.customers
  ADD COLUMN IF NOT EXISTS apple_pass_provisioned_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS google_pass_provisioned_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS pass_revoked_at timestamptz NULL;

-- 4) Add flexible metadata column for future-proofing (e.g., pass payloads, device ids)
ALTER TABLE IF EXISTS public.customers
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 5) Add merchant-level wallet config and flag to enable wallet features per merchant
ALTER TABLE IF EXISTS public.merchants
  ADD COLUMN IF NOT EXISTS wallet_config jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS wallet_enabled boolean DEFAULT false;

-- 6) Indexes to speed up lookups by user_id and wallet-enabled merchants
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_wallet_enabled ON public.merchants (wallet_enabled);

-- 7) Unique mapping for (merchant_id, user_id) when user_id is present (prevents duplicate wallet records)
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_merchant_user ON public.customers (merchant_id, user_id) WHERE user_id IS NOT NULL;

-- 8) FK to auth.users if available in your Postgres instance (Supabase uses auth schema). Use ON DELETE SET NULL.
DO $$
BEGIN
  IF (SELECT to_regclass('auth.users')) IS NOT NULL THEN
    -- Check if constraint exists before adding
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'customers_user_id_fkey'
      AND table_name = 'customers'
    ) THEN
      ALTER TABLE public.customers
        ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
  END IF;
END$$;

COMMIT;

-- Notes:
-- - All columns are nullable to avoid breaking existing code. After you add customer auth flows you can backfill and populate `user_id`.
-- - Consider adding a one-time migration script to associate legacy `customers` rows with new `auth.users` when users sign up.
-- - You may prefer to move phone deletion to an explicit cleanup job once users adopt wallet accounts.
