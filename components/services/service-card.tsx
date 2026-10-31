import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/lib/services-data'
import { ServiceIcon } from '@/components/shared/primitives'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-sm bg-white shadow-[0_4px_24px_rgba(11,26,43,0.08)] transition-shadow hover:shadow-[0_12px_40px_rgba(11,26,43,0.16)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="relative flex flex-1 flex-col gap-3 px-6 pt-10 pb-6">
        <span className="absolute -top-7 left-6 grid h-14 w-14 place-items-center rounded-sm bg-brand text-white shadow-lg transition-colors group-hover:bg-navy">
          <ServiceIcon name={service.icon} className="h-7 w-7" />
        </span>
        <h3 className="text-xl font-extrabold text-navy">{service.title}</h3>
        <p className="flex-1 text-[15px] leading-relaxed text-muted-foreground">{service.summary}</p>
        <Link
          href={`/services/${service.slug}`}
          className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-brand after:absolute after:inset-0"
        >
          Learn more
          <span className="sr-only"> about {service.title}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
