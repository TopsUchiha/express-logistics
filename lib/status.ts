export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PICKED_UP: 'Picked up',
  PROCESSING: 'Processing',
  IN_TRANSIT: 'In transit',
  AT_FACILITY: 'At facility',
  CUSTOMS: 'Customs clearance',
  ON_HOLD: 'On hold',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}
export const STATUSES = Object.keys(STATUS_LABELS)

export const SERVICES = [
  { label: 'Air Freight', mode: 'air' },
  { label: 'Ocean Freight', mode: 'ocean' },
  { label: 'Heavy Machinery Transport', mode: 'road' },
  { label: 'Pet Transport', mode: 'air' },
] as const

export const fmt = (d: Date | string) =>
  new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC'
