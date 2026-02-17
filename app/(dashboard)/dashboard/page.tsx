'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { generateUniqueSlug } from '@/lib/slug';

interface Stats {
  totalCustomers: number;
  checkInsThisMonth: number;
  rewardsThisMonth: number;
  planTier: 'free' | 'paid';
  approachingLimit: boolean;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<Stats | null>(null);
  const [merchantId, setMerchantId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [qr, setQr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        
        const { data: merchant } = await supabase
          .from('merchants')
          .select('id, business_name')
          .eq('user_id', user.id)
          .single();

        if (merchant) {
          setMerchantId(merchant.id);
          setBusinessName(merchant.business_name);
          const merchantSlug = generateUniqueSlug(merchant.business_name, merchant.id);
          setSlug(merchantSlug);
          
          const QRCode = (await import('qrcode')).default;
          const url = `${window.location.origin}/c/${merchantSlug}`;
          const code = await QRCode.toDataURL(url, { width: 300, margin: 2 });
          setQr(code);
        }

        const statsResponse = await fetch('/api/merchant/stats');
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data.stats);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setLoading(false);
      }
    }

    // If returning from checkout, confirm the session with the server and then reload stats
    const checkAndLoad = async () => {
      const sessionId = searchParams.get('session_id');
      const upgrade = searchParams.get('upgrade');

      if (upgrade === 'success' && sessionId) {
        try {
          await fetch(`/api/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`);
        } catch (err) {
          console.warn('Confirm checkout failed:', err);
        }
      }

      await loadDashboardData();
    };

    checkAndLoad();
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-slate-400 text-sm">Loading...</div>
    );
  }

  const slotsLeft = 25 - stats.totalCustomers;

  return (
    <>
      <div className="mb-12">
        <h1 className="text-2xl font-bold mb-1 text-slate-900">Overview</h1>
        <p className="text-slate-600 text-sm">Your loyalty program at a glance</p>
      </div>

      {stats.approachingLimit && stats.planTier === 'free' ? (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-orange-900 mb-1">
                {stats.totalCustomers === 25 ? 'Customer limit reached' : 'Approaching limit'}
              </p>
              <p className="text-sm text-orange-700">
                {stats.totalCustomers === 25 
                  ? 'Upgrade to continue adding customers'
                  : `${slotsLeft} customer slots remaining`
                }
              </p>
            </div>
            <Link
              href="/dashboard/upgrade"
              className="text-sm bg-orange-900 text-white px-3 py-1.5 rounded-md hover:bg-orange-800"
            >
              Upgrade
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-50 rounded-lg p-6">
          <div className="text-sm text-slate-600 mb-2">Customers</div>
          <div className="text-3xl font-bold mb-1 text-slate-900">{stats.totalCustomers}</div>
          <div className="text-sm text-slate-500">
            {stats.planTier === 'free' ? `${slotsLeft} slots left` : 'Unlimited'}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <div className="text-sm text-slate-600 mb-2">Check-ins</div>
          <div className="text-3xl font-bold mb-1 text-slate-900">{stats.checkInsThisMonth}</div>
          <div className="text-sm text-slate-500">This month</div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          <div className="text-sm text-slate-600 mb-2">Rewards</div>
          <div className="text-3xl font-bold mb-1 text-slate-900">{stats.rewardsThisMonth}</div>
          <div className="text-sm text-slate-500">Redeemed</div>
        </div>
      </div>

      {stats.totalCustomers === 0 ? (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4 text-slate-900">Get started</h2>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="text-blue-600 font-medium">1.</span>
              <span className="text-slate-700">Download your QR code below</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-medium">2.</span>
              <span className="text-slate-700">Print it and display on your counter</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-medium">3.</span>
              <span className="text-slate-700">Tell customers to scan it when they visit</span>
            </li>
          </ol>
        </div>
      ) : null}

      <div className="border border-slate-200 rounded-lg p-8">
        <h2 className="font-semibold text-lg mb-6 text-slate-900">Your QR Code</h2>
        
        {qr && merchantId ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img src={qr} alt="QR Code" className="w-48 h-48 border border-slate-200 rounded-lg" />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                {businessName ? (
                  <p className="text-sm text-slate-600 mb-1">
                    <strong className="text-slate-900">{businessName}</strong>
                  </p>
                ) : null}
                <p className="text-sm text-slate-600 mb-4">
                  Customers scan this to check in and earn stamps
                </p>
                <code className="text-xs bg-slate-100 px-3 py-2 rounded block mb-4 overflow-x-auto">
                  {window.location.origin}/c/{slug}
                </code>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!qr) return;
                    const link = document.createElement('a');
                    const filename = businessName 
                      ? `${businessName.replace(/\s+/g, '-')}-qr-code.png`
                      : 'qr-code.png';
                    link.download = filename;
                    link.href = qr;
                    link.click();
                  }}
                  className="text-sm border border-slate-300 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors font-medium"
                >
                  Download
                </button>
                <Link
                  href="/dashboard/settings"
                  className="text-sm border border-slate-300 px-4 py-2 rounded-lg hover:border-slate-400 transition-colors font-medium"
                >
                  Print options
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400">Loading QR code...</div>
        )}
      </div>
    </>
  );
}