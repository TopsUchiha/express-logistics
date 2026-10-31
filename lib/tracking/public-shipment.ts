import { q } from '../db'
import { STATUS_LABELS } from '../status'
import type { Place, RouteStop, Shipment } from './types'

const place = (text: string, lat: number, lng: number): Place => {
  const i = text.lastIndexOf(',')
  return {
    city: (i < 0 ? text : text.slice(0, i)).trim(),
    country: i < 0 ? '' : text.slice(i + 1).trim(),
    coordinates: [lng, lat],
  }
}

function km(a: Place, b: Place) {
  const r = Math.PI / 180
  const [lo1, la1] = a.coordinates
  const [lo2, la2] = b.coordinates
  const h = Math.sin(((la2 - la1) * r) / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(((lo2 - lo1) * r) / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}

/** Public view of a shipment: never includes client names, emails or addresses. */
export async function findPublicShipment(number: string): Promise<Shipment | null> {
  const [s] = await q('select * from shipments where tracking_number = $1', [number])
  if (!s) return null
  const rows = await q(
    'select status, location, description, created_at from shipment_events where shipment_id = $1 order by created_at',
    [s.id],
  )

  const origin = place(s.origin, s.origin_lat, s.origin_lng)
  const destination = place(s.destination, s.dest_lat, s.dest_lng)
  const delivered = s.status === 'DELIVERED'
  const current = delivered ? destination : place(s.current_location, s.current_lat, s.current_lng)
  const atOrigin = !delivered && km(current, origin) < 5
  const atDest = !delivered && km(current, destination) < 5
  const created = new Date(s.created_at).toISOString()
  const updated = new Date(s.updated_at).toISOString()
  const eta = s.eta ? `${s.eta}T00:00:00.000Z` : ''

  const stop = (p: Place, status: RouteStop['status'], timestamp: string): RouteStop => ({ ...p, status, timestamp })
  let route: RouteStop[]
  if (delivered) route = [stop(origin, 'completed', created), stop(destination, 'completed', updated)]
  else if (atOrigin) route = [stop(origin, 'current', updated), stop(destination, 'upcoming', eta || updated)]
  else if (atDest) route = [stop(origin, 'completed', created), stop(destination, 'current', updated)]
  else route = [stop(origin, 'completed', created), stop(current, 'current', updated), stop(destination, 'upcoming', eta || updated)]

  const total = km(origin, destination)
  const progress = delivered ? 100 : s.status === 'PENDING' || atOrigin ? 0 : Math.min(99, Math.max(2, Math.round((100 * km(origin, current)) / (total || 1))))

  const events = rows.map((e) => ({
    title: STATUS_LABELS[e.status] ?? e.status,
    description: e.description ?? '',
    location: e.location,
    timestamp: new Date(e.created_at).toISOString(),
    completed: true,
  }))
  if (eta && !delivered && s.status !== 'CANCELLED') {
    events.push({ title: 'Estimated delivery', description: 'Expected at the destination.', location: s.destination, timestamp: eta, completed: false })
  }

  return {
    trackingNumber: s.tracking_number,
    status: STATUS_LABELS[s.status] ?? s.status,
    mode: s.mode,
    service: s.service,
    origin,
    destination,
    currentLocation: current,
    estimatedDelivery: eta,
    lastUpdated: updated,
    progress,
    route,
    events,
  }
}
