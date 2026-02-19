#!/usr/bin/env node

/**
 * Backfill Script: Associate Legacy Phone-Based Customers with Supabase Auth Users
 *
 * This script is a helper for migrating from phone-based customers to wallet/auth-based customers.
 * It runs after users have created auth accounts and allows you to associate them with existing
 * customer records based on phone number matching.
 *
 * Usage (from project root):
 *   node scripts/backfill-link-customers.js --batch-size 100 --dry-run
 *
 * Flags:
 *   --batch-size N   Process N customers per batch (default: 50)
 *   --dry-run        Don't persist changes, just log what would happen
 *   --email DOMAIN   Match users by email domain (e.g., 'gmail.com')
 *   --merchant-id ID Only backfill for a specific merchant
 */

const fs = require('fs');
const path = require('path');

// Parse CLI flags
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2);
    const value = args[i + 1]?.startsWith('--') ? true : args[i + 1];
    if (value && !value.startsWith('--')) {
      flags[key] = value;
      i++;
    } else {
      flags[key] = true;
    }
  }
}

const batchSize = parseInt(flags['batch-size'] || '50', 10);
const dryRun = flags['dry-run'] === true;
const emailDomain = flags['email'];
const merchantId = flags['merchant-id'];

console.log(`
===================================
Backfill Link Customers Script
===================================

Configuration:
  - Batch size: ${batchSize}
  - Dry run: ${dryRun ? 'YES (no changes)' : 'NO (will persist)'}
  - Email domain filter: ${emailDomain || 'none'}
  - Merchant ID filter: ${merchantId || 'all'}

Requirements:
  - SUPABASE_URL environment variable
  - SUPABASE_SERVICE_ROLE_KEY environment variable

Note:
  This is a helper script for manual backfill operations.
  Review the output carefully before running without --dry-run.
===================================

`);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Set these environment variables and try again.');
  process.exit(1);
}

// Note: In a real scenario, you'd import @supabase/supabase-js here
// For now, we'll provide a template and instructions:

console.log(`
To implement this backfill, use the following TypeScript/JavaScript code in your codebase:

---

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function backfillLinkCustomers() {
  // 1. Fetch all customers where user_id IS NULL
  const { data: unlinkedCustomers, error: fetchErr } = await supabase
    .from('customers')
    .select('id, merchant_id, phone_last_4, email')
    .is('user_id', null)
    .limit(${batchSize});

  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
    return;
  }

  console.log(\`Found \${unlinkedCustomers?.length || 0} unlinked customers\`);

  // 2. For each customer, try to find a matching auth user
  for (const customer of unlinkedCustomers || []) {
    // Strategy 1: Match by phone_last_4 (requires additional context)
    // Strategy 2: Match by email if available
    // Strategy 3: Match by merchant + phone_last_4 + created_at window

    // Example: Find auth users created around the same time
    const { data: authUsers, error: authErr } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .ilike('email', \`%\${customer.email}%\`)
      .limit(1);

    if (!authErr && authUsers && authUsers.length > 0) {
      const userId = authUsers[0].id;

      // Update customer.user_id
      const { error: updateErr } = await supabase
        .from('customers')
        .update({ user_id: userId })
        .eq('id', customer.id);

      if (updateErr) {
        console.error(\`Failed to link customer \${customer.id}:\`, updateErr);
      } else {
        console.log(\`Linked customer \${customer.id} to user \${userId}\`);
      }
    }
  }
}

---

Alternatively, if running this script standalone, install @supabase/supabase-js:
  npm install @supabase/supabase-js

Then update this script to import and use it.

`);

console.log(`\nNote: This script is a template. Please customize the matching strategy based on your data.`);
