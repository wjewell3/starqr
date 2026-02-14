'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalCustomers: number;
  checkInsThisMonth: number;
  rewardsThisMonth: number;
  planTier: 'free' | 'paid';
  approachingLimit: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [merchantId, setMerchantId] = useState('');
  const [qr, setQr] = useState('');

  useEffect(() => {
    const load = async () => {
      const [statsRes, merchantRes] = await Promise.all([
        fetch('/api/merchant/stats'),
        (async () => {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;
          
          const { data } = await supabase
            .from('merchants')
            .select('id')
            .eq('user_id', user.id)
            .single();
          return data;
        })()
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (merchantRes) {
        setMerchantId(merchantRes.id);
        const QRCode = (await import('qrcode')).default;
        const url = `${window.location.origin}/c/${merchantRes.id}`;
        const code = await QRCode.toDataURL(url, { width: 300, margin: 2 });
        setQr(code);
      }
    };

    load();
  }, []);

  if (!stats) {
    return <div className="text-neutral-400">Loading...</div>;
  }

  const metrics = [
    { label: 'Customers', value: stats.totalCustomers, note: stats.planTier === 'free' ? `${25 - stats.totalCustomers} slots left` : 'Unlimited' },
    { label: 'Check-ins', value: stats.checkInsThisMonth, note: 'This month' },
    { label: 'Rewards', value: stats.rewardsThisMonth, note: 'Redeemed' },
  ];

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-2xl font-bold mb-1">Overview</h1>
        <p className="text-neutral-600">Your loyalty program at a glance</p>
      </div>

      {stats.approachingLimit && stats.planTier === 'free' && (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-orange-900 mb-1">
                {stats.totalCustomers === 25 ? 'Customer limit reached' : 'Approaching limit'}
              </p>
              <p className="text-sm text-orange-700">
                {stats.totalCustomers === 25 
                  ? 'Upgrade to continue adding customers'
                  : `${25 - stats.totalCustomers} customer slots remaining`
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
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {metrics.map((m) => (
          <div key={m.label} className="bg-neutral-50 rounded-lg p-6">
            <div className="text-sm text-neutral-600 mb-2">{m.label}</div>
            <div className="text-3xl font-bold mb-1">{m.value}</div>
            <div className="text-sm text-neutral-500">{m.note}</div>
          </div>
        ))}
      </div>

      {stats.totalCustomers === 0 ? (
        <div className="border border-neutral-200 rounded-lg p-8">
          <h2 className="font-semibold text-lg mb-4">Get started</h2>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="text-neutral-400">1.</span>
              <span className="text-neutral-600">Download your QR code below</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400">2.</span>
              <span className="text-neutral-600">Print it and put it on your counter</span>
            </li>
            <li className="flex gap-3">
              <span className="text-neutral-400">3.</span>
              <span className="text-neutral-600">Tell customers to scan it</span>
            </li>
          </ol>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-lg p-8">
          <h2 className="font-semibold text-lg mb-6">Your QR code</h2>
          {qr && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <img src={qr} alt="QR Code" className="w-48 h-48 border border-neutral-200 rounded-lg" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Customers scan this to check in and earn stamps
                  </p>
                  <code className="text-xs bg-neutral-100 px-3 py-2 rounded block mb-4">
                    {window.location.origin}/c/{merchantId}
                  </code>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = 'qr-code.png';
                      link.href = qr;
                      link.click();
                    }}
                    className="text-sm border border-neutral-300 px-4 py-2 rounded-lg hover:border-neutral-400"
                  >
                    Download
                  </button>
                  <Link
                    href="/dashboard/settings"
                    className="text-sm text-neutral-600 hover:text-neutral-900 px-4 py-2"
                  >
                    Print options →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
