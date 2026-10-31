import { NextResponse } from 'next/server'
import { CHAT_COOKIE, CHAT_TTL_MS } from '@/lib/chat'
import { q } from '@/lib/db'
import { limited } from '@/lib/rate-limit'
import { clientIp, newToken, readJson, sameOrigin, sha256, str } from '@/lib/security'
import { TRACKING_PATTERN, normalizeTrackingNumber } from '@/lib/tracking/tracking-number'

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
const FAIL = { ok: false, error: 'We couldn’t verify those details. Please check them and try again.' }

/** Step 2 of the chat start: tracking number + the email on file. One generic failure for every wrong guess. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false }, 403)
  const body = await readJson(req, 1000)
  if (!body) return json(FAIL, 400)
  const number = normalizeTrackingNumber(str(body.number, 40)).slice(0, 32)
  const email = str(body.email, 254).toLowerCase()

  try {
    const ip = clientIp(req)
    if ((await limited(`chat:ip:${ip}`, 15, 900)) || (await limited(`chat:num:${number}`, 8, 900))) {
      return json({ ok: false, error: 'Too many attempts. Please try again in a few minutes.' }, 429)
    }
    if (!TRACKING_PATTERN.test(number) || !email) return json(FAIL, 401)

    const [s] = await q(
      'select id, tracking_number, sender_name, sender_email, receiver_name, receiver_email from shipments where tracking_number = $1',
      [number],
    )
    const isSender = s && s.sender_email?.toLowerCase() === email
    const isReceiver = s && s.receiver_email?.toLowerCase() === email
    if (!isSender && !isReceiver) return json(FAIL, 401)

    const [conv] = await q(
      `insert into conversations(shipment_id, contact_email) values ($1, $2)
       on conflict (shipment_id) do update set contact_email = excluded.contact_email
       returning id, (xmax = 0) as created`,
      [s.id, email],
    )
    const name = (isSender ? s.sender_name : s.receiver_name) as string
    if (conv.created) {
      await q(`insert into messages(conversation_id, sender, body) values ($1, 'SYSTEM', $2)`, [conv.id, `Chat opened by ${name}.`])
    }
    const token = newToken()
    const expires = new Date(Date.now() + CHAT_TTL_MS)
    await q('delete from chat_sessions where expires_at < now()')
    await q('insert into chat_sessions(conversation_id, token_hash, expires_at) values ($1,$2,$3)', [conv.id, sha256(token), expires])
    const messages = await q(
      `select id, sender, body, created_at from (
         select id, sender, body, created_at from messages where conversation_id = $1 order by id desc limit 100
       ) m order by id`,
      [conv.id],
    )
    await q('update conversations set client_unread = 0 where id = $1', [conv.id])

    const res = json({ ok: true, name: name.split(/\s+/)[0], messages })
    res.cookies.set(CHAT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', expires })
    return res
  } catch {
    return json({ ok: false, error: 'Chat is temporarily unavailable. Please try again soon.' }, 503)
  }
}
