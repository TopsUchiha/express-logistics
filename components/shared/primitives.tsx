import Link from 'next/link'
import { ArrowRight, FileText, PawPrint, Plane, Ship, Truck, Warehouse } from 'lucide-react'
import type { ServiceIcon as ServiceIconName } from '@/lib/services-data'
import { cn } from '@/lib/utils'

type CtaVariant = 'primary' | 'dark' | 'outline-light' | 'outline-dark'

const ctaStyles: Record<CtaVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  dark: 'bg-navy text-white hover:bg-navy-light',
  'outline-light': 'border-2 border-white text-white hover:bg-white hover:text-navy',
  'outline-dark': 'border-2 border-navy text-navy hover:bg-navy hover:text-white',
}

export function CtaButton({
  href,
  children,
  variant = 'primary',
  className,
  arrow = true,
}: {
  href: string
  children: React.ReactNode
  variant?: CtaVariant
  className?: string
  arrow?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-12 items-center justify-center gap-2 rounded-sm px-7 text-[13px] font-bold uppercase tracking-wider transition-colors',
        ctaStyles[variant],
        className,
      )}
    >
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
    </Link>
  )
}

export function Eyebrow({ children, className, tone = 'brand' }: { children: React.ReactNode; className?: string; tone?: 'brand' | 'light' }) {
  return (
    <p
      className={cn(
        'inline-flex items-center text-xs font-bold uppercase tracking-[0.2em]',
        tone === 'brand' ? 'text-brand' : 'text-white/80',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={cn('flex flex-col gap-4', align === 'center' && 'mx-auto items-center text-center', 'max-w-3xl', className)}>
      {eyebrow && <Eyebrow tone={tone === 'light' ? 'light' : 'brand'}>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          'text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl',
          tone === 'dark' ? 'text-navy' : 'text-white',
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn('text-pretty text-base leading-relaxed sm:text-lg', tone === 'dark' ? 'text-muted-foreground' : 'text-white/75')}>
          {description}
        </p>
      )}
    </div>
  )
}

const iconMap = { plane: Plane, ship: Ship, truck: Truck, warehouse: Warehouse, file: FileText, paw: PawPrint }

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const Icon = iconMap[name] ?? Ship
  return <Icon className={className} aria-hidden="true" />
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 lg:px-8', className)}>{children}</div>
}
