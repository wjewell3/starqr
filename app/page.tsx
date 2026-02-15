import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold text-slate-900">
              StarQR
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link href="/dashboard/upgrade" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link 
                href="/signup"
                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              QR-based loyalty for local shops
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Digital Loyalty Cards<br />That Customers Love
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Replace paper punch cards with modern QR stamps. Increase repeat visits 
              and build lasting customer relationships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium inline-flex items-center justify-center"
              >
                Get started free
              </Link>
              <Link 
                href="/dashboard/upgrade"
                className="border border-slate-300 px-6 py-3 rounded-lg hover:border-slate-400 transition-colors font-medium inline-flex items-center justify-center"
              >
                View pricing
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              Free for 25 customers · No credit card required
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple Digital Loyalty
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to reward repeat customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy QR Scanning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Customers scan your QR code with their phone camera. Enter their number and earn a stamp instantly.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Stamp-Based Rewards</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Set how many stamps customers need (5-20 visits) and what they earn when they complete their card.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Track Your Progress</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                See how many customers you have, monthly check-ins, and rewards redeemed from your dashboard.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy Protected</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Phone numbers are encrypted with SHA-256. You only see the last 4 digits for identification.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No App Download</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Works with any smartphone camera. No app store visit, no account creation, no friction.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Setup</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create account, customize your reward, print QR code. Launch in under 5 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Build Customer Loyalty?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Start rewarding your customers today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium inline-flex items-center justify-center"
            >
              Get started free
            </Link>
            <Link 
              href="/about"
              className="border border-slate-300 px-6 py-3 rounded-lg hover:border-slate-400 transition-colors font-medium inline-flex items-center justify-center"
            >
              Learn more about us
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-semibold text-slate-900 mb-4">StarQR</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Modern loyalty cards for local businesses. Build lasting customer relationships.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/upgrade" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link></li>
                <li><Link href="/signup" className="text-sm text-slate-600 hover:text-slate-900">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8">
            <p className="text-sm text-slate-500 text-center">
              © 2026 StarQR. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}