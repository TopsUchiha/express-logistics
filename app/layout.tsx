import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.company.name} | Global Logistics & Freight Forwarding`,
    template: `%s | ${siteConfig.company.name}`,
  },
  description: siteConfig.company.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.company.name,
    title: `${siteConfig.company.name} | Global Logistics & Freight Forwarding`,
    description: siteConfig.company.description,
    images: [{ url: '/images/hero-port.jpg', width: 1376, height: 768, alt: 'Container port terminal' }],
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0B1A2B',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="min-h-dvh antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
