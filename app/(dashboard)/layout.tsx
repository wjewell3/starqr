'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [planTier, setPlanTier] = useState<'free' | 'paid'>('free');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('business_name, plan_tier')
        .eq('user_id', user.id)
        .single();

      if (!merchant) {
        router.push('/onboarding');
        return;
      }

      setBusinessName(merchant.business_name);
      setPlanTier(merchant.plan_tier);
      setLoading(false);
    };

    init();
  }, [router]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  const nav = [
    { href: '/dashboard', label: 'Overview', exact: true },
    { href: '/dashboard/settings', label: 'Settings', exact: false },
    { href: '/dashboard/billing', label: 'Billing', exact: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="border-b border-slate-200/60 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-auto md:h-14 py-2 md:py-0 flex-wrap md:flex-nowrap gap-2 md:gap-0">
            <div className="flex items-center gap-2 md:gap-8 order-1 md:order-none min-w-0">
              <Link href="/dashboard" className="font-medium text-slate-900 whitespace-nowrap text-sm md:text-base">
                StarQR
              </Link>
              <nav className="hidden md:flex gap-6">
                {nav.map((item) => {
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm transition-colors ${
                        isActive
                          ? 'text-slate-900 font-medium'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 order-3 md:order-none">
              <div className="text-xs text-slate-500 hidden md:block">
                {businessName}
              </div>
              {planTier === 'free' && (
                <Link
                  href="/dashboard/upgrade"
                  className="text-xs bg-slate-900 text-white px-2 md:px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
                >
                  Upgrade
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign out
              </button>
            </div>

            <nav className="flex md:hidden gap-1 order-2 w-full md:w-auto">
              {nav.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-xs flex-1 text-center transition-colors px-2 py-2 rounded-md whitespace-nowrap overflow-hidden text-ellipsis ${
                      isActive
                        ? 'text-slate-900 font-medium bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {children}
      </div>

      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-semibold text-slate-900 mb-4">StarQR</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Modern loyalty cards for local businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/upgrade" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link></li>
                <li><Link href="/signup" className="text-sm text-slate-600 hover:text-slate-900">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">About</Link></li>
                <li><Link href="/faq" className="text-sm text-slate-600 hover:text-slate-900">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8">
            <p className="text-sm text-slate-500 text-center">
              © 2026 StarQR. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
