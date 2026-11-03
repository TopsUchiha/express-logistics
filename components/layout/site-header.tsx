'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { navigation } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow',
        scrolled ? 'shadow-[0_2px_20px_rgba(11,26,43,0.12)]' : 'border-b border-border',
      )}
    >
      <div className="flex h-18 items-stretch md:h-20">
        <div className="flex items-center pr-6 pl-[max(1rem,calc((100vw-80rem)/2+1rem))] md:pr-10">
          <Logo />
        </div>

        <div className="mx-auto flex flex-1 items-center justify-end gap-6 pr-[max(1rem,calc((100vw-80rem)/2+1rem))] pl-4">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) =>
                'children' in item ? (
                  <li key={item.href}>
                    <ServicesDropdown item={item} pathname={pathname} />
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                      className={cn(
                        'relative inline-flex h-10 items-center px-3 text-[13px] font-bold uppercase tracking-wider transition-colors hover:text-brand',
                        isActive(pathname, item.href) ? 'text-brand' : 'text-navy',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <Link
            href="/contact"
            className="hidden h-11 items-center rounded-sm bg-navy px-5 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand md:inline-flex"
          >
            Get a Quote
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border text-navy lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && <MobileNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />}
    </header>
  )
}

type NavWithChildren = Extract<(typeof navigation)[number], { children: unknown }>

function ServicesDropdown({ item, pathname }: { item: NavWithChildren; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const active =
    isActive(pathname, item.href) || item.children.some((c) => isActive(pathname, c.href))

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        ref.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex h-10 items-center gap-1 px-3 text-[13px] font-bold uppercase tracking-wider transition-colors hover:text-brand',
          active ? 'text-brand' : 'text-navy',
        )}
      >
        {item.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <div
        id={menuId}
        className={cn(
          'absolute left-0 top-full w-64 pt-3 transition-all',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
        )}
      >
        <ul className="overflow-hidden rounded-sm border-t-2 border-brand bg-white py-2 shadow-xl">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={pathname === child.href ? 'page' : undefined}
                className={cn(
                  'block px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface hover:text-brand',
                  pathname === child.href ? 'text-brand' : 'text-foreground',
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MobileNav({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  return (
    <nav
      id="mobile-nav"
      aria-label="Mobile"
      onClick={(e) => { if ((e.target as HTMLElement).closest('a')) onNavigate() }}
      className="fixed inset-x-0 bottom-0 top-18 overflow-y-auto border-t border-border bg-white md:top-20 lg:hidden"
    >
      <ul className="flex flex-col px-4 py-4">
        {navigation.map((item) =>
          'children' in item ? (
            <li key={item.href} className="border-b border-border">
              <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-sm font-bold uppercase tracking-wider text-navy"
                aria-expanded={servicesOpen}
                aria-controls="mobile-services"
                onClick={() => setServicesOpen((v) => !v)}
              >
                {item.label}
                <ChevronDown className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} aria-hidden="true" />
              </button>
              {servicesOpen && (
                <ul id="mobile-services" className="pb-3">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={cn(
                          'block py-2.5 pl-4 text-sm',
                          pathname === child.href ? 'font-semibold text-brand' : 'text-muted-foreground',
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li key={item.href} className="border-b border-border">
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                className={cn(
                  'block py-4 text-sm font-bold uppercase tracking-wider',
                  isActive(pathname, item.href) ? 'text-brand' : 'text-navy',
                )}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
      <div className="flex flex-col gap-3 px-4 pb-8">
        <Link
          href="/track"
          className="inline-flex h-12 items-center justify-center rounded-sm bg-brand text-sm font-bold uppercase tracking-wider text-white"
        >
          Track Shipment
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center justify-center rounded-sm bg-navy text-sm font-bold uppercase tracking-wider text-white"
        >
          Get a Quote
        </Link>
      </div>
    </nav>
  )
}
