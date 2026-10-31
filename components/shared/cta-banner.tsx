import Image from 'next/image'
import { images } from '@/lib/site-config'
import { Container, CtaButton, Eyebrow } from './primitives'

export function CtaBanner({
  eyebrow = 'Ready to ship?',
  title = 'Tell us what needs to move',
  description = 'Send us the details and a specialist will come back with a plan that fits your timeline and budget.',
}: {
  eyebrow?: string
  title?: string
  description?: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <Image src={images.ctaBackground} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/85" />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-1/3 bg-brand/90 lg:block" style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)' }} />
      <Container className="flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-center lg:py-20">
        <div className="flex max-w-2xl flex-col gap-4">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h2 className="text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl">{title}</h2>
          <p className="text-pretty text-lg text-white/75">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CtaButton href="/contact" variant="primary" className="lg:bg-white lg:text-navy lg:hover:bg-navy lg:hover:text-white">
            Get a Free Quote
          </CtaButton>
          <CtaButton href="/track" variant="outline-light">
            Track Shipment
          </CtaButton>
        </div>
      </Container>
    </section>
  )
}
