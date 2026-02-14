'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Merchant data
  const [merchantId, setMerchantId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<'coffee' | 'ice_cream' | 'bagel' | 'other'>('coffee');
  const [rewardText, setRewardText] = useState('');
  const [stampsNeeded, setStampsNeeded] = useState(10);

  useEffect(() => {
    const fetchMerchant = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: merchant, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !merchant) {
        console.error('Failed to fetch merchant:', error);
        setLoading(false);
        return;
      }

      setMerchantId(merchant.id);
      setBusinessName(merchant.business_name);
      setBusinessType(merchant.business_type || 'coffee');
      setRewardText(merchant.reward_text);
      setStampsNeeded(merchant.stamps_needed);
      setLoading(false);
    };

    fetchMerchant();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    const supabase = createClient();

    const { error } = await supabase
      .from('merchants')
      .update({
        business_name: businessName.trim(),
        business_type: businessType,
        reward_text: rewardText.trim(),
        stamps_needed: stampsNeeded,
      })
      .eq('id', merchantId);

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }

    setMessage({ type: 'success', text: 'Settings saved successfully!' });
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your business information and loyalty program</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Settings Form */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your business details and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Business Name */}
              <div>
                <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <Input
                  id="business-name"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Business Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'coffee', label: 'Coffee Shop', emoji: '☕' },
                    { value: 'ice_cream', label: 'Ice Cream', emoji: '🍦' },
                    { value: 'bagel', label: 'Bagel Shop', emoji: '🥯' },
                    { value: 'other', label: 'Other', emoji: '🏪' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setBusinessType(type.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        businessType === type.value
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-300 bg-white hover:border-amber-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.emoji}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reward Text */}
              <div>
                <label htmlFor="reward-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Reward Text
                </label>
                <Input
                  id="reward-text"
                  type="text"
                  value={rewardText}
                  onChange={(e) => setRewardText(e.target.value)}
                  required
                  maxLength={50}
                  placeholder="Free Coffee"
                />
                <p className="text-xs text-gray-500 mt-1">
                  What customers get when they complete their card
                </p>
              </div>

              {/* Stamps Needed */}
              <div>
                <label htmlFor="stamps-needed" className="block text-sm font-medium text-gray-700 mb-2">
                  Stamps Needed
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="stamps-needed"
                    type="number"
                    min={5}
                    max={20}
                    value={stampsNeeded}
                    onChange={(e) => setStampsNeeded(parseInt(e.target.value))}
                    required
                    className="w-24"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min={5}
                      max={20}
                      value={stampsNeeded}
                      onChange={(e) => setStampsNeeded(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Number of visits before customers earn a reward (5-20)
                </p>
              </div>

              {/* Warning about changing stamps */}
              {stampsNeeded !== 10 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Note:</strong> Changing this only affects new customers. 
                    Existing customers keep their current stamp requirements.
                  </p>
                </div>
              )}

              {/* Message */}
              {message && (
                <div
                  className={`rounded-lg p-3 ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Save Button */}
              <Button type="submit" disabled={saving} className="w-full" size="lg">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        {merchantId && (
          <QRCodeDisplay merchantId={merchantId} businessName={businessName} />
        )}
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all customer data
                </p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                Delete
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Contact support to delete your account
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
