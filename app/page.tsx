import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <nav className="border-b border-slate-200/60 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-medium text-slate-900">TapQR</div>
          <div className="flex gap-6 items-center">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link 
              href="/signup"
              className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-2xl">
          <div className="inline-block px-3 py-1 bg-blue-100/60 text-blue-900 text-xs font-medium rounded-full mb-6">
            Digital loyalty for local shops
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 mb-5 leading-tight">
            Customer loyalty without the complexity
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            QR-based stamps that work with a phone camera. No app download, 
            no punch cards. Just fast check-ins and automatic rewards.
          </p>
          <div className="flex gap-3 items-center">
            <Link 
              href="/signup"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-md hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              Start free trial
            </Link>
            <Link 
              href="/dashboard/upgrade"
              className="text-slate-700 hover:text-slate-900 transition-colors font-medium text-sm px-5 py-2.5"
            >
              View pricing →
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-5">
            Free for 25 customers · No card required
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-4"></div>
            <h3 className="font-medium text-base mb-2 text-slate-900">No app required</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Phone camera scans code, customer taps number. Works instantly with any smartphone.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg mb-4"></div>
            <h3 className="font-medium text-base mb-2 text-slate-900">Live in minutes</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate QR code, print it, display at register. Your program launches today.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mb-4"></div>
            <h3 className="font-medium text-base mb-2 text-slate-900">Transparent pricing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Free tier for 25 customers. Scale to unlimited for $9/month. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/60 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="max-w-lg">
            <h2 className="text-2xl font-semibold mb-10 text-slate-900">How it works</h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1.5 text-slate-900">Customer scans QR</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Print code, place on counter. Camera detects and opens instantly.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1.5 text-slate-900">Enter phone number</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Fast entry, hashed storage. Only last 4 digits visible to you.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1.5 text-slate-900">Earn rewards</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Stamps accumulate automatically. Free item after target reached.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5"></div>
          <div className="relative">
            <h2 className="text-3xl font-semibold mb-3">
              Build customer retention that works
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-lg">
              Most loyalty programs fail because they're annoying. TapQR removes all friction.
            </p>
            <Link 
              href="/signup"
              className="inline-block bg-white text-slate-900 px-5 py-2.5 rounded-md hover:bg-slate-100 transition-colors font-medium text-sm"
            >
              Get started free
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 py-10 flex justify-between items-center text-xs text-slate-500">
          <div>© 2026 TapQR</div>
          <div className="flex gap-6">
            <Link href="/dashboard/upgrade" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}