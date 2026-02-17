import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Retrieve the checkout session and expand the subscription
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    } as any);

    const merchantId = session.metadata?.merchant_id as string | undefined;
    const subscription = (session.subscription as any) || null;

    if (!merchantId) {
      return NextResponse.json({ error: 'No merchant metadata on session' }, { status: 400 });
    }

    const supabase = createClient();

    if (subscription && (subscription.id || subscription?.id)) {
      const subscriptionId = typeof subscription === 'string' ? subscription : subscription.id;
      const status = subscription.status ?? 'active';
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

      await supabase
        .from('merchants')
        .update({
          stripe_subscription_id: subscriptionId,
          subscription_status: status,
          subscription_current_period_end: currentPeriodEnd,
          plan_tier: 'paid',
        })
        .eq('id', merchantId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Confirm checkout error:', err);
    return NextResponse.json({ error: 'Failed to confirm checkout' }, { status: 500 });
  }
}
