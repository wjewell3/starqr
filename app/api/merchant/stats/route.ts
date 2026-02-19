import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get merchant
    const { data: merchant } = await supabase
      .from('merchants')
      .select('id, plan_tier')
      .eq('user_id', user.id)
      .single();

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Get total customers
    const { count: totalCustomers } = await supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id);

    // Get check-ins this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: checkInsThisMonth } = await supabase
      .from('check_ins')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .gte('created_at', startOfMonth.toISOString());

    // Get rewards redeemed this month
    const { count: rewardsThisMonth } = await supabase
      .from('rewards_redeemed')
      .select('id', { count: 'exact', head: true })
      .eq('merchant_id', merchant.id)
      .gte('redeemed_at', startOfMonth.toISOString());

    // Get top customers (by visit count)
    const { data: topCustomers } = await supabase
      .from('customers')
      .select('phone_last_4, visits_total, stamps_current, user_id, apple_pass_provisioned_at, google_pass_provisioned_at, pass_revoked_at')
      .eq('merchant_id', merchant.id)
      .order('visits_total', { ascending: false })
      .limit(5);

    // Get recent check-ins (last 10)
    const { data: recentCheckIns } = await supabase
      .from('check_ins')
      .select(`
        created_at,
        customers (
          phone_last_4
        )
      `)
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Check if approaching free tier limit
    const freeTierLimit = 25;
    const approachingLimit = merchant.plan_tier === 'free' && totalCustomers && totalCustomers >= 20;

    return NextResponse.json({
      stats: {
        totalCustomers: totalCustomers || 0,
        checkInsThisMonth: checkInsThisMonth || 0,
        rewardsThisMonth: rewardsThisMonth || 0,
        freeTierLimit,
        approachingLimit,
        planTier: merchant.plan_tier,
      },
      topCustomers: topCustomers || [],
      recentCheckIns: recentCheckIns?.map(ci => ({
        timestamp: ci.created_at,
        phoneLast4: ci.customers ? (ci.customers as any).phone_last_4 : 'Unknown',
      })) || [],
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
