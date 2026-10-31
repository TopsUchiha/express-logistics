import Link from 'next/link'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q } from '@/lib/db'
import { STATUS_LABELS, fmt } from '@/lib/status'
import { ui } from '@/components/admin/ui'

export default async function Shipments({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const term = ((await searchParams).q ?? '').trim().slice(0, 60)
  const like = `%${term.replace(/[%_\\]/g, '\\$&')}%`
  const rows = await q(
    `select id, tracking_number, sender_name, receiver_name, origin, destination, status, created_at from shipments
     where $1 = '' or tracking_number ilike $2 or sender_name ilike $2 or receiver_name ilike $2
     order by created_at desc limit 100`,
    [term, like],
  )
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={ui.h1}>Shipments</h1>
        <Link href={`${ADMIN_BASE}/shipments/new`} className={ui.primary}>New shipment</Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={term} placeholder="Search tracking number or name" className={ui.input} maxLength={60} />
        <button className={ui.secondary}>Search</button>
      </form>
      <section className={`${ui.card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[760px]">
          <thead><tr><th className={ui.th}>Tracking</th><th className={ui.th}>Sender</th><th className={ui.th}>Receiver</th><th className={ui.th}>Route</th><th className={ui.th}>Status</th><th className={ui.th}>Created</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">Nothing found.</td></tr>}
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className={ui.td}><Link className="font-bold text-brand hover:underline" href={`${ADMIN_BASE}/shipments/${s.id}`}>{s.tracking_number}</Link></td>
                <td className={ui.td}>{s.sender_name}</td>
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
