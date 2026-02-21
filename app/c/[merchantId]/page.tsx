'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface CheckInData {
  stamps_current: number;
  stamps_needed: number;
  redeemed: boolean;
  reward_text: string;
  business_name: string;
  isFirstSignup: boolean;
  wallet_config?: {
    logo_url?: string;
    stamp_bg_color?: string;
    stamp_text_color?: string;
  };
}

export default function CheckIn() {
  const params = useParams();
  const slug = params.merchantId as string;
  const [merchantId, setMerchantId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<CheckInData | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Lookup merchant ID from slug on mount
  useEffect(() => {
    const lookupMerchant = async () => {
      try {
        const res = await fetch(`/api/merchant/lookup?slug=${encodeURIComponent(slug)}`);
        const result = await res.json();

        if (!res.ok || !result.id) {
          setLookupError('Business not found');
          return;
        }

        setMerchantId(result.id);
        setBusinessName(result.business_name);
      } catch (err) {
        console.error('Lookup failed:', err);
        setLookupError('Failed to load business info');
      }
    };

    // Also fetch current auth session if available
    const getAuthSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.access_token) {
          setAuthToken(session.access_token);
        }
      } catch (e) {
        console.warn('Failed to fetch auth session:', e);
      }
    };

    lookupMerchant();
    getAuthSession();
  }, [slug]);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!merchantId) {
      setError('Business info not loaded yet');
      return;
    }
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length !== 10) {
      setError('Enter a valid phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, phone: cleaned, token: authToken }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Check-in failed');
        setLoading(false);
        return;
      }

      if (result.token) {
        localStorage.setItem(`starqr_token_${merchantId}`, result.token);
      }

      setData(result);
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  if (data) {
    const progress = (data.stamps_current / data.stamps_needed) * 100;
    const bgColor = data.wallet_config?.stamp_bg_color || '#1E40AF';
    const textColor = data.wallet_config?.stamp_text_color || '#FFFFFF';
    
    // Show welcome screen for first signup
    if (data.isFirstSignup && !data.redeemed) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 bg-cover bg-center bg-no-repeat relative overflow-hidden"
              style={{
                backgroundImage: data.wallet_config?.logo_url ? `url('${data.wallet_config.logo_url}')` : 'none',
                backgroundColor: data.wallet_config?.logo_url ? 'rgba(0, 0, 0, 0.4)' : '#ffffff'
              }}
            >
              {data.wallet_config?.logo_url && (
                <div className="absolute inset-0 bg-black/40" />
              )}
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2 text-white drop-shadow-lg">Welcome to {data.business_name}!</h2>
                  <p className="text-white/90 mb-6 drop-shadow">
                    Thanks for signing up. You've earned 2 bonus stars to get you started.
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2.5 text-white/90">
                    <span className="font-medium">{data.stamps_current} stars</span>
                    <span>{data.stamps_needed - data.stamps_current} remaining</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: bgColor 
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-6">
                  {Array.from({ length: data.stamps_needed }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center transition-all duration-300"
                    >
                      {i < data.stamps_current ? (
                        <svg className="w-16 h-16" fill="white" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ) : (
                        <svg className="w-16 h-16" fill="rgba(255, 255, 255, 0.3)" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setData(null)}
                  className="w-full bg-slate-900 text-white py-2.5 text-sm rounded-md hover:bg-slate-800 transition-colors font-medium"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {data.redeemed ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-slate-900">Reward earned</h2>
              <p className="text-slate-600 mb-6">
                {data.reward_text}
              </p>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs text-slate-600 font-medium">Show this screen to redeem</p>
              </div>
            </div>
          ) : (
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 bg-cover bg-center bg-no-repeat relative overflow-hidden"
              style={{
                backgroundImage: data.wallet_config?.logo_url ? `url('${data.wallet_config.logo_url}')` : 'none',
                backgroundColor: data.wallet_config?.logo_url ? 'rgba(0, 0, 0, 0.4)' : '#f8fafc'
              }}
            >
              {data.wallet_config?.logo_url && (
                <div className="absolute inset-0 bg-black/40" />
              )}
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-6 text-white text-center drop-shadow-lg">{data.business_name}</h3>
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-2.5 text-white/90">
                  <span className="font-medium">{data.stamps_current} stars</span>
                  <span>{data.stamps_needed - data.stamps_current} remaining</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: bgColor 
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-6">
                {Array.from({ length: data.stamps_needed }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center transition-all duration-300"
                  >
                    {i < data.stamps_current ? (
                      <svg className="w-16 h-16" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ) : (
                      <svg className="w-16 h-16" fill="rgba(255, 255, 255, 0.3)" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setData(null)}
                className="text-xs text-white/80 hover:text-white transition-colors"
              >
                Done
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {lookupError ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 text-center">
            <h1 className="text-2xl font-semibold mb-2 text-slate-900">Business not found</h1>
            <p className="text-sm text-slate-600">{lookupError}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold mb-1.5 text-slate-900">Check in at {businessName || 'this business'}</h1>
              <p className="text-sm text-slate-600">Enter your number to earn a stamp</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
              <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="tel"
              placeholder="(423) 123-4567"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className="w-full px-4 py-3 text-sm text-center border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
              autoFocus
            />

            {error && (
              <div className="text-xs text-red-700 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !merchantId}
              className="w-full bg-slate-900 text-white py-2.5 text-sm rounded-md hover:bg-slate-800 disabled:opacity-60 transition-colors font-medium"
            >
              {loading ? 'Checking in...' : !merchantId ? 'Loading...' : 'Continue'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-4">
            Number is encrypted and private
          </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
