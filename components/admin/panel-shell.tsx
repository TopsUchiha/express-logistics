import Link from 'next/link'
import { logout } from '@/app/admin/actions'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q } from '@/lib/db'
import { siteConfig } from '@/lib/site-config'

export async function PanelShell({ admin, children }: { admin: { email: string }; children: React.ReactNode }) {
  const [c] = await q(
    `select (select count(*)::int from conversations where admin_unread > 0) as chats,
            (select count(*)::int from contact_messages where status = 'NEW') as enquiries`,
  )
  const links = [
    { href: '', label: 'Dashboard' },
    { href: '/shipments', label: 'Shipments' },
    { href: '/inbox', label: 'Chats', badge: c.chats },
    { href: '/enquiries', label: 'Enquiries', badge: c.enquiries },
  ]
  return (
    <div className="min-h-dvh">
      <header className="bg-navy text-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-sm font-extrabold uppercase tracking-wider">{siteConfig.company.name} admin</span>
            <nav aria-label="Admin" className="flex flex-wrap gap-4 text-sm font-semibold">
              {links.map((l) => (
                <Link key={l.label} href={ADMIN_BASE + l.href} className="hover:text-brand">
                  {l.label}
                  {l.badge ? <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">{l.badge}</span> : null}
                </Link>
              ))}
            </nav>
          </div>
          <form action={logout} className="flex items-center gap-3 text-xs">
            <span className="hidden text-white/70 sm:inline">{admin.email}</span>
            <button type="submit" className="rounded-sm border border-white/30 px-3 py-1.5 font-bold uppercase tracking-wider hover:border-brand">Sign out</button>
          </form>
        </div>
      </header>
      <div className={`mx-auto max-w-6xl px-4 py-8 print:p-0`}>{children}</div>
    </div>
  )
}
