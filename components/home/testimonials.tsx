'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { HIDE_SAMPLES_AT, sampleTestimonials, type Testimonial } from '@/lib/testimonials-data'
import { Container, CtaButton, SectionHeading } from '@/components/shared/primitives'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-5 w-5 ${i <= rating ? 'fill-brand text-brand' : 'fill-transparent text-border'}`} aria-hidden="true" />
      ))}
    </div>
  )
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-lg border border-border bg-white p-6 shadow-[0_2px_12px_rgba(11,26,43,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(11,26,43,0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={t.rating} />
        <span className="text-sm font-bold text-navy">{t.rating}/5</span>
      </div>
      {t.title && <h3 className="text-lg font-extrabold text-navy">{t.title}</h3>}
      <blockquote className="flex-1 text-pretty leading-relaxed text-muted-foreground">“{t.body}”</blockquote>
      <figcaption className="border-t border-border pt-4 text-sm font-bold text-navy">
        {t.sample ? (
          <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sample testimonial</span>
        ) : (
          t.name
        )}
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const [real, setReal] = useState<Testimonial[]>([])
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)

  // Genuine reviews approved in the admin panel. The page itself stays static; this is one small cached request.
  useEffect(() => {
    let live = true
    fetch('/api/reviews')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (live && d && Array.isArray(d.reviews)) setReal(d.reviews)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [])

  const showSamples = real.length < HIDE_SAMPLES_AT
  const items = showSamples ? [...real, ...sampleTestimonials] : real
  const hasSamples = items.some((t) => t.sample)

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const w = el.clientWidth || 1
    const total = Math.max(1, Math.ceil(el.scrollWidth / w - 0.05))
    const atEnd = el.scrollLeft + w >= el.scrollWidth - 2
    setPages(total)
    setPage(atEnd ? total - 1 : Math.min(total - 1, Math.round(el.scrollLeft / w)))
  }, [])

  useEffect(() => {
    measure()
    const el = track.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, items.length])

  const goTo = (p: number) => {
    const el = track.current
    if (el) el.scrollTo({ left: p * el.clientWidth, behavior: 'auto' }) // CSS scroll-behavior handles smoothing and reduced motion
  }

  if (items.length === 0) return null

  return (
    <section className="py-20 lg:py-28" aria-labelledby="testimonials-heading">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <SectionHeading
            eyebrow="Testimonials"
            title={<span id="testimonials-heading">What Our Customers Say</span>}
            description="Discover what makes Express Logistics a trusted choice for reliable, secure, and efficient shipping solutions."
            align="center"
            className="mx-auto"
          />
          {hasSamples && (
            <p className="mx-auto max-w-2xl text-center text-xs font-semibold text-muted-foreground">
              Sample testimonials shown for demonstration. They are not customer reviews and will be replaced by genuine feedback.
            </p>
          )}
        </div>

        <div role="group" aria-roledescription="carousel" aria-label="Customer testimonials" className="relative">
          <div
            ref={track}
            onScroll={measure}
            tabIndex={0}
            aria-label="Testimonials, scroll horizontally"
            className="-mx-2 flex snap-x snap-mandatory overflow-x-auto pb-6 outline-none motion-safe:scroll-smooth [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-scrollbar]:hidden"
          >
            {items.map((t, i) => (
              <div key={t.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`} className="w-full shrink-0 snap-start px-2 py-1 sm:w-1/2 lg:w-1/3">
                <Card t={t} />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <button type="button" onClick={() => goTo(page - 1)} disabled={page <= 0} aria-label="Previous testimonials" className="order-1 sm:order-none grid h-11 w-11 place-items-center rounded-full border-2 border-navy text-navy transition-colors hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="order-3 flex w-full flex-wrap items-center justify-center sm:order-none sm:w-auto">
              {Array.from({ length: pages }, (_, p) => (
                <button key={p} type="button" onClick={() => goTo(p)} aria-label={`Go to testimonials page ${p + 1} of ${pages}`} aria-current={p === page ? 'true' : undefined} className="grid h-6 w-6 place-items-center">
                  <span className={`block h-2.5 rounded-full transition-all ${p === page ? 'w-6 bg-brand' : 'w-2.5 bg-border hover:bg-muted-foreground'}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => goTo(page + 1)} disabled={page >= pages - 1} aria-label="Next testimonials" className="order-2 sm:order-none grid h-11 w-11 place-items-center rounded-full border-2 border-navy text-navy transition-colors hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">Page {page + 1} of {pages}</p>
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-lg bg-surface px-6 py-10 text-center">
          <h3 className="text-2xl font-extrabold text-navy">Have you used our services?</h3>
          <p className="text-muted-foreground">We’d love to hear about your experience with Express Logistics.</p>
          <CtaButton href="/review" className="mt-2">Leave a Review</CtaButton>
        </div>
      </Container>
    </section>
  )
}
