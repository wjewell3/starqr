'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateUniqueSlug } from '@/lib/slug';

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [merchantId, setMerchantId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [businessType, setBusinessType] = useState<'coffee' | 'ice_cream' | 'bagel' | 'other'>('coffee');
  const [rewardText, setRewardText] = useState('');
  const [stampsNeeded, setStampsNeeded] = useState(10);
  const [qr, setQr] = useState('');

  useEffect(() => {
    const init = async () => {
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
      const merchantSlug = generateUniqueSlug(merchant.business_name, merchant.id);
      setSlug(merchantSlug);
      setBusinessType(merchant.business_type || 'coffee');
      setRewardText(merchant.reward_text);
      setStampsNeeded(merchant.stamps_needed);
      
      const QRCode = (await import('qrcode')).default;
      const url = `${window.location.origin}/c/${merchantSlug}`;
      const code = await QRCode.toDataURL(url, { width: 400, margin: 2 });
      setQr(code);
      
      setLoading(false);
    };

    init();
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

    setMessage({ type: 'success', text: 'Settings saved' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async () => {
    const confirmText = 'DELETE';
    const userInput = prompt(
      `This will permanently delete your account and all customer data.\n\nType "${confirmText}" to confirm:`
    );

    if (userInput !== confirmText) {
      return;
    }

    setDeleting(true);

    try {
      const supabase = createClient();
      
      // Delete all related data first (customers will cascade check_ins and rewards)
      const { error: customersError } = await supabase
        .from('customers')
        .delete()
        .eq('merchant_id', merchantId);

      if (customersError) {
        console.error('Customers delete error:', customersError);
      }

      // Delete merchant
      const { error: merchantError } = await supabase
        .from('merchants')
        .delete()
        .eq('id', merchantId);

      if (merchantError) {
        console.error('Merchant delete error:', merchantError);
        alert('Failed to delete account. Please contact support.');
        setDeleting(false);
        return;
      }

      // Call server-side account delete which cancels Stripe and removes DB + auth
      const deleteUserResponse = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (!deleteUserResponse.ok) {
        console.error('Account delete failed');
        alert('Failed to delete account. Please contact support.');
        setDeleting(false);
        return;
      }

      // Sign out
      await supabase.auth.signOut();
      
      // Force redirect
      window.location.href = '/?deleted=true';
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete account. Please contact support.');
      setDeleting(false);
    }
  };

  const downloadQR = () => {
    if (!qr) return;
    const link = document.createElement('a');
    link.download = `${businessName.replace(/\s+/g, '-')}-qr-code.png`;
    link.href = qr;
    link.click();
  };

  const printQR = () => {
    if (!qr) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${businessName} - QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-family: system-ui, sans-serif;
            }
            h1 { margin-bottom: 10px; text-align: center; font-size: 32px; }
            h2 { margin-bottom: 30px; text-align: center; font-size: 20px; color: #666; }
            img { max-width: 400px; width: 100%; }
            .instructions { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${businessName}</h1>
          <h2>Scan to earn rewards</h2>
          <img src="${qr}" alt="QR Code" />
          <div class="instructions">
            <p><strong>How it works:</strong></p>
            <p>Scan with phone camera • Enter number • Earn stamps</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="text-slate-400 text-sm">Loading...</div>
    );
  }

  const typeOptions = [
    { 
      value: 'coffee', 
      label: 'Coffee Shop',
      emoji: '☕'
    },
    { 
      value: 'ice_cream', 
      label: 'Ice Cream',
      emoji: '🍦'
    },
    { 
      value: 'bagel', 
      label: 'Bakery',
      emoji: '🥯'
    },
    { 
      value: 'other', 
      label: 'Other',
      emoji: '🏪'
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-slate-900">Settings</h1>
        <p className="text-slate-600 text-sm">Manage your loyalty program</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
          <h2 className="font-semibold text-lg mb-6 text-slate-900">Business Information</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Business name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Business type</label>
              <div className="grid grid-cols-2 gap-2.5">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBusinessType(opt.value)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      businessType === opt.value
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-1">{opt.emoji}</div>
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
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                required
                maxLength={50}
              />
              <p className="text-xs text-slate-500 mt-1.5">What customers earn</p>
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
              <p className="text-xs text-slate-500 mt-1.5">Visits needed for reward</p>
            </div>

            {message && (
              <div className={`text-xs px-3 py-2 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-slate-900 text-white py-2.5 text-sm rounded-md hover:bg-slate-800 disabled:opacity-60 transition-colors font-medium"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200">
          <h2 className="font-semibold text-lg mb-6 text-slate-900">QR Code</h2>
          
          {qr && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-slate-200 flex justify-center">
                <img src={qr} alt="QR Code" className="w-64 h-64" />
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-600 mb-2 font-medium">Check-in URL:</p>
                <code className="text-xs bg-white px-3 py-2 rounded block overflow-x-auto border border-slate-200">
                  {window.location.origin}/c/{slug}
                </code>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 border border-slate-300 px-4 py-2.5 text-sm rounded-md hover:border-slate-400 transition-colors font-medium"
                >
                  Download
                </button>
                <button
                  onClick={printQR}
                  className="flex-1 border border-slate-300 px-4 py-2.5 text-sm rounded-md hover:border-slate-400 transition-colors font-medium"
                >
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
        <h2 className="font-semibold text-lg mb-2 text-red-900">Delete Account</h2>
        <p className="text-sm text-red-700 mb-4">
          Permanently delete your account and all customer data. This cannot be undone.
        </p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 text-white px-4 py-2 text-sm rounded-md hover:bg-red-700 disabled:opacity-60 transition-colors font-medium"
        >
          {deleting ? 'Deleting...' : 'Delete account permanently'}
        </button>
      </div>
    </div>
  );
}