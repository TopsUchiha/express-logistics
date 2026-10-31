import type { Metadata } from 'next'
import { Accordion } from '@/components/shared/accordion'
import { CtaBanner } from '@/components/shared/cta-banner'
import { PageHero } from '@/components/shared/page-hero'
import { Container, SectionHeading } from '@/components/shared/primitives'
import { faqs } from '@/lib/faq-data'
import { images } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about shipping, tracking, customs and quotes.',
}

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="Common questions"
        description="Answers to what people ask before they book."
        image={images.process}
        breadcrumbs={[{ label: 'FAQ' }]}
      />
      <section className="bg-surface py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQ" title="Still unsure?" description="If your question isn’t here, ask us directly." />
          <Accordion items={faqs.map((f) => ({ title: f.question, content: f.answer }))} />
        </Container>
      </section>
      <CtaBanner />
    </>
  )
}
