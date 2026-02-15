import Link from 'next/link';

export default function FAQ() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white">
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
              <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-slate-600 mb-12">
          Everything you need to know about StarQR
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Can I cancel anytime?</h2>
            <p className="text-slate-600 leading-relaxed">
              Yes! You can cancel your Pro subscription at any time with one click from the billing page. 
              You'll keep Pro features until the end of your current billing period, and then you'll 
              automatically switch to the free plan.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What happens to my data when I upgrade?</h2>
            <p className="text-slate-600 leading-relaxed">
              All your existing customers and their stamps are preserved when you upgrade to Pro. You simply 
              remove the 25 customer limit and get access to enhanced customer export.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">When should I upgrade from free to Pro?</h2>
            <p className="text-slate-600 leading-relaxed">
              Upgrade when you're approaching 20-25 active customers and need more capacity. The free plan 
              is perfect for testing and early adoption, but Pro gives you unlimited customers and better 
              analytics as your business grows.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Do my customers need to download an app?</h2>
            <p className="text-slate-600 leading-relaxed">
              No! That's the beauty of StarQR. Customers simply scan your QR code with their phone camera 
              (which works on any modern smartphone), enter their phone number, and instantly earn a stamp. 
              No app store visit, no account creation, no friction.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">How secure are customer phone numbers?</h2>
            <p className="text-slate-600 leading-relaxed">
              Very secure. We hash all phone numbers using SHA-256 encryption before storing them. We only 
              keep the last 4 digits in plain text so you can identify customers. Full phone numbers are 
              never stored in our database.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Can customers check in multiple times per day?</h2>
            <p className="text-slate-600 leading-relaxed">
              Customers can only earn one stamp per day to prevent abuse. If they try to check in again 
              the same day, they'll see their current progress but won't earn an additional stamp.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">How do I display my QR code?</h2>
            <p className="text-slate-600 leading-relaxed">
              From your dashboard settings, you can download your QR code as a PNG image or print a 
              formatted page with instructions. We recommend printing it on 8.5" x 11" paper and displaying 
              it near your register or checkout counter.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Can I customize the number of stamps needed?</h2>
            <p className="text-slate-600 leading-relaxed">
              Yes! You can set anywhere from 5 to 20 stamps needed for a reward. Most businesses choose 
              10 stamps (the default), but you can adjust this based on your pricing and customer visit frequency.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What happens when a customer earns a reward?</h2>
            <p className="text-slate-600 leading-relaxed">
              When a customer completes their stamp card, they see a reward screen with your custom message 
              (e.g., "Free Coffee"). They show you this screen, you provide the reward, and their stamp 
              count resets so they can start earning their next reward.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What payment methods do you accept?</h2>
            <p className="text-slate-600 leading-relaxed">
              We accept all major credit cards through Stripe (Visa, Mastercard, American Express, Discover). 
              Your payment information is securely processed by Stripe and never stored on our servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Do you offer discounts for annual billing?</h2>
            <p className="text-slate-600 leading-relaxed">
              Not yet, but we're working on it! We'll email you when annual plans become available with 
              discounted pricing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Can I delete my account?</h2>
            <p className="text-slate-600 leading-relaxed">
              Yes. You can permanently delete your account from the settings page. This will delete all 
              your data including customer stamps and check-in history. This action cannot be undone.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">What kind of support do you offer?</h2>
            <p className="text-slate-600 leading-relaxed">
              Free plan users get email support (we respond within 48 hours). Pro plan users get priority 
              email support (we respond within 24 hours).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Still have questions?</h2>
            <p className="text-slate-600 leading-relaxed">
              Contact us at <a href="mailto:jewell.will@gmail.com" className="text-slate-900 hover:underline font-medium">jewell.will@gmail.com</a> and 
              we'll be happy to help!
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white mt-16">
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
                <li><Link href="/dashboard/upgrade" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link></li>
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