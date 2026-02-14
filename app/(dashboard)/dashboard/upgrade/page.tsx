'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UpgradePage() {
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
        alert('Failed to start checkout');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Upgrade to Pro</h1>
        <p className="text-xl text-gray-600">Unlock unlimited customers and premium features</p>
      </div>

      {/* Canceled Message */}
      {canceled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Checkout was canceled. You can upgrade anytime!
          </p>
        </div>
      )}

      {/* Pricing Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-amber-500 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
            <div className="text-6xl mb-4">⭐</div>
            <CardTitle className="text-3xl">TapQR Pro</CardTitle>
            <CardDescription className="text-lg mt-2">
              Everything you need to reward your customers
            </CardDescription>
            <div className="mt-6">
              <span className="text-5xl font-bold text-gray-900">$9</span>
              <span className="text-xl text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Cancel anytime • No contracts</p>
          </CardHeader>
          <CardContent className="p-8">
            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Unlimited Customers</p>
                  <p className="text-sm text-gray-600">No more 25 customer limit</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Customer Export</p>
                  <p className="text-sm text-gray-600">Download your customer list as CSV</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Advanced Analytics</p>
                  <p className="text-sm text-gray-600">Track trends and customer behavior</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Priority Support</p>
                  <p className="text-sm text-gray-600">Get help when you need it</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Free QR Sticker</p>
                  <p className="text-sm text-gray-600">Professional weatherproof sticker shipped free</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Early Access</p>
                  <p className="text-sm text-gray-600">Try new features before everyone else</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              size="lg"
              className="w-full text-lg h-14"
            >
              {loading ? 'Redirecting to checkout...' : 'Upgrade Now →'}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Secure payment powered by Stripe • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials/Social Proof */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Join 100+ businesses already using TapQR Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-4">
                <p className="text-gray-700 italic mb-2">
                  "Upgrading to Pro was a no-brainer once we hit 20 customers. 
                  The customer export feature alone saves us hours every month."
                </p>
                <p className="text-sm text-gray-600">— Sarah M., Bright Day Coffee</p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <p className="text-gray-700 italic mb-2">
                  "We see about 100 check-ins per week now. The analytics help us 
                  understand our busiest times and reward our most loyal customers."
                </p>
                <p className="text-sm text-gray-600">— Mike T., Sweet Scoops Ice Cream</p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <p className="text-gray-700 italic mb-2">
                  "Best $9/month we spend. Our regulars love the simplicity 
                  and we love seeing them come back."
                </p>
                <p className="text-sm text-gray-600">— Alex K., The Bagel Hub</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Can I cancel anytime?</p>
                <p className="text-sm text-gray-600">
                  Yes! Cancel anytime with no penalties. You'll keep Pro features until 
                  the end of your billing period.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">What happens to my existing customers?</p>
                <p className="text-sm text-gray-600">
                  Nothing changes! All your existing customers and their stamps are preserved. 
                  You just get the ability to add unlimited new customers.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Do I get a discount for annual billing?</p>
                <p className="text-sm text-gray-600">
                  Not yet, but we're working on it! We'll email you when annual plans become available.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">What payment methods do you accept?</p>
                <p className="text-sm text-gray-600">
                  We accept all major credit cards through Stripe. Your payment information 
                  is secure and never stored on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
