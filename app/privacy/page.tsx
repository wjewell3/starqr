import Link from 'next/link';

export default function Privacy() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold text-slate-900">
              StarQR
            </Link>
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
              ← Back to home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-12">Last updated: February 15, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              StarQR ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our 
              digital loyalty card service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2 mt-4">Business Owner Information</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Email address (for account creation and login)</li>
              <li>Business name and type</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 mb-2 mt-4">Customer Information</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Phone numbers (encrypted with SHA-256 hashing)</li>
              <li>Last 4 digits of phone number (stored for identification)</li>
              <li>Check-in timestamps and stamp counts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Provide and maintain our loyalty card service</li>
              <li>Process transactions and send billing-related emails</li>
              <li>Track customer stamps and reward redemptions</li>
              <li>Generate analytics for business owners</li>
              <li>Communicate with you about your account</li>
              <li>Improve and optimize our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We take data security seriously:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Phone Number Encryption:</strong> All customer phone numbers are hashed using SHA-256 
              with the merchant ID as a salt. We only store the last 4 digits in plain text.</li>
              <li><strong>Secure Infrastructure:</strong> Our data is hosted on Supabase with row-level security 
              enabled on all database tables.</li>
              <li><strong>Payment Security:</strong> All payment information is processed through Stripe and never 
              stored on our servers.</li>
              <li><strong>HTTPS:</strong> All data transmission is encrypted using industry-standard SSL/TLS.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Service Providers:</strong> We use Supabase for hosting and Stripe for payment processing. 
              These providers have access to data only to perform their services.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response 
              to valid legal processes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your data (Pro plan feature)</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@starqr.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
            <p className="text-slate-600 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services. 
              When you delete your account, we permanently delete all associated data including customer stamps 
              and check-in history within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies and Tracking</h2>
            <p className="text-slate-600 leading-relaxed">
              We use essential cookies to maintain your login session. We do not use tracking cookies or 
              third-party analytics tools beyond basic server logs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Our service is not directed to individuals under 18. We do not knowingly collect information 
              from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes 
              by email or through a notice on our website. Your continued use of our service after changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-slate-600 mt-4">
              <strong>Email:</strong> jewell.will@gmail.com<br />
              <strong>Address:</strong> Chattanooga, TN 37404
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              © 2026 StarQR. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}