import type { Metadata } from 'next'
import { TrackView } from '@/components/tracking/track-view'

export const metadata: Metadata = {
  title: 'Track & Trace',
  description: 'Look up a shipment by tracking number to see its route, status and estimated delivery.',
}

export default function TrackPage() {
  return <TrackView />
}
