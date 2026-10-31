import type { Metadata } from 'next'
import { ComparisonTable } from '@/components/shared/comparison-table'
import { CtaBanner } from '@/components/shared/cta-banner'
import { PageHero } from '@/components/shared/page-hero'
import { Container } from '@/components/shared/primitives'
import { images } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Service Comparison',
  description: 'Compare air, ocean, road, heavy machinery and warehousing services side by side.',
}

export default function ServiceComparisonPage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Which service fits your cargo?"
        description="Speed, cost and capacity side by side."
        image={images.oceanFreight}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: 'Service Comparison' }]}
      />
      <section className="bg-surface py-16 lg:py-24">
        <Container className="flex flex-col gap-4">
          <ComparisonTable />
          <p className="text-sm text-muted-foreground">Ratings are a rough guide. Each quote confirms the real transit time and cost.</p>
        </Container>
      </section>
      <CtaBanner />
    </>
  )
}
