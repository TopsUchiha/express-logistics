import { LogOut } from 'lucide-react'
import { logout } from '@/app/admin/actions'
import { AdminNav, type AdminNavItem } from '@/components/admin/admin-nav'
import { Logo } from '@/components/layout/logo'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q } from '@/lib/db'

export async function PanelShell({ admin, children }: { admin: { email: string }; children: React.ReactNode }) {
  const [c] = await q(
    `select (select count(*)::int from conversations where admin_unread > 0) as chats,
            (select count(*)::int from contact_messages where status = 'NEW') as enquiries`,
  )
  const items: AdminNavItem[] = [
    { href: ADMIN_BASE, label: 'Dashboard', icon: 'dashboard', exact: true },
    { href: `${ADMIN_BASE}/shipments`, label: 'Shipments', icon: 'shipments' },
    { href: `${ADMIN_BASE}/inbox`, label: 'Chats', icon: 'chats', badge: c.chats },
    { href: `${ADMIN_BASE}/enquiries`, label: 'Enquiries', icon: 'enquiries', badge: c.enquiries },
  ]
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const initial = (admin.email[0] ?? 'A').toUpperCase()

  return (
    <div className="min-h-dvh bg-surface lg:flex print:block print:bg-white">
      <aside className="bg-navy text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col print:hidden">
        <div className="h-1 bg-brand" />
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:py-6">
          <div className="flex flex-col gap-2">
            <Logo onDark />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Admin panel</span>
          </div>
          <form action={logout} className="lg:hidden">
            <button
              type="submit"
              aria-label="Sign out"
              className="grid h-10 w-10 place-items-center rounded-md border border-white/20 text-white/80 hover:border-brand hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="px-3 pb-3 lg:flex-1 lg:overflow-y-auto lg:py-2">
          <AdminNav items={items} />
        </div>

        <div className="hidden border-t border-white/10 p-4 lg:block">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-black text-white"
            >
              {initial}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Signed in as</p>
              <p className="truncate text-sm font-semibold text-white" title={admin.email}>
                {admin.email}
              </p>
            </div>
          </div>
          <form action={logout} className="mt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:border-brand hover:bg-brand hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="hidden items-center justify-between border-b border-border bg-white px-8 py-4 lg:flex print:hidden">
          <p className="text-sm font-semibold text-navy">{today}</p>
          <p className="text-xs text-muted-foreground">Manage shipments, chats and enquiries</p>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:max-w-none print:p-0">{children}</div>
      </div>
    </div>
  )
}
