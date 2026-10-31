// One place for the Content-Security-Policy. Used by next.config.mjs (static pages) and proxy.ts (admin, with a nonce).
const isDev = process.env.NODE_ENV === 'development'

/**
 * @param {string} [nonce] When given (admin pages), only scripts carrying this nonce may run.
 *   Without it (public pages, which are pre-built and cached), inline scripts from our own pages are allowed.
 */
export function buildCsp(nonce) {
  const scripts = nonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`
    : `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`
  return [
    "default-src 'self'",
    scripts,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.mapbox.com",
    "font-src 'self' data:",
    `connect-src 'self' https://*.mapbox.com https://events.mapbox.com${isDev ? ' ws: wss:' : ''}`,
    "worker-src 'self' blob:",
    'child-src blob:',
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ')
}
