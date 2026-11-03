import { buildCsp } from './lib/csp.mjs'

/** Pages that are built ahead of time and served from the CDN. They get the static policy below. */
const PUBLIC_PAGES = ['/', '/about', '/contact', '/faq', '/services', '/services/:slug', '/service-comparison', '/track', '/privacy-policy', '/terms-and-conditions']

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Resize and compress every image for the visitor's screen (much lighter on phones).
    formats: ['image/webp'],
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 224, 448],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // The admin panel (dynamic) gets a per-request nonce policy from proxy.ts instead.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
          },
        ],
      },
      ...PUBLIC_PAGES.map((source) => ({ source, headers: [{ key: 'Content-Security-Policy', value: buildCsp() }] })),
    ]
  },
}

export default nextConfig
