import { createHash, randomBytes } from 'crypto'

export const sha256 = (v: string) => createHash('sha256').update(v).digest('hex')
export const newToken = () => randomBytes(32).toString('base64url')

export function clientIp(req: Request) {
  return req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

/**
 * CSRF guard for cookie-authenticated POSTs. An explicit Origin must match this site. Without one, the
 * browser-set Sec-Fetch-Site header (which scripts cannot forge) must say same-origin. Anything else is refused.
 */
export function sameOrigin(req: Request) {
  const origin = req.headers.get('origin')
  if (origin) {
    try {
      return new URL(origin).host === (req.headers.get('x-forwarded-host') ?? req.headers.get('host'))
    } catch {
      return false
    }
  }
  return req.headers.get('sec-fetch-site') === 'same-origin'
}

/** Reads a small JSON body. Returns null for anything that isn't JSON or is too large. */
export async function readJson(req: Request, maxBytes = 8_000): Promise<Record<string, unknown> | null> {
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return null
  const text = await req.text().catch(() => '')
  if (!text || text.length > maxBytes) return null
  try {
    const v = JSON.parse(text)
    return v && typeof v === 'object' && !Array.isArray(v) ? v : null
  } catch {
    return null
  }
}

export const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
export const isEmail = (v: string) => v.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
