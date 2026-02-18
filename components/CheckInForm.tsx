'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CheckInFormProps {
  merchantId: string;
  onSuccess: (data: {
    success: boolean;
    stamps_current: number;
    stamps_needed: number;
    redeemed: boolean;
    reward_text: string;
    token: string;
    customer_id: string;
  }) => void;
}

export function CheckInForm({ merchantId, onSuccess }: CheckInFormProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, phone: cleaned }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.upgradeRequired) {
          setError('This shop has reached its customer limit. Ask them to upgrade for unlimited customers!');
        } else if (data.nextCheckInAt) {
          setError(`You've already checked in today! Come back in ${Math.ceil((new Date(data.nextCheckInAt).getTime() - Date.now()) / (1000 * 60 * 60))} hours.`);
        } else {
          setError(data.error || 'Check-in failed');
        }
        setLoading(false);
        return;
      }

      // Store token for future auto-check-ins
      if (data.token) {
        localStorage.setItem(`starqr_token_${merchantId}`, data.token);
        localStorage.setItem(`starqr_customer_${merchantId}`, data.customer_id);
      }

      onSuccess(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your phone number
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="(423) 123-4567"
          value={phone}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          className="text-lg text-center"
          autoFocus
        />
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
          {error}
        </div>
      )}
      
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Checking in...' : '☕ Get Stamp'}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        Your phone number is private and only used for your loyalty card
      </p>
    </form>
  );
}
