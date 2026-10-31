import Link from 'next/link'
import { notFound } from 'next/navigation'
import { addEvent, deleteShipment, updateShipment } from '../../../actions'
import { ADMIN_BASE } from '@/lib/admin-path'
import { q, isId } from '@/lib/db'
import { STATUSES, STATUS_LABELS, fmt } from '@/lib/status'
import { ConfirmButton } from '@/components/admin/client-bits'
import { ui } from '@/components/admin/ui'

const ERRORS: Record<string, string> = {
  location: 'We couldn’t find that location on the map. Try "City, Country".',
  email: 'One of the email addresses looks wrong.',
}

function Input({ name, label, value, type = 'text' }: { name: string; label: string; value?: string | null; type?: string }) {
  return <label className={ui.label}>{label}<input name={name} type={type} defaultValue={value ?? ''} className={ui.input} /></label>
}

export default async function ShipmentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { id } = await params
  const sp = await searchParams
  if (!isId(id)) notFound()
  const [s] = await q('select * from shipments where id = $1', [id])
  if (!s) notFound()
  const events = await q('select status, location, description, created_at from shipment_events where shipment_id = $1 order by created_at desc', [id])
  const [conv] = await q('select id, admin_unread from conversations where shipment_id = $1', [id])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`${ADMIN_BASE}/shipments`} className="text-sm font-semibold text-brand hover:underline">← All shipments</Link>
          <h1 className={`${ui.h1} mt-1`}>{s.tracking_number}</h1>
          <p className="text-sm text-muted-foreground">{s.service} · {s.origin} → {s.destination} · <strong className="text-navy">{STATUS_LABELS[s.status] ?? s.status}</strong></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`${ADMIN_BASE}/shipments/${id}/receipt`} className={ui.secondary}>Receipt</Link>
          {conv && <Link href={`${ADMIN_BASE}/inbox/${conv.id}`} className={ui.secondary}>Chat{conv.admin_unread ? ` (${conv.admin_unread})` : ''}</Link>}
          <Link href={`/track`} className={ui.secondary} target="_blank" rel="noopener noreferrer">Public page</Link>
        </div>
      </div>

      {sp.error && <p role="alert" className="rounded-sm border border-destructive/40 bg-white p-3 text-sm font-semibold text-destructive">{ERRORS[sp.error] ?? 'Something went wrong.'}</p>}
      {sp.saved && <p role="status" className="rounded-sm border border-brand/40 bg-white p-3 text-sm font-semibold text-navy">Saved.</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={ui.card}>
          <h2 className={ui.h2}>Add an update</h2>
          <form action={addEvent} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="id" value={id} />
            <label className={ui.label}>Status
              <select name="status" defaultValue={s.status} className={ui.input}>{STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}</select>
            </label>
            <Input name="location" label="Current location (City, Country)" value={s.current_location} />
            <label className={ui.label}>Note shown on the timeline<textarea name="description" rows={2} maxLength={300} className={ui.textarea} /></label>
            <div><button className={ui.primary}>Save update</button></div>
          </form>
        </section>

        <section className={ui.card}>
          <h2 className={ui.h2}>Timeline</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {events.map((e, i) => (
              <li key={i} className="border-l-2 border-brand pl-3">
                <p className="text-[11px] font-bold text-brand">{fmt(e.created_at)}</p>
                <p className="text-sm font-extrabold text-navy">{STATUS_LABELS[e.status] ?? e.status}</p>
                <p className="text-[13px] text-muted-foreground">{e.location}{e.description ? ` · ${e.description}` : ''}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className={ui.card}>
        <h2 className={ui.h2}>Details</h2>
        <form action={updateShipment} className="mt-4 flex flex-col gap-4">
          <input type="hidden" name="id" value={id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="sender_name" label="Sender name" value={s.sender_name} />
            <Input name="sender_email" label="Sender email" value={s.sender_email} type="email" />
            <Input name="sender_phone" label="Sender phone" value={s.sender_phone} />
            <Input name="sender_address" label="Sender address" value={s.sender_address} />
            <Input name="receiver_name" label="Receiver name" value={s.receiver_name} />
            <Input name="receiver_email" label="Receiver email" value={s.receiver_email} type="email" />
            <Input name="receiver_phone" label="Receiver phone" value={s.receiver_phone} />
            <Input name="receiver_address" label="Receiver address" value={s.receiver_address} />
            <Input name="eta" label="Estimated delivery" value={s.eta} type="date" />
            <Input name="total_freight" label="Total freight" value={s.total_freight} />
            <Input name="product" label="Product" value={s.product} />
            <Input name="quantity" label="Quantity" value={s.quantity} />
          </div>
          <label className={ui.label}>Comment<textarea name="comment" rows={3} defaultValue={s.comment ?? ''} className={ui.textarea} /></label>
          <div><button className={ui.primary}>Save details</button></div>
        </form>
      </section>

      <form action={deleteShipment}>
        <input type="hidden" name="id" value={id} />
        <ConfirmButton label="Delete shipment" message="Delete this shipment, its timeline and its chat? This cannot be undone." />
      </form>
    </div>
  )
}
