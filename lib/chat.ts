import { cookies } from 'next/headers'
import { q } from './db'
import { sha256 } from './security'

const PROD = process.env.NODE_ENV === 'production'
export const CHAT_COOKIE = PROD ? '__Host-lgx_chat' : 'lgx_chat'
export const CHAT_TTL_MS = 24 * 3600 * 1000

export async function chatSession() {
  const token = (await cookies()).get(CHAT_COOKIE)?.value
  if (!token) return null
  const [s] = await q(
    'select id, conversation_id from chat_sessions where token_hash = $1 and expires_at > now()',
    [sha256(token)],
  )
  return (s as { id: string; conversation_id: string } | undefined) ?? null
}
