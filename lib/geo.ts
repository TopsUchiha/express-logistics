import { siteConfig } from './site-config'

export type LatLng = { lat: number; lng: number }

/** Looks a place up on OpenStreetMap Nominatim. Returns null when it can't be found. */
export async function geocode(place: string): Promise<LatLng | null> {
  try {
    const base = process.env.NOMINATIM_URL ?? 'https://nominatim.openstreetmap.org'
    const res = await fetch(`${base}/search?format=json&limit=1&q=${encodeURIComponent(place)}`, {
      headers: { 'User-Agent': `ExpressLogistics/1.0 (${siteConfig.company.email})` },
      signal: AbortSignal.timeout(5000),
    })
    const [hit] = await res.json()
    return hit ? { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) } : null
  } catch {
    return null
  }
}
