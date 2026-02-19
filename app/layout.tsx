import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StarQR Loyalty - Simple QR-Based Loyalty Cards',
  description: 'QR-based loyalty system for coffee shops, ice cream shops, and bagel shops',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script 
              strategy="afterInteractive"
              async 
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script 
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
