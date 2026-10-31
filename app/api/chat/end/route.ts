import { NextResponse } from 'next/server'
import { CHAT_COOKIE } from '@/lib/chat'
import { q } from '@/lib/db'
import { sameOrigin, sha256 } from '@/lib/security'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 })
  const jar = await cookies()
  const token = jar.get(CHAT_COOKIE)?.value
  if (token) await q('delete from chat_sessions where token_hash = $1', [sha256(token)]).catch(() => {})
  jar.delete(CHAT_COOKIE)
  return NextResponse.json({ ok: true })
}
