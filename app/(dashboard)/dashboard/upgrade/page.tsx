'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Upgrade() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const canceled = searchParams.get('canceled') === 'true';

  const handleUpgrade = async () => {
    setLoading(true);

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
            <Link href="/dashboard" className="font-medium text-slate-900">
              StarQR
            </Link>
            <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {canceled && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800">
              Checkout was canceled. You can upgrade anytime.
            </p>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Upgrade to Pro</h1>
          <p className="text-lg text-slate-600">
            Unlock unlimited customers and premium features
          </p>
        </div>

        {/* FAQ at top */}
        <div className="mb-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 text-sm">Can I cancel anytime?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes. Cancel with one click. You keep Pro features until the end of your billing period.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 text-sm">What about my data?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All existing customers and stamps are preserved. You just remove the 25 customer limit.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2 text-sm">Need help deciding?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Start with the free tier. Upgrade when you hit 20 customers and need more capacity.
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-slate-900 shadow-xl p-8 md:p-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Pro Plan</h2>
              <p className="text-slate-600">Everything you need to scale</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-slate-900">$9</div>
              <div className="text-slate-600">/month</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              'Unlimited customers',
              'Advanced analytics and insights',
              'Customer export (CSV)',
              'Priority email support',
              'Custom branding options',
              'Early access to new features',
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3.5 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-colors font-semibold text-lg"
          >
            {loading ? 'Redirecting to checkout...' : 'Upgrade now'}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Cancel anytime · No contracts · Secure payment via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}