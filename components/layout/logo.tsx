import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

/**
 * The company logo, drawn straight on the page (no box behind it).
 * `onDark` swaps in the version with a white word mark for the navy footer.
 */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const { name, logo, logoDark, logoSize, logoMark } = siteConfig.company
  const src = onDark ? (logoDark ?? logo) : logo
  return (
    <Link href="/" className={cn('inline-flex items-center', className)} aria-label={`${name} home`}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={logoSize.width}
          height={logoSize.height}
          priority={!onDark}
          sizes="220px"
          className="h-11 w-auto md:h-14"
        />
      ) : (
        <span className={cn('text-sm font-black uppercase tracking-wide', onDark ? 'text-white' : 'text-navy')}>
          {logoMark} {name}
        </span>
      )}
    </Link>
  )
}
