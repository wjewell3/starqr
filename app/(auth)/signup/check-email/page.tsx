import Link from 'next/link';

export default function CheckEmail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold mb-3 text-slate-900">Check your email</h1>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            We've sent you a confirmation email. Click the link in the email to verify your account 
            and complete setup.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-600">
              <strong className="text-slate-900">Didn't receive it?</strong><br />
              Check your spam folder or wait a few minutes and try signing up again.
            </p>
          </div>

          <Link 
            href="/login"
            className="block w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}