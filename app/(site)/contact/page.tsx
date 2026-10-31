import type { Metadata } from 'next'
import { Clock, Mail, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'
import { PageHero } from '@/components/shared/page-hero'
import { Container, SectionHeading } from '@/components/shared/primitives'
import { images, siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send us a few details about your shipment and we’ll get back to you.',
}

export default function ContactPage() {
  const c = siteConfig.company
  const details = [
    { icon: Mail, label: 'Email', value: c.email, href: `mailto:${c.email}` },
    { icon: MapPin, label: 'Headquarters', value: c.headquarters },
  ]
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Tell us what you’re shipping"
        description="Share a few details and our team will be in touch."
        image={images.contactHero}
        breadcrumbs={[{ label: 'Contact' }]}
      />
      <section className="bg-surface py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-8">
            <SectionHeading eyebrow="Contact" title="Talk to the team" description={c.supportNote} />
            <ul className="flex flex-col gap-5">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-brand text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                    {href ? (
                      <a href={href} className="break-all font-semibold text-navy hover:text-brand">{value}</a>
                    ) : (
                      <p className="font-semibold text-navy">{value}</p>
                    )}
                  </div>
                </li>
              ))}
              <li className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-brand text-white">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business hours</p>
                  {c.businessHours.map((h) => (
                    <p key={h.days} className="text-sm text-navy">
                      <span className="font-semibold">{h.days}:</span> {h.hours}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
          <ContactForm />
        </Container>
      </section>
    </>
  )
}
