'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  
  const [planTier, setPlanTier] = useState<'free' | 'paid'>('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: merchant } = await supabase
        .from('merchants')
        .select('plan_tier, subscription_status, subscription_current_period_end')
        .eq('user_id', user.id)
        .single();

      if (merchant) {
        setPlanTier(merchant.plan_tier);
        setSubscriptionStatus(merchant.subscription_status);
        setCurrentPeriodEnd(merchant.subscription_current_period_end);
      }

      // Get customer count
      const { count } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true })
        .eq('merchant_id', merchant?.id);

      setTotalCustomers(count || 0);
      setLoading(false);
    };

    fetchBillingInfo();
  }, [router]);

  const handleOpenPortal = async () => {
    setPortalLoading(true);

    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to open billing portal');
        setPortalLoading(false);
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal');
      setPortalLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      active: { variant: 'default', label: 'Active' },
      trialing: { variant: 'default', label: 'Trial' },
      paused: { variant: 'secondary', label: 'Paused' },
      canceled: { variant: 'destructive', label: 'Canceled' },
      free: { variant: 'outline', label: 'Free Tier' },
    };

    const config = variants[status] || variants.free;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </div>
            {getStatusBadge(subscriptionStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Plan Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Plan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {planTier === 'paid' ? 'Pro' : 'Free'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {planTier === 'paid' ? '$9/month' : 'Up to 25 customers'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {planTier === 'paid' ? 'Unlimited' : `${25 - totalCustomers} remaining`}
                </p>
              </div>
            </div>

            {/* Subscription Details */}
            {planTier === 'paid' && currentPeriodEnd && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Next billing date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(currentPeriodEnd)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium text-gray-900">$9.00 USD</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {planTier === 'free' ? (
                <Link href="/dashboard/upgrade" className="flex-1">
                  <Button className="w-full" size="lg">
                    Upgrade to Pro
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleOpenPortal}
                  disabled={portalLoading}
                  className="flex-1"
                  size="lg"
                >
                  {portalLoading ? 'Loading...' : 'Manage Subscription'}
                </Button>
              )}
            </div>

            {planTier === 'paid' && (
              <p className="text-xs text-gray-500">
                Manage your payment method, view invoices, and update your subscription 
                in the Stripe billing portal
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      {planTier === 'free' && (
        <Card>
          <CardHeader>
            <CardTitle>Why Upgrade?</CardTitle>
            <CardDescription>Unlock unlimited customers and premium features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Free Tier */}
              <div className="border-2 border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Free</h3>
                  <Badge variant="outline">Current Plan</Badge>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-6">$0</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Up to 25 customers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Stamp cards</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>QR code generation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Basic dashboard</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400">✗</span>
                    <span className="text-gray-500">Unlimited customers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400">✗</span>
                    <span className="text-gray-500">Customer export</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400">✗</span>
                    <span className="text-gray-500">Priority support</span>
                  </li>
                </ul>
              </div>

              {/* Pro Tier */}
              <div className="border-2 border-amber-500 rounded-lg p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                    Recommended
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  $9<span className="text-lg text-gray-600">/month</span>
                </p>
                <p className="text-sm text-gray-600 mb-6">Billed monthly</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span className="font-medium">Unlimited customers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>All free features</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Customer export (CSV)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Free QR sticker</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Early access to new features</span>
                  </li>
                </ul>
                <Link href="/dashboard/upgrade" className="mt-6 block">
                  <Button className="w-full" size="lg">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History (for paid users) */}
      {planTier === 'paid' && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleOpenPortal} disabled={portalLoading} variant="outline">
              View All Invoices
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Access your complete billing history in the Stripe portal
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
