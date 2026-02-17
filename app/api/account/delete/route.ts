import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE() {
  try {
    const supabase = createClient();

    // Get current user from server-side supabase (reads cookies)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Look up merchant and any Stripe IDs
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id, stripe_customer_id, stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (merchantError) {
      console.error('Failed to fetch merchant for delete:', merchantError);
      // proceed — maybe merchant already removed
    }

    // Cancel Stripe subscription / delete customer if present
    if (merchant && (merchant.stripe_subscription_id || merchant.stripe_customer_id)) {
      try {
        const StripeModule = await import('stripe');
        const Stripe = StripeModule.default || StripeModule;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

        if (merchant.stripe_subscription_id) {
          try {
            // Some Stripe client versions expose `del`, others do not in the types.
            // Try calling `del` dynamically; if unavailable, schedule cancellation at period end.
            if (typeof (stripe.subscriptions as any).del === 'function') {
              await (stripe.subscriptions as any).del(merchant.stripe_subscription_id as string);
            } else {
              await stripe.subscriptions.update(merchant.stripe_subscription_id as string, {
                cancel_at_period_end: true,
              } as any);
            }
          } catch (err) {
            console.warn('Stripe subscription deletion warning:', err);
          }
        }

        // Optionally delete customer when configured
        if (process.env.DELETE_STRIPE_CUSTOMER_ON_ACCOUNT_DELETE === '1' && merchant.stripe_customer_id) {
          try {
            await stripe.customers.del(merchant.stripe_customer_id as string);
          } catch (err) {
            console.warn('Stripe customer deletion warning:', err);
          }
        }
      } catch (err) {
        console.error('Stripe client error:', err);
        return NextResponse.json({ error: 'Stripe error' }, { status: 500 });
      }
    }

    // Delete related rows (customers) first
    try {
      if (merchant && merchant.id) {
        await supabase.from('customers').delete().eq('merchant_id', merchant.id);
        await supabase.from('merchants').delete().eq('id', merchant.id);
      }
    } catch (err) {
      console.error('Failed to delete DB rows:', err);
      return NextResponse.json({ error: 'Failed to delete merchant data' }, { status: 500 });
    }

    // Finally delete the Supabase auth user using service role
    try {
      const { createClient: createAdminClient } = await import('@supabase/supabase-js');
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: { autoRefreshToken: false, persistSession: false },
        }
      );

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
      if (deleteError) {
        console.error('Failed to delete auth user:', deleteError);
        return NextResponse.json({ error: 'Failed to delete auth user' }, { status: 500 });
      }
    } catch (err) {
      console.error('Admin delete error:', err);
      return NextResponse.json({ error: 'Failed to delete auth user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
