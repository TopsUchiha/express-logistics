'use server'

import { timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { ADMIN_BASE } from '@/lib/admin-path'
import { createSession, destroySession, requireAdmin } from '@/lib/auth'
import { q, isId } from '@/lib/db'
import { geocode } from '@/lib/geo'
import { sendMail } from '@/lib/mail'
import { limited } from '@/lib/rate-limit'
import { isEmail, str } from '@/lib/security'
import { siteConfig } from '@/lib/site-config'
import { SERVICES, STATUSES } from '@/lib/status'
import { newTrackingNumber } from '@/lib/tracking/generate'

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10)
const go = (path: string): never => redirect(ADMIN_BASE + path)
const field = (f: FormData, k: string, max = 200) => str(f.get(k), max)

async function ip() {
  const h = await headers()
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

/* ---------- sign in ---------- */

export async function login(form: FormData) {
  const email = field(form, 'email', 254).toLowerCase()
  const password = String(form.get('password') ?? '').slice(0, 200)
  if ((await limited(`login:ip:${await ip()}`, 20, 900)) || (await limited(`login:email:${email}`, 6, 900))) go('?error=limit')
  const [u] = await q('select id, password_hash from admin_users where email = $1', [email])
  const ok = await bcrypt.compare(password, u?.password_hash ?? DUMMY_HASH)
  if (!u || !ok) go('?error=1')
  await createSession(u.id)
  go('')
}

export async function setupAdmin(form: FormData) {
  const key = process.env.ADMIN_SETUP_KEY ?? ''
  const given = String(form.get('setup_key') ?? '')
  const email = field(form, 'email', 254).toLowerCase()
  const password = String(form.get('password') ?? '').slice(0, 200)
  if (await limited(`setup:ip:${await ip()}`, 10, 900)) go('?error=limit')
  const [{ count }] = await q('select count(*)::int as count from admin_users')
  const sameKey = key.length >= 16 && given.length === key.length && timingSafeEqual(Buffer.from(given), Buffer.from(key))
  if (count > 0 || !sameKey || !isEmail(email) || password.length < 12) go('?error=setup')
  const [u] = await q('insert into admin_users(email, password_hash) values ($1,$2) returning id', [email, await bcrypt.hash(password, 12)])
  await createSession(u.id)
  go('')
}

export async function logout() {
  await destroySession()
  go('')
}

/* ---------- shipments ---------- */

export type FormState = { error?: string; values?: Record<string, string>; n?: number }

function packagesFrom(form: FormData) {
  return [1, 2, 3]
    .map((i) => ({
      qty: field(form, `pk${i}_qty`, 10), type: field(form, `pk${i}_type`, 40), description: field(form, `pk${i}_description`, 120),
      length: field(form, `pk${i}_length`, 10), width: field(form, `pk${i}_width`, 10), height: field(form, `pk${i}_height`, 10), weight: field(form, `pk${i}_weight`, 10),
    }))
    .filter((p) => Object.values(p).some(Boolean))
}

export async function createShipment(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin()
  const values: Record<string, string> = {}
  for (const [k, v] of form.entries()) if (typeof v === 'string') values[k] = v.slice(0, 300)

  const service = SERVICES.find((s) => s.label === field(form, 'service'))
  const detail = field(form, 'service_detail', 60)
  const [origin, destination] = [field(form, 'origin', 150), field(form, 'destination', 150)]
  const senderEmail = field(form, 'sender_email', 254).toLowerCase()
  const receiverEmail = field(form, 'receiver_email', 254).toLowerCase()
  const eta = /^\d{4}-\d{2}-\d{2}$/.test(field(form, 'eta', 10)) ? field(form, 'eta', 10) : null

  const fail = (error: string): FormState => ({ error, values, n: Date.now() })
  if (!service) return fail('Choose a service.')
  if (!field(form, 'sender_name') || !field(form, 'receiver_name')) return fail('Sender and receiver names are required.')
  if ((senderEmail && !isEmail(senderEmail)) || (receiverEmail && !isEmail(receiverEmail))) return fail('One of the email addresses looks wrong.')
  if (!origin || !destination) return fail('Origin and destination are required, written as "City, Country".')

  const [o, d] = await Promise.all([geocode(origin), geocode(destination)])
  if (!o) return fail(`We couldn’t find "${origin}" on the map. Try "City, Country".`)
  if (!d) return fail(`We couldn’t find "${destination}" on the map. Try "City, Country".`)

  const tracking = await newTrackingNumber()
  const [s] = await q(
    `insert into shipments(tracking_number, mode, service, sender_name, sender_phone, sender_email, sender_address,
       receiver_name, receiver_phone, receiver_email, receiver_address, origin, origin_lat, origin_lng, destination, dest_lat, dest_lng,
       current_location, current_lat, current_lng, eta, product, quantity, total_freight, comment, packages)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$12,$13,$14,$18,$19,$20,$21,$22,$23) returning id`,
    [
      tracking, service.mode, detail ? `${service.label} · ${detail}` : service.label,
      field(form, 'sender_name', 100), field(form, 'sender_phone', 40) || null, senderEmail || null, field(form, 'sender_address', 250) || null,
      field(form, 'receiver_name', 100), field(form, 'receiver_phone', 40) || null, receiverEmail || null, field(form, 'receiver_address', 250) || null,
      origin, o.lat, o.lng, destination, d.lat, d.lng,
      eta, field(form, 'product', 150) || null, field(form, 'quantity', 40) || null, field(form, 'total_freight', 40) || null, field(form, 'comment', 500) || null,
      JSON.stringify(packagesFrom(form)),
    ],
  )
  await q(`insert into shipment_events(shipment_id, status, location, description) values ($1,'PENDING',$2,'Shipment created')`, [s.id, origin])
  return go(`/shipments/${s.id}`)
}

export async function updateShipment(form: FormData) {
  await requireAdmin()
  const id = field(form, 'id', 40)
  if (!isId(id)) go('/shipments')
  const senderEmail = field(form, 'sender_email', 254).toLowerCase()
  const receiverEmail = field(form, 'receiver_email', 254).toLowerCase()
  if ((senderEmail && !isEmail(senderEmail)) || (receiverEmail && !isEmail(receiverEmail))) go(`/shipments/${id}?error=email`)
  const eta = /^\d{4}-\d{2}-\d{2}$/.test(field(form, 'eta', 10)) ? field(form, 'eta', 10) : null
  await q(
    `update shipments set sender_name=$2, sender_phone=$3, sender_email=$4, sender_address=$5,
       receiver_name=$6, receiver_phone=$7, receiver_email=$8, receiver_address=$9,
       eta=$10, product=$11, quantity=$12, total_freight=$13, comment=$14, updated_at=now() where id=$1`,
    [
      id, field(form, 'sender_name', 100), field(form, 'sender_phone', 40) || null, senderEmail || null, field(form, 'sender_address', 250) || null,
      field(form, 'receiver_name', 100), field(form, 'receiver_phone', 40) || null, receiverEmail || null, field(form, 'receiver_address', 250) || null,
      eta, field(form, 'product', 150) || null, field(form, 'quantity', 40) || null, field(form, 'total_freight', 40) || null, field(form, 'comment', 500) || null,
    ],
  )
  go(`/shipments/${id}?saved=1`)
}

export async function addEvent(form: FormData) {
  await requireAdmin()
  const id = field(form, 'id', 40)
  const status = field(form, 'status', 40)
  const description = field(form, 'description', 300)
  let location = field(form, 'location', 150)
  if (!isId(id) || !STATUSES.includes(status)) go('/shipments')
  const [s] = await q('select current_location, destination, dest_lat, dest_lng, current_lat, current_lng from shipments where id = $1', [id])
  if (!s) go('/shipments')

  let loc = { name: s.current_location as string, lat: s.current_lat as number, lng: s.current_lng as number }
  if (status === 'DELIVERED') loc = { name: s.destination, lat: s.dest_lat, lng: s.dest_lng }
  else if (location && location !== s.current_location) {
    const g = await geocode(location)
    if (!g) go(`/shipments/${id}?error=location`)
    loc = { name: location, lat: g!.lat, lng: g!.lng }
  }
  location = loc.name
  await q('update shipments set status=$2, current_location=$3, current_lat=$4, current_lng=$5, updated_at=now() where id=$1', [id, status, loc.name, loc.lat, loc.lng])
  await q('insert into shipment_events(shipment_id, status, location, description) values ($1,$2,$3,$4)', [id, status, location, description || null])
  go(`/shipments/${id}?saved=1`)
}

export async function deleteShipment(form: FormData) {
  await requireAdmin()
  const id = field(form, 'id', 40)
  if (isId(id)) await q('delete from shipments where id = $1', [id])
  go('/shipments')
}

/* ---------- chat ---------- */

export async function replyToChat(form: FormData) {
  await requireAdmin()
  const id = field(form, 'conversation_id', 40)
  const body = field(form, 'body', 1000)
  if (!isId(id)) go('/inbox')
  if (!body) go(`/inbox/${id}`)
  await q(`insert into messages(conversation_id, sender, body) values ($1, 'AGENT', $2)`, [id, body])
  await q(`update conversations set client_unread = client_unread + 1, last_message_at = now(), status = 'OPEN' where id = $1`, [id])
  // Atomic: at most one email to the client per 10 minutes.
  const [c] = await q(
    `update conversations set client_notified_at = now()
     where id = $1 and (client_notified_at is null or client_notified_at < now() - interval '10 minutes')
     returning contact_email, (select tracking_number from shipments where id = shipment_id) as tracking`,
    [id],
  )
  if (c) {
    after(() =>
      sendMail(c.contact_email, `New reply about shipment ${c.tracking}`, `You have a new reply from the ${siteConfig.company.name} team. Open ${siteConfig.url} and tap the chat button to read it.`),
    )
  }
  go(`/inbox/${id}`)
}

export async function markChatRead(id: string) {
  await requireAdmin()
  if (isId(id)) await q('update conversations set admin_unread = 0 where id = $1', [id])
}

export async function setConversationStatus(form: FormData) {
  await requireAdmin()
  const id = field(form, 'conversation_id', 40)
  const status = field(form, 'status', 10) === 'RESOLVED' ? 'RESOLVED' : 'OPEN'
  if (isId(id)) await q('update conversations set status = $2 where id = $1', [id, status])
  go(`/inbox/${id}`)
}

/* ---------- enquiries ---------- */

export async function setEnquiryStatus(form: FormData) {
  await requireAdmin()
  const id = field(form, 'id', 40)
  if (isId(id)) await q('update contact_messages set status = $2 where id = $1', [id, field(form, 'status', 10) === 'DONE' ? 'DONE' : 'NEW'])
  go('/enquiries')
}

export async function deleteEnquiry(form: FormData) {
  await requireAdmin()
  const id = field(form, 'id', 40)
  if (isId(id)) await q('delete from contact_messages where id = $1', [id])
  go('/enquiries')
}
