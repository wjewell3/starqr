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
  const [walletConfig, setWalletConfig] = useState<{ logo_url?: string; stamp_bg_color?: string; stamp_text_color?: string }>({});
  const [uploading, setUploading] = useState(false);

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
      setWalletConfig(merchant.wallet_config || {});
      
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
        wallet_config: walletConfig,
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    // Compress image before converting to data URL
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Resize if image is too large (max 400px)
      if (width > 400 || height > 400) {
        const scale = Math.min(400 / width, 400 / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setUploading(false);
        setMessage({ type: 'error', text: 'Failed to process image' });
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to JPEG with compression
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      
      // Validate size (max 300KB for data URLs)
      if (dataUrl.length > 300000) {
        setUploading(false);
        setMessage({ type: 'error', text: 'Logo image is too large after compression (max 300KB)' });
        return;
      }

      const newWalletConfig = {
        ...walletConfig,
        logo_url: dataUrl,
      };

      setWalletConfig(newWalletConfig);

      // Immediately save to database
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('merchants')
        .update({
          wallet_config: newWalletConfig,
        })
        .eq('id', merchantId);

      setUploading(false);

      if (updateError) {
        setMessage({ type: 'error', text: `Failed to save logo: ${updateError.message}` });
        console.error('Database update error:', updateError);
        return;
      }

      setMessage({ type: 'success', text: 'Logo uploaded successfully' });
    };

    img.onerror = () => {
      setUploading(false);
      setMessage({ type: 'error', text: 'Failed to load image' });
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      img.src = src;
    };

    reader.onerror = () => {
      setUploading(false);
      setMessage({ type: 'error', text: 'Failed to read logo file' });
    };

    reader.readAsDataURL(file);
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
          <h2 className="font-semibold text-lg mb-2 text-slate-900">Stamp Card Design</h2>
          <p className="text-xs text-slate-600 mb-6">Customize how your stamp card looks. Click "Save changes" at the bottom to apply.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Logo</label>
              <div className="flex gap-4 items-start">
                {walletConfig.logo_url && (
                  <div className="w-20 h-20 bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={walletConfig.logo_url} 
                      alt="Business logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="text-sm text-slate-600 cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">PNG or JPG, max 500KB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Stamp Background Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={walletConfig.stamp_bg_color || '#1E40AF'}
                  onChange={(e) => setWalletConfig({ ...walletConfig, stamp_bg_color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-slate-300"
                />
                <code className="text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  {walletConfig.stamp_bg_color || '#1E40AF'}
                </code>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 text-slate-700">Stamp Text Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={walletConfig.stamp_text_color || '#FFFFFF'}
                  onChange={(e) => setWalletConfig({ ...walletConfig, stamp_text_color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border border-slate-300"
                />
                <code className="text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  {walletConfig.stamp_text_color || '#FFFFFF'}
                </code>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-xs font-medium mb-4 text-slate-700">Preview</h3>
              <div 
                className="bg-slate-50 rounded-lg p-4 border border-slate-200 bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-72"
                style={{
                  backgroundImage: walletConfig.logo_url ? `url('${walletConfig.logo_url}')` : 'none',
                  backgroundColor: walletConfig.logo_url ? 'rgba(0, 0, 0, 0.4)' : '#f1f5f9'
                }}
              >
                {walletConfig.logo_url && (
                  <div className="absolute inset-0 bg-black/40" />
                )}
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-white drop-shadow">{businessName}</p>
                  </div>
                  <div className="flex justify-between text-xs mb-2.5 text-white/90">
                    <span className="font-medium">3 stamps</span>
                    <span>{stampsNeeded - 3} remaining</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(3 / stampsNeeded) * 100}%`,
                        backgroundColor: walletConfig.stamp_bg_color || '#1E40AF'
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: stampsNeeded }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center"
                      >
                        {i < 3 ? (
                          <svg className="w-14 h-14" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : (
                          <svg className="w-14 h-14" fill="rgba(255, 255, 255, 0.3)" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-slate-900 text-white py-2.5 text-sm rounded-md hover:bg-slate-800 disabled:opacity-60 transition-colors font-medium mt-6"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
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