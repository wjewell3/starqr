import Link from 'next/link';

export default function Terms() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-12">Last updated: February 15, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using StarQR ("Service"), you agree to be bound by these Terms of Service 
              ("Terms"). If you do not agree to these Terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Description of Service</h2>
            <p className="text-slate-600 leading-relaxed">
              StarQR provides a digital loyalty card platform that allows businesses to create QR-based 
              stamp programs for their customers. The Service includes QR code generation, customer check-in 
              tracking, reward management, and basic analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Registration</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To use the Service, you must:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Subscription Plans</h2>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2 mt-4">Free Plan</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Limited to 25 active customers</li>
              <li>Access to core loyalty features</li>
              <li>No credit card required</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 mb-2 mt-4">Pro Plan ($9/month)</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Unlimited customers</li>
              <li>Advanced features and analytics</li>
              <li>Priority support</li>
              <li>Billed monthly via Stripe</li>
              <li>Cancel anytime with no penalty</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Terms</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>All payments are processed securely through Stripe</li>
              <li>Subscriptions auto-renew monthly unless canceled</li>
              <li>No refunds for partial months</li>
              <li>Prices subject to change with 30 days notice</li>
              <li>Failed payments may result in service suspension</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Acceptable Use</h2>
            <p className="text-slate-600 leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Create multiple accounts to circumvent plan limits</li>
              <li>Resell or redistribute the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Customer Data</h2>
            <p className="text-slate-600 leading-relaxed">
              As a business owner using StarQR, you are responsible for:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
              <li>Obtaining necessary consents from your customers</li>
              <li>Complying with applicable privacy laws</li>
              <li>Using customer data only for loyalty program purposes</li>
              <li>Informing customers about your loyalty program</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              We encrypt customer phone numbers and only store the last 4 digits in plain text. 
              See our Privacy Policy for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              The Service, including its software, design, and content, is owned by StarQR and protected 
              by copyright, trademark, and other intellectual property laws. You may not copy, modify, 
              distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Availability</h2>
            <p className="text-slate-600 leading-relaxed">
              We strive for 99.9% uptime but do not guarantee uninterrupted access. We may suspend 
              the Service for maintenance, updates, or other reasons. We are not liable for any 
              loss resulting from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Termination</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may terminate or suspend your account:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>For violation of these Terms</li>
              <li>For fraudulent or illegal activity</li>
              <li>For non-payment of fees</li>
              <li>At our discretion with reasonable notice</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              You may cancel your account at any time from the settings page. Upon cancellation, 
              all your data will be permanently deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Disclaimer of Warranties</h2>
            <p className="text-slate-600 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, STARQR SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, 
              OR BUSINESS OPPORTUNITIES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID 
              IN THE PAST 12 MONTHS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Indemnification</h2>
            <p className="text-slate-600 leading-relaxed">
              You agree to indemnify and hold StarQR harmless from any claims, damages, or expenses 
              arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update these Terms at any time. We will notify you of significant changes by 
              email or through the Service. Your continued use after changes constitutes acceptance 
              of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms are governed by the laws of Tennessee, United States, without regard to 
              conflict of law principles. Any disputes shall be resolved in the courts of Hamilton 
              County, Tennessee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              For questions about these Terms, contact us at:
            </p>
            <p className="text-slate-600 mt-4">
              <strong>Email:</strong> jewell.will@gmail.com<br />
              <strong>Address:</strong> Chattanooga, TN 37404
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Entire Agreement</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between 
              you and StarQR regarding the Service.
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