import { NextResponse, after } from 'next/server'
import { q } from '@/lib/db'
import { adminNotifyList, sendMail } from '@/lib/mail'
import { limited } from '@/lib/rate-limit'
import { clientIp, isEmail, readJson, sameOrigin, str } from '@/lib/security'

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false }, 403)
  const body = await readJson(req, 4000)
  if (!body) return json({ ok: false, error: 'Invalid request.' }, 400)
  if (str(body.website, 100)) return json({ ok: true }) // honeypot: pretend it worked

  const name = str(body.name, 100)
  const email = str(body.email, 254).toLowerCase()
  const message = str(body.message, 2000)
  if (!name || !message || !isEmail(email)) return json({ ok: false, error: 'Please fill in your name, a valid email and a message.' }, 400)

  try {
    if (await limited(`contact:${clientIp(req)}`, 5, 600)) return json({ ok: false, error: 'Too many messages. Please try again later.' }, 429)
    await q('insert into contact_messages(name, email, message) values ($1,$2,$3)', [name, email, message])
    after(() => sendMail(adminNotifyList(), 'New website enquiry', `${name} sent a new enquiry. Open the admin panel to read it.`))
    return json({ ok: true })
  } catch {
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 503)
  }
}
