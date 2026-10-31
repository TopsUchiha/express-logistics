import type { Metadata } from 'next'
import { ServiceCard } from '@/components/services/service-card'
import { CtaBanner } from '@/components/shared/cta-banner'
import { PageHero } from '@/components/shared/page-hero'
import { Container, SectionHeading } from '@/components/shared/primitives'
import { services } from '@/lib/services-data'
import { images } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Air, ocean and heavy machinery transport, warehousing, customs clearance and pet transport.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Freight, storage and customs from one team"
        description="Six services, one team responsible for all of them."
        image={images.warehouse}
        breadcrumbs={[{ label: 'Services' }]}
      />
      <section className="bg-surface py-16 lg:py-24">
        <Container className="flex flex-col gap-14">
          <SectionHeading eyebrow="Services" title="Pick the service you need" description="Every shipment is different, so you can use one service or combine several." />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  )
}
