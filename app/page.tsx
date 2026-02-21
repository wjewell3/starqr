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
              <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                FAQ
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
              {/* <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> */}
              {/* QR-based loyalty for local shops */}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Digital Punch Cards
              {/* QR-based Loyalty */}
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
                href="/pricing"
                className="border border-slate-300 px-6 py-3 rounded-lg hover:border-slate-400 transition-colors font-medium inline-flex items-center justify-center"
              >
                View pricing
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              Free for 25 customers · No credit card required
            </p>

            <div className="mt-12 flex flex-col gap-8 justify-center">
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <img
                    src="/images/person-scanning-qr-code-cafeteria.jpg"
                    alt="Person scanning QR code at cafeteria"
                    className="rounded-xl shadow-lg w-full h-auto"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <img
                    src="/images/welcome.jpg"
                    alt="Phone showing StarQR digital punch card with welcome message"
                    className="rounded-xl shadow-lg w-full h-auto"
                  />
                  <p className="text-xs text-center text-slate-500 mt-2">Scan the QR, enter your number — earn stars instantly.</p>
                </div>
              </div>
            </div>
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

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Setup</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create account, customize your reward, print QR code. Launch in 5 minutes.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy QR Scanning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Customers scan your QR code with their phone camera. No app download or account needed — enter a number and earn a stamp instantly.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Stamp-Based Rewards</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Set how many stamps customers need (5-20 visits) and what they earn when they complete their card.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center">
            <blockquote className="text-xl md:text-1xl font-semibold text-slate-900">
              "39% of customers abandon paper loyalty programs because they misplace their cards"
            </blockquote>
            <p className="text-xs text-slate-500 mt-4">
              <a href="https://www.stampme.com/blog/digital-vs-paper-punch-cards" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 underline">
                StampMe
              </a>
            </p>
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mb-8">
            <div className="hidden md:block">
              <div className="text-xl font-semibold text-slate-900 mb-4">StarQR</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Modern loyalty cards for local businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-xs md:text-sm mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-xs md:text-sm text-slate-600 hover:text-slate-900">Pricing</Link></li>
                <li><Link href="/signup" className="text-xs md:text-sm text-slate-600 hover:text-slate-900">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-xs md:text-sm mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-xs md:text-sm text-slate-600 hover:text-slate-900">About</Link></li>
                <li><Link href="/faq" className="text-xs md:text-sm text-slate-600 hover:text-slate-900">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-xs md:text-sm mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-xs md:text-sm text-slate-600 hover:text-slate-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-xs md:text-sm text-slate-600 hover:text-slate-900">Terms</Link></li>
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