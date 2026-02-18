import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold text-slate-900">
              StarQR
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-sm text-slate-900 font-medium">
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

      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Helping Local Businesses Thrive
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We believe every business, no matter how small, deserves access to powerful 
            tools that help them build lasting customer relationships.
          </p>
        </div>
      </section>

      {/* Stats section - commented out until you have real data */}
      {/*
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">[YEAR]</div>
              <div className="text-sm text-slate-600">Founded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">[NUMBER]</div>
              <div className="text-sm text-slate-600">Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">[NUMBER]</div>
              <div className="text-sm text-slate-600">Loyalty cards</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">[NUMBER]</div>
              <div className="text-sm text-slate-600">Stamps given</div>
            </div>
          </div>
        </div>
      </section>
      */}

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Story</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              StarQR was born in Chattanooga, Tennessee from a simple observation: paper punch cards 
              from local coffee, ice cream, and bagel shops were getting lost, damaged, or forgotten at home.
            </p>

            <p>
              Business owners shared the same frustration. They couldn't track their loyal customers. 
              Existing digital solutions were either too complicated or priced for large chains 
              with big budgets — leaving small businesses behind.
            </p>

            <p>
              We set out to change that. StarQR is the loyalty platform we wished existed: powerful 
              enough for any business, simple enough for anyone to use, and affordable enough for a 
              single-location cafe.
            </p>

            <p>
              Today, we're helping local businesses across the US build the kind of customer loyalty 
              that was once only possible for big brands. From the coffee shops and bakeries of Chattanooga 
              to businesses nationwide, we're making digital loyalty accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Our Values</h2>
          <p className="text-lg text-slate-600 text-center mb-16">
            The principles that guide everything we do
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Customer First</h3>
              <p className="text-slate-600 leading-relaxed">
                Every feature we build starts with a simple question: will this help businesses 
                serve their customers better?
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Simplicity</h3>
              <p className="text-slate-600 leading-relaxed">
                Powerful doesn't mean complicated. We believe the best tools are the ones that 
                get out of your way.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Community</h3>
              <p className="text-slate-600 leading-relaxed">
                We're building more than software. We're building a community of successful 
                local businesses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Results Driven</h3>
              <p className="text-slate-600 leading-relaxed">
                We measure our success by your success. If you're not growing, we're not 
                doing our job.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join local businesses using StarQR to build lasting customer relationships
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium inline-flex items-center justify-center"
            >
              Start your free trial
            </Link>
            <Link 
              href="/"
              className="border border-slate-300 px-6 py-3 rounded-lg hover:border-slate-400 transition-colors font-medium inline-flex items-center justify-center"
            >
              Back to home
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
                Modern loyalty cards for local businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link></li>
                <li><Link href="/signup" className="text-sm text-slate-600 hover:text-slate-900">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">About</Link></li>
                <li><Link href="/faq" className="text-sm text-slate-600 hover:text-slate-900">FAQ</Link></li>
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