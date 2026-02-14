'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: merchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', data.user.id)
      .single();

    router.push(merchant ? '/dashboard' : '/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-block mb-10">
          <div className="font-medium text-slate-900">TapQR</div>
        </Link>

        <h1 className="text-2xl font-semibold mb-1.5 text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-600 mb-7">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium mb-1.5 text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium mb-1.5 text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-xs text-red-700 bg-red-50 px-3 py-2 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 text-sm rounded-md hover:bg-slate-800 disabled:opacity-60 transition-colors font-medium"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">New to TapQR? </span>
          <Link href="/signup" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
