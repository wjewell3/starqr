import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();

    switch (event.type) {
      // ✅ Checkout completed
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const merchantId = session.metadata?.merchant_id;

        if (merchantId && session.subscription) {
          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : (session.subscription as Stripe.Subscription)?.id;

          if (subscriptionId) {
            await supabase
              .from('merchants')
              .update({
                stripe_subscription_id: subscriptionId,
                subscription_status: 'active',
                plan_tier: 'paid',
              })
              .eq('id', merchantId);
          }
        }
        break;
      }

      // ✅ Subscription updated
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const merchantId = subscription.metadata?.merchant_id;

        if (merchantId) {
          const currentPeriodEnd =
            subscription.items.data[0]?.current_period_end;

          await supabase
            .from('merchants')
            .update({
              subscription_status: subscription.status ?? 'unknown',
              subscription_current_period_end: currentPeriodEnd
                ? new Date(currentPeriodEnd * 1000).toISOString()
                : null,
            })
            .eq('id', merchantId);
        }
        break;
      }

      // ✅ Subscription deleted
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const merchantId = subscription.metadata?.merchant_id;

        if (merchantId) {
          await supabase
            .from('merchants')
            .update({
              subscription_status: 'canceled',
              plan_tier: 'free',
            })
            .eq('id', merchantId);
        }
        break;
      }

      // ✅ Invoice payment failed
      case 'invoice.payment_failed': {
        // ⚠️ Type assertion fixes TS error
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };

        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const { data: merchant } = await supabase
            .from('merchants')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          if (merchant) {
            await supabase
              .from('merchants')
              .update({ subscription_status: 'paused' })
              .eq('id', merchant.id);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
