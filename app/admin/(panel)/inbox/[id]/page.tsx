import Link from 'next/link'
import { notFound } from 'next/navigation'
import { replyToChat, setConversationStatus } from '../../../actions'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q, isId } from '@/lib/db'
import { STATUS_LABELS, fmt } from '@/lib/status'
import { AutoRefresh, MarkRead } from '@/components/admin/client-bits'
import { ui } from '@/components/admin/ui'

export default async function Thread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isId(id)) notFound()
  const [c] = await q(
    `select c.id, c.status, c.admin_unread, c.contact_email, s.id as shipment_id, s.tracking_number, s.status as shipment_status, s.sender_name, s.receiver_name, s.origin, s.destination
     from conversations c join shipments s on s.id = c.shipment_id where c.id = $1`,
    [id],
  )
  if (!c) notFound()
  const messages = await q('select id, sender, body, created_at from messages where conversation_id = $1 order by id', [id])

  return (
    <div className="flex flex-col gap-5">
      <AutoRefresh seconds={6} />
      <MarkRead id={id} hasUnread={c.admin_unread > 0} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`${ADMIN_BASE}/inbox`} className="text-sm font-semibold text-brand hover:underline">← All chats</Link>
          <h1 className={`${ui.h1} mt-1`}>{c.tracking_number}</h1>
          <p className="text-sm text-muted-foreground">
            {c.contact_email} · {c.sender_name} → {c.receiver_name} · {c.origin} → {c.destination} · {STATUS_LABELS[c.shipment_status] ?? c.shipment_status}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`${ADMIN_BASE}/shipments/${c.shipment_id}`} className={ui.secondary}>Open shipment</Link>
          <form action={setConversationStatus}>
            <input type="hidden" name="conversation_id" value={id} />
            <input type="hidden" name="status" value={c.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED'} />
            <button className={ui.secondary}>{c.status === 'RESOLVED' ? 'Reopen' : 'Mark resolved'}</button>
          </form>
        </div>
      </div>

      <section className={`${ui.card} flex flex-col gap-3`} aria-label="Conversation">
        {messages.map((m) =>
          m.sender === 'SYSTEM' ? (
            <p key={m.id} className="self-center text-xs text-muted-foreground">{m.body} · {fmt(m.created_at)}</p>
          ) : (
            <div key={m.id} className={`max-w-[80%] whitespace-pre-wrap break-words rounded-sm px-3 py-2 text-sm ${m.sender === 'AGENT' ? 'self-end bg-brand text-white' : 'self-start border border-border bg-surface text-navy'}`}>
              <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wider opacity-70">{m.sender === 'AGENT' ? 'You' : 'Customer'} · {fmt(m.created_at)}</span>
              {m.body}
            </div>
          ),
        )}
      </section>

      <form action={replyToChat} className={`${ui.card} flex flex-col gap-3`}>
        <input type="hidden" name="conversation_id" value={id} />
        <label className={ui.label}>Reply<textarea name="body" required rows={3} maxLength={1000} className={ui.textarea} /></label>
        <div><button className={ui.primary}>Send reply</button></div>
      </form>
    </div>
  )
}
