import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/admin';
import { generateUniqueSlug } from '@/lib/slug';

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get merchant by looking up business name and matching slug
    const { data: merchants, error } = await supabase
      .from('merchants')
      .select('id, business_name');

    if (error || !merchants) {
      return NextResponse.json(
        { error: 'Failed to lookup merchant' },
        { status: 500 }
      );
    }

    const merchant = merchants.find(m => generateUniqueSlug(m.business_name, m.id) === slug);

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: merchant.id,
      business_name: merchant.business_name,
    });
  } catch (error) {
    console.error('Lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
