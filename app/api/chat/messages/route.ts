import { NextResponse, after } from 'next/server'
import { chatSession } from '@/lib/chat'
import { q } from '@/lib/db'
import { ADMIN_BASE } from '@/lib/admin-path'
import { adminNotifyList, sendMail } from '@/lib/mail'
import { limited } from '@/lib/rate-limit'
import { readJson, sameOrigin } from '@/lib/security'
import { siteConfig } from '@/lib/site-config'

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function GET(req: Request) {
  try {
    const session = await chatSession()
    if (!session) return json({ ok: false }, 401)
    if (await limited(`chat:poll:${session.id}`, 60, 60)) return json({ ok: false }, 429)
    const url = new URL(req.url)
    const after = Math.max(0, Number(url.searchParams.get('after')) || 0)
    const messages = await q(
      'select id, sender, body, created_at from messages where conversation_id = $1 and id > $2 order by id limit 100',
      [session.conversation_id, after],
    )
    const open = url.searchParams.get('open') === '1'
    const [c] = open
      ? await q('update conversations set client_unread = 0 where id = $1 returning status', [session.conversation_id])
      : await q('select status, client_unread from conversations where id = $1', [session.conversation_id])
    return json({ ok: true, messages, unread: open ? 0 : c?.client_unread ?? 0, status: c?.status })
  } catch {
    return json({ ok: false }, 503)
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false }, 403)
  const body = await readJson(req, 4000)
  const raw = body && typeof body.body === 'string' ? body.body.trim() : ''
  if (!raw) return json({ ok: false, error: 'Please type a message.' }, 400)
  if (raw.length > 1000) return json({ ok: false, error: 'That message is too long. Please keep it under 1,000 characters.' }, 400)
  const text = raw
  try {
    const session = await chatSession()
    if (!session) return json({ ok: false }, 401)
    if (await limited(`chat:msg:${session.id}`, 20, 60)) return json({ ok: false, error: 'You’re sending messages too fast. Please wait a moment.' }, 429)

    const [message] = await q(
      `insert into messages(conversation_id, sender, body) values ($1, 'CLIENT', $2) returning id, sender, body, created_at`,
      [session.conversation_id, text],
    )
    await q(
      `update conversations set status = 'OPEN', admin_unread = admin_unread + 1, last_message_at = now() where id = $1`,
      [session.conversation_id],
    )
    // Atomic: only the request that wins this update sends the email (at most one per 10 minutes).
    const notify = await q(
      `update conversations set admin_notified_at = now()
       where id = $1 and (admin_notified_at is null or admin_notified_at < now() - interval '10 minutes') returning id`,
      [session.conversation_id],
    )
    if (notify.length && ADMIN_BASE) {
      after(() =>
        sendMail(adminNotifyList(), 'New customer message', `A customer sent a new message. Read and reply: ${siteConfig.url}${ADMIN_BASE}/inbox/${session.conversation_id}`),
      )
    }
    return json({ ok: true, message })
  } catch {
    return json({ ok: false, error: 'Couldn’t send your message. Please try again.' }, 503)
  }
}
