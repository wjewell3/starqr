import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_id, merchant_id, token } = body || {};

    // Allow token in Authorization header as Bearer token
    let bearerToken = token;
    const authHeader = req.headers.get('authorization');
    if (!bearerToken && authHeader && authHeader.startsWith('Bearer ')) {
      bearerToken = authHeader.split(' ')[1];
    }

    if (!customer_id || !merchant_id || !bearerToken) {
      return NextResponse.json({ error: 'Missing required fields (customer_id, merchant_id, token)' }, { status: 400 });
    }

    const supabase = createClient();

    // Resolve user from token
    const { data: userData, error: userErr } = await supabase.auth.getUser(bearerToken as string);
    if (userErr || !userData || !(userData as any).user) {
      return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });
    }

    const userId = (userData as any).user.id as string;

    // Fetch customer and ensure it belongs to merchant
    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customer_id)
      .eq('merchant_id', merchant_id)
      .single();

    if (custErr || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // If already linked to another user, refuse
    if (customer.user_id && customer.user_id !== userId) {
      return NextResponse.json({ error: 'Customer already claimed by another user' }, { status: 409 });
    }

    // Idempotent update: set user_id if not present
    const { data: updated, error: updateErr } = await supabase
      .from('customers')
      .update({ user_id: userId })
      .eq('id', customer_id)
      .select()
      .single();

    if (updateErr) {
      console.error('Failed to link customer:', updateErr);
      return NextResponse.json({ error: 'Failed to link customer' }, { status: 500 });
    }

    return NextResponse.json({ success: true, customer: updated });
  } catch (err) {
    console.error('Link customer error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
