import type { Metadata } from 'next'
import { AboutPreview, ProcessSection, StatisticsSection } from '@/components/home/home-sections'
import { CtaBanner } from '@/components/shared/cta-banner'
import { PageHero } from '@/components/shared/page-hero'
import { Container, SectionHeading } from '@/components/shared/primitives'
import { images } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Who we are and how we work.',
}

const principles = [
  { title: 'Own the outcome', text: 'We take responsibility from the first conversation to final delivery.' },
  { title: 'Stay curious', text: 'The obvious route isn’t always the best one, so we keep looking.' },
  { title: 'Make it clear', text: 'We tell you what’s happening, including when it’s bad news.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="The team behind your shipments"
        description="Who we are and how we work."
        image={images.heroPort}
        breadcrumbs={[{ label: 'About Us' }]}
      />
      <AboutPreview showCta={false} />
      <section className="bg-surface py-16 lg:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Our approach"
            title="How we work"
            description="We keep the complicated parts out of your way. We’re independent enough to stay personal and connected enough to reach almost anywhere."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {principles.map((p, i) => (
              <div key={p.title} className="rounded-sm border border-border bg-white p-6 shadow-[0_4px_24px_rgba(11,26,43,0.06)]">
                <p className="text-sm font-black text-brand">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-xl font-extrabold text-navy">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <ProcessSection />
      <StatisticsSection />
      <CtaBanner />
    </>
  )
}
