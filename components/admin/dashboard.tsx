import Link from 'next/link'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q } from '@/lib/db'
import { STATUS_LABELS, fmt } from '@/lib/status'
import { ui } from '@/components/admin/ui'

export async function Dashboard() {
  const [n] = await q(
    `select (select count(*)::int from shipments) as total,
            (select count(*)::int from shipments where status not in ('DELIVERED','CANCELLED')) as active,
            (select count(*)::int from conversations where admin_unread > 0) as chats,
            (select count(*)::int from contact_messages where status = 'NEW') as enquiries`,
  )
  const recent = await q('select id, tracking_number, receiver_name, origin, destination, status, created_at from shipments order by created_at desc limit 8')
  const stats = [
    ['Shipments', n.total, '/shipments'],
    ['Active', n.active, '/shipments'],
    ['Chats with unread messages', n.chats, '/inbox'],
    ['New enquiries', n.enquiries, '/enquiries'],
  ] as const
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={ui.h1}>Dashboard</h1>
        <Link href={`${ADMIN_BASE}/shipments/new`} className={ui.primary}>New shipment</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, href]) => (
          <Link key={label} href={ADMIN_BASE + href} className={`${ui.card} hover:border-brand`}>
            <p className="text-3xl font-black text-navy">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>
      <section className={`${ui.card} overflow-x-auto p-0`}>
        <h2 className={`${ui.h2} px-4 pt-4`}>Recent shipments</h2>
        <table className="mt-2 w-full min-w-[640px]">
          <thead><tr><th className={ui.th}>Tracking</th><th className={ui.th}>Receiver</th><th className={ui.th}>Route</th><th className={ui.th}>Status</th><th className={ui.th}>Created</th></tr></thead>
          <tbody>
            {recent.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">No shipments yet.</td></tr>}
            {recent.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className={ui.td}><Link className="font-bold text-brand hover:underline" href={`${ADMIN_BASE}/shipments/${s.id}`}>{s.tracking_number}</Link></td>
                <td className={ui.td}>{s.receiver_name}</td>
                <td className={ui.td}>{s.origin} → {s.destination}</td>
                <td className={ui.td}>{STATUS_LABELS[s.status] ?? s.status}</td>
                <td className={ui.td}>{fmt(s.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
