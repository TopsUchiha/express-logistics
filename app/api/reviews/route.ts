import { NextResponse, after } from 'next/server'
import { q } from '@/lib/db'
import { adminNotifyList, sendMail } from '@/lib/mail'
import { limited } from '@/lib/rate-limit'
import { clientIp, readJson, sameOrigin, str } from '@/lib/security'

const json = (body: unknown, status = 200, cache = 'no-store') => NextResponse.json(body, { status, headers: { 'Cache-Control': cache } })

/** Approved reviews only. Cached briefly so the homepage never hammers the database. */
export async function GET() {
  try {
    const rows = await q("select id, name, rating, body from reviews where status = 'APPROVED' order by created_at desc limit 24")
    return json({ reviews: rows.map((r) => ({ id: r.id, name: r.name, rating: r.rating, body: r.body })) }, 200, 'public, s-maxage=60, stale-while-revalidate=300')
  } catch {
    return json({ reviews: [] }, 200, 'no-store')
  }
}

/** New reviews are saved as PENDING. Nothing is shown until an admin approves it. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false }, 403)
  const body = await readJson(req, 3000)
  if (!body) return json({ ok: false, error: 'Invalid request.' }, 400)
  if (str(body.website, 100)) return json({ ok: true }) // honeypot: pretend it worked

  const name = str(body.name, 100)
  const text = str(body.body, 600)
  const rating = typeof body.rating === 'number' && Number.isInteger(body.rating) ? body.rating : 0
  if (!name || text.length < 10 || rating < 1 || rating > 5) return json({ ok: false, error: 'Please add your name, a star rating and a review of at least 10 characters.' }, 400)

  try {
    if (await limited(`review:${clientIp(req)}`, 3, 3600)) return json({ ok: false, error: 'Too many reviews from this connection. Please try again later.' }, 429)
    await q('insert into reviews(name, rating, body) values ($1,$2,$3)', [name, rating, text])
    after(() => sendMail(adminNotifyList(), 'New review to approve', `${name} left a ${rating}-star review. Open the admin panel (Reviews) to approve or reject it.`))
    return json({ ok: true })
  } catch {
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 503)
  }
}
