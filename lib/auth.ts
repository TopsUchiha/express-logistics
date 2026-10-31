import { cache } from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { q } from './db'
import { newToken, sha256 } from './security'
import { ADMIN_COOKIE } from './admin-path'

const PROD = process.env.NODE_ENV === 'production'
const NAME = ADMIN_COOKIE
const TTL_MS = 12 * 3600 * 1000

export async function createSession(userId: string) {
  const token = newToken()
  const expires = new Date(Date.now() + TTL_MS)
  await q('delete from admin_sessions where expires_at < now()')
  await q(`delete from rate_limits where window_start < now() - interval '1 day'`)
  await q('insert into admin_sessions(user_id, token_hash, expires_at) values ($1,$2,$3)', [userId, sha256(token), expires])
  ;(await cookies()).set(NAME, token, { httpOnly: true, secure: PROD, sameSite: 'lax', path: '/', expires })
}

export const getAdmin = cache(async () => {
  const token = (await cookies()).get(NAME)?.value
  if (!token) return null
  const [u] = await q(
    `select u.id, u.email from admin_sessions s join admin_users u on u.id = s.user_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [sha256(token)],
  )
  return (u as { id: string; email: string } | undefined) ?? null
})

export async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) notFound() // a plain 404, never a redirect that reveals the panel
  return admin
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(NAME)?.value
  if (token) await q('delete from admin_sessions where token_hash = $1', [sha256(token)])
  jar.delete(NAME)
}
