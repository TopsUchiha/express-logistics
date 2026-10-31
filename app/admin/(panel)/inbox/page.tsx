import Link from 'next/link'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q } from '@/lib/db'
import { fmt } from '@/lib/status'
import { AutoRefresh } from '@/components/admin/client-bits'
import { ui } from '@/components/admin/ui'

export default async function Inbox() {
  const rows = await q(
    `select c.id, c.status, c.admin_unread, c.last_message_at, c.contact_email, s.tracking_number, s.receiver_name, s.sender_name,
            (select body from messages m where m.conversation_id = c.id and m.sender <> 'SYSTEM' order by m.id desc limit 1) as last_body
     from conversations c join shipments s on s.id = c.shipment_id
     order by c.admin_unread desc, c.last_message_at desc limit 100`,
  )
  return (
    <div className="flex flex-col gap-5">
      <AutoRefresh />
      <h1 className={ui.h1}>Customer chats</h1>
      <section className={`${ui.card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[640px]">
          <thead><tr><th className={ui.th}>Shipment</th><th className={ui.th}>Customer</th><th className={ui.th}>Last message</th><th className={ui.th}>Status</th><th className={ui.th}>Updated</th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">No chats yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className={ui.td}>
                  <Link className="font-bold text-brand hover:underline" href={`${ADMIN_BASE}/inbox/${r.id}`}>{r.tracking_number}</Link>
                  {r.admin_unread > 0 && <span className="ml-2 rounded-full bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">{r.admin_unread} new</span>}
                </td>
                <td className={ui.td}>{r.contact_email}</td>
                <td className={`${ui.td} max-w-xs truncate`}>{r.last_body ?? '-'}</td>
                <td className={ui.td}>{r.status === 'RESOLVED' ? 'Resolved' : 'Open'}</td>
                <td className={ui.td}>{fmt(r.last_message_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
