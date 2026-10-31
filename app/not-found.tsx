import type { Metadata } from 'next'
import { SiteChrome } from '@/components/layout/site-chrome'
import { PageHero } from '@/components/shared/page-hero'
import { Container, CtaButton } from '@/components/shared/primitives'
import { images } from '@/lib/site-config'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <SiteChrome>
      <PageHero eyebrow="Error 404" title="We can’t find that page" description="The link may be old, or the address may have a typo." image={images.heroPort} />
      <section className="bg-surface py-16 lg:py-24">
        <Container className="flex flex-wrap gap-3">
          <CtaButton href="/">Back to home</CtaButton>
          <CtaButton href="/track" variant="outline-dark">Track a shipment</CtaButton>
        </Container>
      </section>
    </SiteChrome>
  )
}
