import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = createServerClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const email = user.email;
    if (!email) {
      return NextResponse.json({ error: 'User has no email' }, { status: 400 });
    }

    // Find Stripe customers by email
    const customers = await stripe.customers.list({ email, limit: 10 });

    if (!customers.data || customers.data.length === 0) {
      return NextResponse.json({ error: 'No Stripe customer found for this email' }, { status: 404 });
    }

    // Prefer a customer with metadata.merchant_id if present
    let customer = customers.data.find((c) => c.metadata?.merchant_id) || customers.data[0];

    // Find active or recent subscription for the customer
    const subs = await stripe.subscriptions.list({ customer: customer.id, limit: 10 });
    const activeSub = subs.data.find((s) => s.status === 'active' || s.status === 'trialing') || subs.data[0] || null;

    // Find merchant row for this user
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant record not found' }, { status: 404 });
    }

    // Update merchant with Stripe ids and status
    const updatePayload: Record<string, any> = {};
    if (customer.id) updatePayload.stripe_customer_id = customer.id;
    if (activeSub && (activeSub.id || (activeSub as any).id)) {
      const sid = typeof activeSub === 'string' ? activeSub : (activeSub as any).id;
      updatePayload.stripe_subscription_id = sid;
      updatePayload.subscription_status = activeSub.status ?? 'active';
      updatePayload.subscription_current_period_end = activeSub.current_period_end
        ? new Date(activeSub.current_period_end * 1000).toISOString()
        : null;
      updatePayload.plan_tier = 'paid';
    }

    if (Object.keys(updatePayload).length > 0) {
      await supabase.from('merchants').update(updatePayload).eq('id', merchant.id);
    }

    return NextResponse.json({ success: true, updated: updatePayload });
  } catch (err) {
    console.error('Reconcile error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
