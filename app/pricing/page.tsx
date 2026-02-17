"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function PricingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const canceled = searchParams.get('canceled') === 'true';

  const handleUpgrade = async () => {
    setLoading(true);

    // Ensure user is logged in before creating a checkout session.
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Prompt sign up / login flow; preserve intent to upgrade
      router.push('/signup?next=/pricing&intent=upgrade');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout. Please contact support.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="font-medium text-slate-900">
              StarQR
            </Link>
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
              ← Back to home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {canceled && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800">
              Checkout was canceled. You can upgrade anytime.
            </p>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Choose Your Plan</h1>
          <p className="text-lg text-slate-600">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Free</h2>
              <div className="text-4xl font-bold text-slate-900">$0</div>
              <p className="text-slate-600 mt-2">Perfect for getting started</p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                'Up to 25 customers',
                'Unlimited stamps',
                'QR code for your shop',
                'Simple dashboard',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="w-full block text-center border border-slate-300 py-2.5 rounded-lg hover:border-slate-400 transition-colors font-medium text-sm"
            >
              Get started free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-amber-500 rounded-xl p-8 bg-gradient-to-br from-amber-50 to-orange-50 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              Recommended
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro</h2>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-gray-900">$9</div>
                <span className="text-sm line-through text-gray-500">$12</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Save 25%</span>
              </div>
              <p className="text-gray-600 mt-2">/month</p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                'Unlimited customers',
                'Everything in Free Plan',
                'Email support',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-lg hover:opacity-95 disabled:opacity-60 transition-colors font-medium text-sm"
            >
              {loading ? 'Redirecting...' : 'Upgrade to Pro'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Cancel anytime · No contracts
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-slate-600 mb-4">Have questions?</p>
          <Link
            href="/faq"
            className="text-sm text-slate-900 hover:underline font-medium"
          >
            View Frequently Asked Questions →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
