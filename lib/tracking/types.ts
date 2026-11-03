/** [longitude, latitude] — GeoJSON / Mapbox order */
export type Coordinates = [number, number]

export type ShipmentStatus = string

export type Place = {
  city: string
  country: string
  coordinates: Coordinates
}

export type RouteStopStatus = 'completed' | 'current' | 'upcoming'

export type RouteStop = Place & {
  status: RouteStopStatus
  timestamp: string
  /** Navigational waypoint used only to shape the route line (not shown as a stop). */
  waypoint?: boolean
}

export type ShipmentEvent = {
  title: string
  description: string
  location: string
  timestamp: string
  completed: boolean
}

export type TransportMode = 'air' | 'ocean' | 'road'

export type PartyInfo = {
  name: string
  phone: string
  /** Masked on purpose (e.g. j***@gmail.com): the email on file also verifies the chat. */
  email: string
  address: string
}

export type PackageInfo = {
  product: string
  quantity: string
  /** Pieces without dimensions or weights. */
  pieces: { qty: string; type: string; description: string }[]
}

export type Shipment = {
  trackingNumber: string
  status: ShipmentStatus
  mode: TransportMode
  service: string
  customer: PartyInfo
  sender: PartyInfo
  packageInfo: PackageInfo
  paymentMethod: string
  origin: Place
  destination: Place
  currentLocation: Place
  estimatedDelivery: string
  lastUpdated: string
  progress: number
  route: RouteStop[]
  events: ShipmentEvent[]
}

export type TrackingResult =
  | { ok: true; shipment: Shipment }
  | { ok: false; reason: 'empty' | 'invalid-format' | 'not-found' | 'unavailable'; message: string }
