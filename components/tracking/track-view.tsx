'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Loader2, Plane, Search, Ship, Truck } from 'lucide-react'
import { PageHero } from '@/components/shared/page-hero'
import { Container, Eyebrow } from '@/components/shared/primitives'
import { TrackingMap } from './tracking-map'
import { normalizeTrackingNumber, trackingService } from '@/lib/tracking/tracking-service'
import type { Shipment, TrackingResult } from '@/lib/tracking/types'
import { formatDate, formatDateTime } from '@/lib/format'
import { images, siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const modeIcon = {
  ocean: { Icon: Ship, label: 'Ocean freight', className: '' },
  air: { Icon: Plane, label: 'Air freight', className: 'rotate-45' },
  road: { Icon: Truck, label: 'Road freight', className: '' },
} as const

function ProgressTrack({ shipment }: { shipment: Shipment }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(shipment.progress))
    return () => cancelAnimationFrame(id)
  }, [shipment.progress])
  const { Icon, label, className } = modeIcon[shipment.mode]

  return (
    <div className="rounded-sm bg-white px-6 pt-5 pb-6 shadow-[0_4px_24px_rgba(11,26,43,0.08)] sm:px-8">
      <div
        role="progressbar"
        aria-label={`${label} progress`}
        aria-valuenow={shipment.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative pt-10"
      >
        <div className="relative h-2 rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-1000 ease-out motion-reduce:transition-none"
            style={{ width: `${width}%` }}
          />
          <span aria-hidden="true" className="absolute top-1/2 left-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow" />
          <span aria-hidden="true" className="absolute top-1/2 right-0 h-3.5 w-3.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-white" />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-1000 ease-out motion-reduce:transition-none"
            style={{ left: `${width}%` }}
          >
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-sm bg-navy px-2 py-0.5 text-[11px] font-bold text-white">
              {shipment.progress}%
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-md ring-4 ring-white">
              <Icon className={cn('h-5 w-5', className)} aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Origin</p>
          <p className="text-sm font-extrabold text-navy">{shipment.origin.city}, {shipment.origin.country}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Destination</p>
          <p className="text-sm font-extrabold text-navy">{shipment.destination.city}, {shipment.destination.country}</p>
        </div>
      </div>
    </div>
  )
}

function Summary({ shipment }: { shipment: Shipment }) {
  return (
    <div className="rounded-sm bg-white p-6 shadow-[0_4px_24px_rgba(11,26,43,0.08)] sm:p-8">
      <div className="flex flex-col gap-2">
        <Eyebrow>{shipment.service}</Eyebrow>
        <h2 className="text-2xl font-extrabold text-navy sm:text-3xl">{shipment.trackingNumber}</h2>
        <p className="text-sm text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
          <strong className="text-navy">{shipment.status}</strong>{shipment.estimatedDelivery ? ` · ETA ${formatDate(shipment.estimatedDelivery)}` : ''} · Updated {formatDateTime(shipment.lastUpdated)}
        </p>
      </div>
    </div>
  )
}

function Details({ shipment }: { shipment: Shipment }) {
  const points = [
    { label: 'Origin', place: shipment.origin },
    { label: 'Current location', place: shipment.currentLocation, current: true },
    { label: 'Destination', place: shipment.destination },
  ]
  return (
    <aside className="flex flex-col gap-8 rounded-sm bg-white p-6 shadow-[0_4px_24px_rgba(11,26,43,0.08)] sm:p-8">
      <ol className="flex flex-col">
        {points.map((p, i) => (
          <li key={p.label} className={cn('relative pl-8', i < points.length - 1 && 'pb-6')}>
            {i < points.length - 1 && <span aria-hidden="true" className="absolute top-4 bottom-0 left-[5px] w-px border-l border-dashed border-input" />}
            <span aria-hidden="true" className={cn('absolute top-1 left-0 h-3 w-3 rounded-full border-2 border-brand', p.current ? 'bg-brand ring-4 ring-brand/25' : i === 0 ? 'bg-brand' : 'bg-white')} />
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{p.label}</p>
            <p className="text-[15px] font-extrabold text-navy">{p.place.city}, {p.place.country}</p>
          </li>
        ))}
      </ol>
      <div className="border-t border-border pt-6">
        <h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-navy">Shipment timeline</h3>
        <ol className="flex flex-col gap-5">
          {shipment.events.map((ev) => (
            <li key={ev.title + ev.timestamp} className="flex gap-3">
              <span aria-hidden="true" className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border', ev.completed ? 'border-brand bg-brand' : 'border-input bg-white')} />
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-bold text-brand">{formatDateTime(ev.timestamp)}</p>
                <p className="text-sm font-extrabold text-navy">{ev.title}</p>
                <p className="text-[13px] leading-snug text-muted-foreground">{ev.description} · {ev.location}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}

export function TrackView() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (number: string) => {
    setLoading(true)
    try {
      setResult(await trackingService.getShipment(number))
    } finally {
      setLoading(false)
    }
  }, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    search(normalizeTrackingNumber(value).slice(0, 32))
  }

  return (
    <>
      <PageHero
        eyebrow="Shipment status"
        title="Track your shipment"
        description="Enter your tracking number to see where it is and what has happened so far."
        image={images.trackHero}
        breadcrumbs={[{ label: 'Track & Trace' }]}
      >
        <form onSubmit={onSubmit} className="mt-2 flex max-w-xl flex-col gap-2 sm:flex-row" role="search">
          <label className="flex h-12 items-center gap-3 sm:flex-1 rounded-sm bg-white px-4 text-muted-foreground">
            <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="sr-only">Tracking number</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`e.g. ${siteConfig.tracking.placeholder}`}
              maxLength={32}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-brand px-7 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            Track
          </button>
        </form>
        <p className="text-sm text-white/60">Your tracking number is printed on your receipt.</p>
      </PageHero>

      {(loading || result) && (
      <section className="bg-surface py-12 lg:py-16" aria-live="polite">
        <Container className="flex flex-col gap-4">
          {loading && !result && <p className="text-muted-foreground">Looking up your shipment…</p>}
          {result && !result.ok && (
            <div role="alert" className="rounded-sm border border-destructive/30 bg-white p-8">
              <h2 className="text-xl font-extrabold text-navy">We couldn’t find that shipment</h2>
              <p className="mt-2 text-muted-foreground">{result.message}</p>
            </div>
          )}
          {result?.ok && (
            <>
              <ProgressTrack shipment={result.shipment} />
              <Summary shipment={result.shipment} />
              <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <div className="h-[380px] overflow-hidden rounded-sm bg-navy lg:h-auto lg:min-h-[560px]">
                  <TrackingMap shipment={result.shipment} />
                </div>
                <Details shipment={result.shipment} />
              </div>
            </>
          )}
        </Container>
      </section>
      )}
    </>
  )
}
