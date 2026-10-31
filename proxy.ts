import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_BASE, ADMIN_COOKIE } from '@/lib/admin-path'
import { buildCsp } from '@/lib/csp.mjs'

if (process.env.NODE_ENV === 'development') {
  console.log(ADMIN_BASE ? `[admin] panel is at ${ADMIN_BASE}` : '[admin] panel is OFF: ADMIN_PATH is missing or invalid (use 8+ characters: letters, digits, - _ /)')
}

/**
 * Runs only for the admin path and for unknown URLs (see the matcher below).
 * 1. Serves the admin panel only at the secret ADMIN_PATH, with a strict per-request nonce policy.
 *    The real /admin routes return 404, and so does everything under the secret path unless the request
 *    carries an admin session cookie (no redirects).
 * 2. Everything else it sees (unknown URLs) gets the plain 404 page and the same static policy as public pages.
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-admin')

  const { pathname } = request.nextUrl
  let response: NextResponse
  if (ADMIN_BASE && (pathname === ADMIN_BASE || pathname.startsWith(ADMIN_BASE + '/'))) {
    const rest = pathname.slice(ADMIN_BASE.length)
    if (rest === '' || rest === '/' || request.cookies.has(ADMIN_COOKIE)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin' + (rest === '/' ? '' : rest)
      // Admin pages are rendered per request, so they get the strict policy with a fresh nonce.
      const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
      requestHeaders.set('x-nonce', nonce)
      requestHeaders.set('Content-Security-Policy', buildCsp(nonce))
      response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
      response.headers.set('X-Robots-Tag', 'noindex, nofollow')
      response.headers.set('Cache-Control', 'no-store')
    } else {
      const url = request.nextUrl.clone()
      url.pathname = '/not-found-404'
      response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    }
  } else if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/not-found-404'
    response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  } else {
    response = NextResponse.next({ request: { headers: requestHeaders } })
  }
  response.headers.set('Content-Security-Policy', requestHeaders.get('Content-Security-Policy') ?? buildCsp())
  return response
}

export const config = {
  // Public pages, images and the API skip the proxy: they are served straight from the CDN with no function call.
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|icon|apple-icon|images/|about$|contact$|faq$|services|service-comparison$|track$|privacy-policy$|terms-and-conditions$).+)'],
}
