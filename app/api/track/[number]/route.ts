import { NextResponse } from 'next/server'
import { limited } from '@/lib/rate-limit'
import { clientIp } from '@/lib/security'
import { findPublicShipment } from '@/lib/tracking/public-shipment'
import { TRACKING_PATTERN, normalizeTrackingNumber } from '@/lib/tracking/tracking-number'

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function GET(req: Request, { params }: { params: Promise<{ number: string }> }) {
  const number = normalizeTrackingNumber((await params).number).slice(0, 32)
  if (!TRACKING_PATTERN.test(number)) return json({ ok: false, reason: 'invalid-format' }, 400)
  try {
    if (await limited(`track:${clientIp(req)}`, 40, 600)) return json({ ok: false, reason: 'rate-limited' }, 429)
    const shipment = await findPublicShipment(number)
    return shipment ? json({ ok: true, shipment }) : json({ ok: false, reason: 'not-found' }, 404)
  } catch {
    return json({ ok: false, reason: 'unavailable' }, 503)
  }
}
