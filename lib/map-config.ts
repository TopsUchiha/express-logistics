import type { Coordinates } from './tracking/types'

// Only a public (pk.) token may live in browser code. A secret (sk.) token is refused.
const rawToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''

export const mapConfig = {
  accessToken: rawToken.startsWith('pk.') ? rawToken : '',
  style: 'mapbox://styles/mapbox/dark-v11',
  initialCenter: [30, 22] as Coordinates,
  initialZoom: 1.6,
  minZoom: 0.8,
  maxZoom: 14,
  /** seconds of inactivity before idle auto-rotation resumes */
  idleRotateDelay: 10,
  colors: {
    water: '#0b2440',
    land: '#13263b',
    route: '#F26B1D',
    routeRemaining: '#cbd5e1',
  },
  fog: {
    color: 'rgb(16, 38, 66)',
    'high-color': 'rgb(36, 92, 200)',
    'horizon-blend': 0.03,
    'space-color': 'rgb(5, 10, 20)',
    'star-intensity': 0.35,
  },
}

const toRad = (d: number) => (d * Math.PI) / 180
const toDeg = (r: number) => (r * 180) / Math.PI

/** Interpolate a great-circle arc between two points. */
export function greatCircle(a: Coordinates, b: Coordinates, segments = 48): Coordinates[] {
  const [lon1, lat1] = [toRad(a[0]), toRad(a[1])]
  const [lon2, lat2] = [toRad(b[0]), toRad(b[1])]
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    )
  if (!Number.isFinite(d) || d === 0) return [a, b]
  const points: Coordinates[] = []
  for (let i = 0; i <= segments; i++) {
    const f = i / segments
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2)
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2)
    const z = A * Math.sin(lat1) + B * Math.sin(lat2)
    points.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)))])
  }
  return points
}

/** Build a continuous path through all points, unwrapping longitudes across the antimeridian. */
export function buildPath(points: Coordinates[]): Coordinates[] {
  if (points.length < 2) return points
  const raw: Coordinates[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const arc = greatCircle(points[i], points[i + 1])
    raw.push(...(i === 0 ? arc : arc.slice(1)))
  }
  const out: Coordinates[] = [raw[0]]
  for (let i = 1; i < raw.length; i++) {
    let lng = raw[i][0]
    const prev = out[i - 1][0]
    while (lng - prev > 180) lng -= 360
    while (lng - prev < -180) lng += 360
    out.push([lng, raw[i][1]])
  }
  return out
}

export function isValidCoordinates(c: unknown): c is Coordinates {
  return (
    Array.isArray(c) &&
    c.length === 2 &&
    typeof c[0] === 'number' &&
    typeof c[1] === 'number' &&
    Number.isFinite(c[0]) &&
    Number.isFinite(c[1]) &&
    Math.abs(c[1]) <= 90
  )
}
