import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

/**
 * The company logo on a white plate, so it reads on both the orange header and the navy footer.
 * Without a logo image it falls back to a text mark.
 */
export function Logo({ className }: { className?: string; tone?: 'light' | 'dark' }) {
  const { name, logo, logoSize, logoMark } = siteConfig.company
  return (
    <Link
      href="/"
      className={cn('inline-flex w-fit items-center rounded-sm bg-white px-3 py-1.5 shadow-sm', className)}
      aria-label={`${name} home`}
    >
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={logoSize.width}
          height={logoSize.height}
          priority
          sizes="160px"
          className="h-10 w-auto sm:h-12"
        />
      ) : (
        <span className="text-sm font-black uppercase tracking-wide text-navy">{logoMark} {name}</span>
      )}
    </Link>
  )
}
