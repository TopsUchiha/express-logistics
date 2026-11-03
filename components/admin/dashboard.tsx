import Link from 'next/link'
import { ArrowUpRight, Inbox, MessagesSquare, Package, Plus, Truck } from 'lucide-react'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q } from '@/lib/db'
import { STATUS_LABELS, fmt } from '@/lib/status'
import { ui } from '@/components/admin/ui'

function statusClass(status: string) {
  if (status === 'DELIVERED') return 'bg-emerald-100 text-emerald-700'
  if (status === 'CANCELLED') return 'bg-red-100 text-red-700'
  return 'bg-accent text-accent-foreground'
}

export async function Dashboard() {
  const [n] = await q(
    `select (select count(*)::int from shipments) as total,
            (select count(*)::int from shipments where status not in ('DELIVERED','CANCELLED')) as active,
            (select count(*)::int from conversations where admin_unread > 0) as chats,
            (select count(*)::int from contact_messages where status = 'NEW') as enquiries`,
  )
  const recent = await q('select id, tracking_number, receiver_name, origin, destination, status, created_at from shipments order by created_at desc limit 8')

  const stats = [
    { label: 'Total shipments', value: n.total, href: '/shipments', icon: Package, tint: 'bg-brand/10 text-brand', bar: 'bg-brand' },
    { label: 'Active shipments', value: n.active, href: '/shipments', icon: Truck, tint: 'bg-sky-100 text-sky-700', bar: 'bg-sky-500' },
    { label: 'Chats with unread messages', value: n.chats, href: '/inbox', icon: MessagesSquare, tint: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' },
    { label: 'New enquiries', value: n.enquiries, href: '/enquiries', icon: Inbox, tint: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' },
  ]
  const actions = [
    { label: 'Create a shipment', href: '/shipments/new', icon: Plus, count: 0 },
    { label: 'Reply to chats', href: '/inbox', icon: MessagesSquare, count: n.chats },
    { label: 'Read enquiries', href: '/enquiries', icon: Inbox, count: n.enquiries },
  ]

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-md bg-navy px-6 py-7 text-white shadow-sm sm:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/25 blur-2xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-40 h-40 w-40 rounded-full bg-white/5 blur-xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Overview</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-white/70">
              {n.active} active of {n.total} shipments &middot; {n.enquiries} new enquiries
            </p>
          </div>
          <Link href={`${ADMIN_BASE}/shipments/new`} className={ui.primary}>
            <Plus className="mr-2 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
            New shipment
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon, tint, bar }) => (
          <Link
            key={label}
            href={ADMIN_BASE + href}
            className="group relative overflow-hidden rounded-md border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
          >
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${bar}`} />
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-md ${tint}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-brand" aria-hidden="true" />
            </div>
            <p className="mt-4 text-3xl font-black text-navy">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-md border border-border bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-base font-extrabold text-navy">Recent shipments</h2>
            <Link href={`${ADMIN_BASE}/shipments`} className="text-xs font-bold uppercase tracking-wider text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-surface">
                <tr>
                  <th className={ui.th}>Tracking</th>
                  <th className={ui.th}>Receiver</th>
                  <th className={ui.th}>Route</th>
                  <th className={ui.th}>Status</th>
                  <th className={ui.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No shipments yet.
                    </td>
                  </tr>
                )}
                {recent.map((s) => (
                  <tr key={s.id} className="border-t border-border transition-colors hover:bg-surface/70">
                    <td className={ui.td}>
                      <Link className="font-bold text-brand hover:underline" href={`${ADMIN_BASE}/shipments/${s.id}`}>
                        {s.tracking_number}
                      </Link>
                    </td>
                    <td className={ui.td}>{s.receiver_name}</td>
                    <td className={ui.td}>
                      {s.origin} → {s.destination}
                    </td>
                    <td className={ui.td}>
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(s.status)}`}>
                        {STATUS_LABELS[s.status] ?? s.status}
                      </span>
                    </td>
                    <td className={ui.td}>{fmt(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="h-fit rounded-md border border-border bg-white shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-extrabold text-navy">Quick actions</h2>
          </div>
          <ul className="flex flex-col gap-2 p-4">
            {actions.map(({ label, href, icon: Icon, count }) => (
              <li key={label}>
                <Link
                  href={ADMIN_BASE + href}
                  className="flex items-center gap-3 rounded-md border border-border px-3 py-3 text-sm font-semibold text-navy transition-colors hover:border-brand hover:bg-accent"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-navy text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="flex-1">{label}</span>
                  {count > 0 ? (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">{count}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
