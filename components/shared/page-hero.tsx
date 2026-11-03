import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Container, Eyebrow } from './primitives'

export function PageHero({
  title,
  description,
  eyebrow,
  image,
  imageAlt = '',
  imagePosition,
  breadcrumbs = [],
  children,
}: {
  title: string
  description?: string
  eyebrow?: string
  image: string
  imageAlt?: string
  imagePosition?: string
  breadcrumbs?: { label: string; href?: string }[]
  children?: React.ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-20 object-cover" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
      {/* keeps the transparent nav readable over bright photos */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-navy/70 to-transparent" />
      <Container className="pb-20 pt-40 sm:pb-24 sm:pt-44 lg:pb-28 lg:pt-48">
        <div className="flex max-w-3xl flex-col gap-5">
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                <li>
                  <Link href="/" className="hover:text-brand">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((b) => (
                  <li key={b.label} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    {b.href ? (
                      <Link href={b.href} className="hover:text-brand">
                        {b.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-brand">
                        {b.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">{title}</h1>
          {description && <p className="max-w-2xl text-pretty text-lg leading-relaxed text-white/80">{description}</p>}
          {children}
        </div>
      </Container>
    </section>
  )
}
