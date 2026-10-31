'use client'

import { useActionState } from 'react'
import { createShipment, type FormState } from '@/app/admin/actions'
import { SERVICES } from '@/lib/status'
import { ui } from './ui'

function Field({ name, label, state, type = 'text', required, wide, placeholder }: { name: string; label: string; state: FormState; type?: string; required?: boolean; wide?: boolean; placeholder?: string }) {
  return (
    <label className={`${ui.label} ${wide ? 'sm:col-span-2' : ''}`}>
      {label}
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={state.values?.[name] ?? ''} className={ui.input} />
    </label>
  )
}

export function ShipmentForm() {
  const [state, action, pending] = useActionState(createShipment, {} as FormState)
  return (
    // key remounts the form after an error so every field (including the select) gets its saved value back.
    <form key={state.n ?? 0} action={action} className="flex flex-col gap-6">
      {state.error && <p role="alert" className="rounded-sm border border-destructive/40 bg-white p-3 text-sm font-semibold text-destructive">{state.error}</p>}

      <section className={ui.card}>
        <h2 className={ui.h2}>Shipment</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={ui.label}>Service
            <select name="service" required defaultValue={state.values?.service ?? ''} className={ui.input}>
              <option value="" disabled>Choose a service</option>
              {SERVICES.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
            </select>
          </label>
          <Field name="service_detail" label="Service detail (optional)" state={state} placeholder="e.g. FCL 40ft" />
          <Field name="origin" label="Origin (City, Country)" state={state} required placeholder="Shanghai, China" />
          <Field name="destination" label="Destination (City, Country)" state={state} required placeholder="Douala, Cameroon" />
          <Field name="eta" label="Estimated delivery" state={state} type="date" />
          <Field name="total_freight" label="Total freight" state={state} />
          <Field name="product" label="Product" state={state} />
          <Field name="quantity" label="Quantity" state={state} />
        </div>
      </section>

      {(['sender', 'receiver'] as const).map((who) => (
        <section key={who} className={ui.card}>
          <h2 className={ui.h2}>{who === 'sender' ? 'Sender' : 'Receiver'}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field name={`${who}_name`} label="Name" state={state} required />
            <Field name={`${who}_email`} label="Email (used to verify chat)" state={state} type="email" />
            <Field name={`${who}_phone`} label="Phone" state={state} />
            <Field name={`${who}_address`} label="Address" state={state} />
          </div>
        </section>
      ))}

      <section className={ui.card}>
        <h2 className={ui.h2}>Packages (optional)</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mt-4 grid gap-3 sm:grid-cols-7">
            {(['qty', 'type', 'description', 'length', 'width', 'height', 'weight'] as const).map((f) => (
              <label key={f} className={ui.label}>
                {f === 'qty' ? 'Qty' : f === 'type' ? 'Piece type' : f === 'description' ? 'Description' : f === 'weight' ? 'Weight kg' : `${f} cm`}
                <input name={`pk${i}_${f}`} defaultValue={state.values?.[`pk${i}_${f}`] ?? ''} className={ui.input} />
              </label>
            ))}
          </div>
        ))}
        <label className={`${ui.label} mt-4`}>Comment
          <textarea name="comment" rows={3} defaultValue={state.values?.comment ?? ''} className={ui.textarea} />
        </label>
      </section>

      <div><button type="submit" disabled={pending} className={ui.primary}>{pending ? 'Creating…' : 'Create shipment'}</button></div>
    </form>
  )
}
