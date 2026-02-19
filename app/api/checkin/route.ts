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
      .select('id, business_name, stamps_needed, reward_text, plan_tier, subscription_status')
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

    // 3. Hash phone number (if provided)
    const phoneHash = phone ? hashPhone(phone, merchantId) : null;
    const phoneLast4 = phone ? getPhoneLast4(phone) : null;

    // 4. If a Supabase auth token was provided, prefer the authenticated user mapping
    let userId: string | null = null;
    if (token) {
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser(token as string);
        if (!userErr && userData && (userData as any).user) {
          userId = (userData as any).user.id;
        }
      } catch (e) {
        console.warn('Failed to resolve user from token:', e);
      }
    }

    // 5. Get or create customer. If userId is present, try to find by user_id first.
    let customer: any = null;
    let customerError: any = null;

    if (userId) {
      const res = await supabase
        .from('customers')
        .select('*')
        .eq('merchant_id', merchantId)
        .eq('user_id', userId)
        .single();
      customer = res.data;
      customerError = res.error;
    }

    // If customer not found via user_id, fall back to phone hash lookup (if phone provided)
    if (!customer && phoneHash) {
      const res = await supabase
        .from('customers')
        .select('*')
        .eq('merchant_id', merchantId)
        .eq('phone_hash', phoneHash)
        .single();
      customer = res.data;
      customerError = res.error;
    }

    if (customerError && (customerError as any).code !== 'PGRST116') {
      throw customerError;
    }

    // 6. Check free tier customer limit BEFORE creating new customer
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
      // If user is present but phone wasn't provided, we cannot create a customer due to existing NOT NULL phone_hash constraint.
      if (userId && !phoneHash) {
        return NextResponse.json({ error: 'Authenticated user has no linked phone. Please provide a phone number to link your wallet.' }, { status: 400 });
      }

      // Create new customer (includes user_id when available)
      const insertPayload: any = {
        merchant_id: merchantId,
        phone_hash: phoneHash,
        phone_last_4: phoneLast4,
        stamps_current: 0,
        stamps_lifetime: 0,
        visits_total: 0,
      };

      if (userId) insertPayload.user_id = userId;

      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert(insertPayload)
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

    // 7. Detect first signup and award bonus stamps
    const isFirstSignup = customer.stamps_lifetime === 0;
    const bonusStamps = isFirstSignup ? 2 : 0;
    const totalStampsAdded = 1 + bonusStamps;
    
    // Create check-in and update stamps
    const newStamps = customer.stamps_current + totalStampsAdded;
    const redeemed = newStamps >= merchant.stamps_needed;

    const { error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        merchant_id: merchantId,
        customer_id: customer.id,
        stamps_added: totalStampsAdded,
      });

    if (checkInError) throw checkInError;

    // 8. Update customer stamps
    const stampsAfterRedemption = redeemed ? 0 : newStamps;
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        stamps_current: stampsAfterRedemption,
        stamps_lifetime: customer.stamps_lifetime + totalStampsAdded,
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
      business_name: merchant.business_name,
      token: cacheToken,
      customer_id: customer.id,
      isFirstSignup,
    });

  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
