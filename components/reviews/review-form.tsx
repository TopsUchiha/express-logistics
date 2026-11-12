'use client'

import { useState, type FormEvent } from 'react'
import { Check, Send, Star } from 'lucide-react'

const field =
  'w-full rounded-sm border border-input bg-white px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand'

export function ReviewForm() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const body = String(data.get('body') ?? '').trim()
    if (!name || body.length < 10 || rating < 1) {
      setError('Please add your name, a star rating and a review of at least 10 characters.')
      return
    }
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, body, website: String(data.get('website') ?? '') }),
      })
      const out = await res.json().catch(() => ({}))
      if (res.ok && out.ok) setSent(true)
      else setError(out.error ?? 'Something went wrong. Please try again.')
    } catch {
      setError('Couldn’t send your review. Check your connection and try again.')
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
        <h2 className="text-2xl font-extrabold text-navy">Thank you for your review</h2>
        <p className="text-muted-foreground">Our team checks every review before it appears on the site.</p>
      </div>
    )
  }

  const shown = hover || rating
  return (
    <form method="post" onSubmit={onSubmit} className="flex flex-col gap-5 rounded-sm bg-white p-6 shadow-[0_4px_24px_rgba(11,26,43,0.08)] sm:p-10">
      <label className="flex flex-col gap-2 text-sm font-bold text-navy">
        Name
        <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={`${field} h-12`} />
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold text-navy">Rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" onClick={() => setRating(i)} onMouseEnter={() => setHover(i)} aria-label={`${i} star${i > 1 ? 's' : ''}`} aria-pressed={rating === i} className="rounded-sm p-1 outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <Star className={`h-8 w-8 transition-colors ${i <= shown ? 'fill-brand text-brand' : 'fill-transparent text-border'}`} aria-hidden="true" />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2 text-sm font-bold text-navy">
        Your review
        <textarea name="body" required rows={5} minLength={10} maxLength={600} placeholder="Tell us about your experience…" className={`${field} py-3`} />
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
      <button type="submit" disabled={sending} className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-sm bg-brand px-7 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover disabled:opacity-70">
        {sending ? 'Sending…' : 'Submit review'}
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}
