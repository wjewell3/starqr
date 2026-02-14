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

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const merchantId = session.metadata?.merchant_id;

        if (merchantId && session.subscription) {
          await supabase
            .from('merchants')
            .update({
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
              plan_tier: 'paid',
            })
            .eq('id', merchantId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const merchantId = subscription.metadata?.merchant_id;

        if (merchantId) {
          await supabase
            .from('merchants')
            .update({
              subscription_status: subscription.status as any,
              subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', merchantId);
        }
        break;
      }

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

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = invoice.subscription as string;

        if (subscription) {
          const { data: merchant } = await supabase
            .from('merchants')
            .select('id')
            .eq('stripe_subscription_id', subscription)
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
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
