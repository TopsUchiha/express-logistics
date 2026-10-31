import { siteConfig } from '../site-config'
import { TRACKING_PATTERN, normalizeTrackingNumber } from './tracking-number'
import type { TrackingResult } from './types'

export { normalizeTrackingNumber }

const fail = (reason: Extract<TrackingResult, { ok: false }>['reason'], message: string): TrackingResult => ({ ok: false, reason, message })

export const trackingService = {
  async getShipment(input: string): Promise<TrackingResult> {
    const number = normalizeTrackingNumber(input ?? '').slice(0, 32)
    if (!number) return fail('empty', 'Please enter a tracking number to search.')
    if (!TRACKING_PATTERN.test(number)) {
      return fail('invalid-format', `That doesn’t look like a tracking number. They look like ${siteConfig.tracking.placeholder}.`)
    }
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(number)}`, { cache: 'no-store' })
      if (res.status === 404) return fail('not-found', 'We couldn’t find a shipment with that tracking number. Please check it and try again.')
      if (res.status === 429) return fail('unavailable', 'Too many lookups from your connection. Please wait a few minutes and try again.')
      const data = await res.json()
      if (res.ok && data.ok) return { ok: true, shipment: data.shipment }
    } catch {
      /* fall through */
    }
    return fail('unavailable', 'Tracking is temporarily unavailable. Please try again in a few minutes.')
  },
}
