'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<'coffee' | 'ice_cream' | 'bagel' | 'other'>('coffee');
  const [rewardText, setRewardText] = useState('Free Coffee');
  const [stampsNeeded, setStampsNeeded] = useState(10);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (merchant) {
        router.push('/dashboard');
      }
    };

    init();
  }, [router]);

  const typeOptions = [
    { value: 'coffee', label: 'Coffee', color: 'from-amber-500 to-orange-500', reward: 'Free Coffee' },
    { value: 'ice_cream', label: 'Ice Cream', color: 'from-pink-500 to-rose-500', reward: 'Free Ice Cream' },
    { value: 'bagel', label: 'Bagel', color: 'from-yellow-500 to-amber-500', reward: 'Free Bagel' },
    { value: 'other', label: 'Other', color: 'from-slate-500 to-slate-600', reward: 'Free Item' },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !businessName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    const supabase = createClient();

    const { error: merchantError } = await supabase
      .from('merchants')
      .insert({
        user_id: userId,
        business_name: businessName.trim(),
        business_type: businessType,
        reward_text: rewardText.trim(),
        stamps_needed: stampsNeeded,
        plan_tier: 'free',
        subscription_status: 'free',
      });

    if (merchantError) {
      setError(merchantError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold mb-1.5 text-slate-900">Set up your program</h1>
          <p className="text-sm text-slate-600">Configure your loyalty rewards</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Business name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Joe's Coffee"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setBusinessType(opt.value);
                      setRewardText(opt.reward);
                    }}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      businessType === opt.value
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${opt.color} rounded-md mb-2`}></div>
                    <div className="text-xs font-medium text-slate-900">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Reward</label>
              <input
                type="text"
                value={rewardText}
                onChange={(e) => setRewardText(e.target.value)}
                placeholder="Free Coffee"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                required
                maxLength={50}
              />
              <p className="text-xs text-slate-500 mt-1.5">
                What customers earn after completing their card
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">
                Stamps required: {stampsNeeded}
              </label>
              <input
                type="range"
                min={5}
                max={20}
                value={stampsNeeded}
                onChange={(e) => setStampsNeeded(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Number of visits before reward
              </p>
            </div>

            {error && (
              <div className="text-xs text-red-700 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 text-sm rounded-md hover:bg-slate-800 disabled:opacity-60 transition-colors font-medium"
            >
              {loading ? 'Creating...' : 'Continue to dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
