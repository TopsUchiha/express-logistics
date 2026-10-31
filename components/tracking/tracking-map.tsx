'use client'

import { useEffect, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { buildPath, isValidCoordinates, mapConfig } from '@/lib/map-config'
import type { Shipment } from '@/lib/tracking/types'

function popupContent(title: string, line: string) {
  const el = document.createElement('div')
  el.style.padding = '10px 14px'
  const t = document.createElement('p')
  t.textContent = title
  t.style.cssText = 'margin:0;font-weight:800;font-size:13px;color:#0b1a2b'
  const l = document.createElement('p')
  l.textContent = line
  l.style.cssText = 'margin:2px 0 0;font-size:12px;color:#5b6472'
  el.append(t, l)
  return el
}

export function TrackingMap({ shipment }: { shipment: Shipment }) {
  const ref = useRef<HTMLDivElement>(null)
  const token = mapConfig.accessToken

  useEffect(() => {
    if (!token || !ref.current) return
    let map: MapboxMap | undefined
    let cancelled = false

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (cancelled || !ref.current) return
      mapboxgl.accessToken = token
      map = new mapboxgl.Map({
        container: ref.current,
        style: mapConfig.style,
        projection: 'globe',
        center: shipment.currentLocation.coordinates,
        zoom: 2,
        minZoom: mapConfig.minZoom,
        maxZoom: mapConfig.maxZoom,
        attributionControl: false,
      })
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.addControl(new mapboxgl.AttributionControl({ compact: true }))

      map.on('style.load', () => {
        if (!map) return
        map.setFog(mapConfig.fog)
        const coords = shipment.route.map((s) => s.coordinates).filter(isValidCoordinates)
        const current = Math.max(0, shipment.route.findIndex((s) => s.status === 'current'))
        const line = (id: string, path: typeof coords, color: string, dashed: boolean) => {
          map!.addSource(id, {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: path } },
          })
          map!.addLayer({
            id,
            type: 'line',
            source: id,
            paint: { 'line-color': color, 'line-width': 3, ...(dashed ? { 'line-dasharray': [1.5, 1.5] } : {}) },
          })
        }
        line('route-remaining', buildPath(coords.slice(current)), mapConfig.colors.routeRemaining, true)
        line('route-done', buildPath(coords.slice(0, current + 1)), mapConfig.colors.route, false)

        shipment.route
          .filter((s) => !s.waypoint && isValidCoordinates(s.coordinates))
          .forEach((stop) => {
            const el = document.createElement('span')
            if (stop.status === 'current') {
              el.className = 'relative flex h-5 w-5'
              const pulse = document.createElement('span')
              pulse.className = 'absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand/60'
              const dot = document.createElement('span')
              dot.className = 'relative h-5 w-5 rounded-full border-2 border-white bg-brand'
              el.append(pulse, dot)
            } else {
              el.className = `block h-3.5 w-3.5 rounded-full border-2 border-white ${stop.status === 'completed' ? 'bg-brand' : 'bg-slate-300'}`
            }
            new mapboxgl.Marker({ element: el })
              .setLngLat(stop.coordinates)
              .setPopup(
                new mapboxgl.Popup({ className: 'shipment-popup', offset: 14 }).setDOMContent(
                  popupContent(`${stop.city}${stop.country ? `, ${stop.country}` : ''}`, stop.status === 'current' ? 'Current location' : stop.status === 'completed' ? 'Completed' : 'Upcoming'),
                ),
              )
              .addTo(map!)
          })
      })
    })

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [shipment, token])

  if (!token) {
    return (
      <div className="grid h-full min-h-[320px] place-content-center gap-2 bg-navy p-8 text-center text-white">
        <strong className="text-lg">Interactive globe ready</strong>
        <span className="text-sm text-white/60">Add a public Mapbox token (NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) to enable the live map.</span>
      </div>
    )
  }

  return <div ref={ref} className="h-full min-h-[320px] w-full" role="img" aria-label="Interactive shipment globe" />
}
