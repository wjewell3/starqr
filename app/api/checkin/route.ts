import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/admin';
import { hashPhone, getPhoneLast4 } from '@/lib/phone-hash';

export async function POST(req: NextRequest) {
  try {
    const { merchantId, phone, token } = await req.json();

    // Validate inputs
    if (!merchantId || (!phone && !token)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 1. Get merchant details
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id, stamps_needed, reward_text, plan_tier, subscription_status')
      .eq('id', merchantId)
      .single();

    if (merchantError || !merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // 2. Check if merchant account is active
    if (merchant.subscription_status === 'paused' || merchant.subscription_status === 'canceled') {
      return NextResponse.json(
        { error: 'This loyalty program is temporarily unavailable' },
        { status: 403 }
      );
    }

    // 3. Hash phone number
    const phoneHash = hashPhone(phone, merchantId);
    const phoneLast4 = getPhoneLast4(phone);

    // 4. Get or create customer
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('merchant_id', merchantId)
      .eq('phone_hash', phoneHash)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      throw customerError;
    }

    // 5. Check free tier customer limit BEFORE creating new customer
    if (!customer && merchant.plan_tier === 'free') {
      const { count } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true })
        .eq('merchant_id', merchantId);

      if (count && count >= 25) {
        return NextResponse.json(
          { 
            error: 'Customer limit reached',
            upgradeRequired: true,
            message: 'This business has reached the free tier limit. Ask them to upgrade!'
          },
          { status: 403 }
        );
      }
    }

    if (!customer) {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          merchant_id: merchantId,
          phone_hash: phoneHash,
          phone_last_4: phoneLast4,
          stamps_current: 0,
          stamps_lifetime: 0,
          visits_total: 0,
        })
        .select()
        .single();

      if (createError) throw createError;
      customer = newCustomer;
    }

    // 6. Check for duplicate check-in (24-hour window)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentCheckIn } = await supabase
      .from('check_ins')
      .select('id')
      .eq('merchant_id', merchantId)
      .eq('customer_id', customer.id)
      .gte('created_at', oneDayAgo)
      .single();

    if (recentCheckIn) {
      return NextResponse.json(
        {
          error: 'Already checked in today',
          stamps_current: customer.stamps_current,
          stamps_needed: merchant.stamps_needed,
          nextCheckInAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        { status: 429 }
      );
    }

    // 7. Create check-in and update stamps
    const newStamps = customer.stamps_current + 1;
    const redeemed = newStamps >= merchant.stamps_needed;

    const { error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        merchant_id: merchantId,
        customer_id: customer.id,
        stamps_added: 1,
      });

    if (checkInError) throw checkInError;

    // 8. Update customer stamps
    const stampsAfterRedemption = redeemed ? 0 : newStamps;
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        stamps_current: stampsAfterRedemption,
        stamps_lifetime: customer.stamps_lifetime + 1,
        visits_total: customer.visits_total + 1,
        last_visit_at: new Date().toISOString(),
      })
      .eq('id', customer.id);

    if (updateError) throw updateError;

    // 9. If redeemed, create reward record
    if (redeemed) {
      await supabase
        .from('rewards_redeemed')
        .insert({
          merchant_id: merchantId,
          customer_id: customer.id,
          stamps_used: merchant.stamps_needed,
        });
    }

    // 10. Generate token for caching (simple hash of customer ID + timestamp)
    const cacheToken = Buffer.from(`${customer.id}:${Date.now()}`).toString('base64');

    return NextResponse.json({
      success: true,
      stamps_current: stampsAfterRedemption,
      stamps_needed: merchant.stamps_needed,
      redeemed,
      reward_text: merchant.reward_text,
      token: cacheToken,
      customer_id: customer.id,
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
