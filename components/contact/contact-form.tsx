'use client'

import { useState, type FormEvent } from 'react'
import { Check, Send } from 'lucide-react'

const field =
  'w-full rounded-sm border border-input bg-white px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand'

const LIMITS = { name: 100, email: 254, message: 2000 } as const

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    if (!name || !message) {
      setError('Please fill in your name and a message.')
      return
    }
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: String(data.get('email') ?? ''), message, website: String(data.get('website') ?? '') }),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok && body.ok) setSent(true)
      else setError(body.error ?? 'Something went wrong. Please try again.')
    } catch {
      setError('Couldn’t send your message. Check your connection and try again.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-sm bg-white p-10 text-center shadow-[0_4px_24px_rgba(11,26,43,0.08)]">
        <span className="grid h-14 w-14 place-items-center rounded-sm bg-brand text-white">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-extrabold text-navy">Thanks, we got it</h2>
        <p className="text-muted-foreground">Your message is with our team. We’ll reply soon.</p>
      </div>
    )
  }

  return (
    <form
      method="post"
      onSubmit={onSubmit}
      className="flex flex-col gap-5 rounded-sm bg-white p-6 shadow-[0_4px_24px_rgba(11,26,43,0.08)] sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-bold text-navy">
          Name
          <input name="name" required maxLength={LIMITS.name} autoComplete="name" placeholder="Your name" className={`${field} h-12`} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold text-navy">
          Email
          <input name="email" type="email" required maxLength={LIMITS.email} autoComplete="email" placeholder="you@example.com" className={`${field} h-12`} />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-bold text-navy">
        What can we help with?
        <textarea name="message" required rows={5} maxLength={LIMITS.message} placeholder="Tell us about your shipment…" className={`${field} py-3`} />
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-sm bg-brand px-7 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-70"
      >
        {sending ? 'Sending…' : 'Send enquiry'}
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}
