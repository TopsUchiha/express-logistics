import Link from 'next/link'
import { Clock, Mail, MapPin } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { services } from '@/lib/services-data'
import { Logo } from './logo'
import { SocialIcon } from './social-icon'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Service Comparison', href: '/service-comparison' },
  { label: 'Track & Trace', href: '/track' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export function SiteFooter() {
  const { company } = siteConfig
  return (
    <footer className="bg-navy text-white/75">
      <div className="h-1 bg-brand" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-5">
          <Logo tone="light" />
          <p className="text-sm leading-relaxed">{company.description}</p>
          <ul className="flex gap-2" aria-label="Social media">
            {company.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-sm bg-white/10 text-white transition-colors hover:bg-brand"
                >
                  <SocialIcon name={s.icon} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn title="Quick Links">
          {quickLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm transition-colors hover:text-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Our Services">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="text-sm transition-colors hover:text-brand">
                {s.shortTitle}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="flex gap-3 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <span>{company.headquarters}</span>
          </li>
          <li>
            <a href={`mailto:${company.email}`} className="flex gap-3 text-sm break-all hover:text-brand">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              {company.email}
            </a>
          </li>
          <li className="flex gap-3 text-sm">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <span>
              {company.businessHours[0].days}
              <br />
              {company.businessHours[0].hours}
            </span>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs sm:flex-row lg:px-8">
          <p>
            {'© '}
            {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/terms-and-conditions" className="hover:text-brand">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-brand">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">{title}</h2>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  )
}
