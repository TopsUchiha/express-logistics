import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { Accordion } from '@/components/shared/accordion'
import { CtaBanner } from '@/components/shared/cta-banner'
import { PageHero } from '@/components/shared/page-hero'
import { Container, CtaButton, SectionHeading, ServiceIcon } from '@/components/shared/primitives'
import { customsDocuments, getService, services } from '@/lib/services-data'

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = getService((await params).slug)
  return service ? { title: service.title, description: service.summary } : {}
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug)
  if (!service) notFound()

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title={service.title}
        description={service.summary}
        image={service.image}
        imageAlt={service.imageAlt}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]}
      />

      <section className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="Overview" title={service.shortTitle} description={service.intro} />
            <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted-foreground">
              {service.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] font-semibold text-navy">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <aside className="flex h-fit flex-col gap-5 rounded-sm bg-navy p-8 text-white lg:sticky lg:top-28">
            <span className="grid h-14 w-14 place-items-center rounded-sm bg-brand">
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </span>
            <h2 className="text-2xl font-extrabold">Talk to a specialist</h2>
            <p className="text-white/75">Tell us about your cargo and timeline and we’ll put together a {service.shortTitle.toLowerCase()} plan.</p>
            <CtaButton href="/contact">Get a Free Quote</CtaButton>
          </aside>
        </Container>
      </section>

      <section className="bg-surface py-16 lg:py-24">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="Benefits" title={`What you get with ${service.shortTitle}`} />
          <div className="grid gap-6 md:grid-cols-3">
            {service.benefits.map((b, i) => (
              <div key={b.title} className="rounded-sm border border-border bg-white p-6 shadow-[0_4px_24px_rgba(11,26,43,0.06)]">
                <p className="text-sm font-black text-brand">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-xl font-extrabold text-navy">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {service.slug === 'customs-clearance' && (
        <section className="py-16 lg:py-24">
          <Container className="flex flex-col gap-10">
            <SectionHeading eyebrow="Documentation" title="Documents we help you prepare" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {customsDocuments.map((d) => (
                <div key={d.title} className="rounded-sm border border-border bg-white p-6">
                  <h3 className="text-lg font-extrabold text-navy">{d.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{d.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className={service.slug === 'customs-clearance' ? 'bg-surface py-16 lg:py-24' : 'py-16 lg:py-24'}>
          <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="FAQ" title={`${service.shortTitle} questions`} />
            <Accordion items={service.faqs.map((f) => ({ title: f.question, content: f.answer }))} />
          </Container>
        </section>
      )}

      <CtaBanner />
    </>
  )
}
