'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Bell, MessageCircle, Send, X } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { TRACKING_PATTERN, normalizeTrackingNumber } from '@/lib/tracking/tracking-number'
import { cn } from '@/lib/utils'

type Sender = 'CLIENT' | 'AGENT' | 'SYSTEM' | 'BOT' | 'ME'
type Msg = { key: string; id?: number; sender: Sender; body: string }
type Phase = 'number' | 'email' | 'busy' | 'chat'
type ServerMsg = { id: number; sender: 'CLIENT' | 'AGENT' | 'SYSTEM'; body: string }

const WELCOME = 'Welcome. Please enter your tracking number to start a conversation with our agent.'
const FLAG = 'lgx_chat'
let counter = 0
const local = (sender: Sender, body: string): Msg => ({ key: `l${++counter}`, sender, body })
const fromServer = (m: ServerMsg): Msg => ({ key: `s${m.id}`, id: m.id, sender: m.sender, body: m.body })

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  return { status: res.status, data: await res.json().catch(() => ({})) }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>('number')
  const [msgs, setMsgs] = useState<Msg[]>(() => [local('BOT', WELCOME)])
  const [input, setInput] = useState('')
  const [unread, setUnread] = useState(0)
  const [error, setError] = useState('')
  const [canAlert, setCanAlert] = useState(false)
  const number = useRef('')
  const lastId = useRef(0)
  const openRef = useRef(false)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const add = useCallback((...m: Msg[]) => setMsgs((prev) => [...prev, ...m]), [])

  const endLocal = useCallback((note?: string) => {
    try { localStorage.removeItem(FLAG) } catch {}
    lastId.current = 0
    setPhase('number')
    setUnread(0)
    setMsgs([local('BOT', note ? `${note} ${WELCOME}` : WELCOME)])
  }, [])

  const loadServer = useCallback((list: ServerMsg[]) => {
    if (!list.length) return
    lastId.current = Math.max(lastId.current, ...list.map((m) => m.id))
    setMsgs((prev) => [...prev, ...list.map(fromServer)])
  }, [])

  const poll = useCallback(async () => {
    const res = await fetch(`/api/chat/messages?after=${lastId.current}${openRef.current ? '&open=1' : ''}`, { cache: 'no-store' }).catch(() => null)
    if (!res) return
    if (res.status === 401) return endLocal('Your chat session ended.')
    if (!res.ok) return
    const data = await res.json()
    setUnread(data.unread ?? 0)
    if (data.messages?.length) {
      loadServer(data.messages)
      const fresh = data.messages.some((m: ServerMsg) => m.sender === 'AGENT')
      if (fresh && (!openRef.current || document.hidden) && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`New message from ${siteConfig.company.name}`, { body: 'You have a new reply from our team.' })
      }
    }
  }, [endLocal, loadServer])

  // Restore an existing session (only when this browser has chatted before, so other visitors make no request).
  useEffect(() => {
    let has = false
    try { has = localStorage.getItem(FLAG) === '1' } catch {}
    if (!has) return
    fetch('/api/chat/messages?after=0', { cache: 'no-store' })
      .then(async (res) => {
        if (res.status === 401) return endLocal()
        if (!res.ok) return
        const data = await res.json()
        setPhase('chat')
        setMsgs([local('BOT', 'Welcome back. Your conversation is below.')])
        loadServer(data.messages ?? [])
        setUnread(data.unread ?? 0)
      })
      .catch(() => {})
  }, [endLocal, loadServer])

  // Keep the conversation fresh: fast while the panel is open, slow in the background.
  useEffect(() => {
    if (phase !== 'chat') return
    let t: ReturnType<typeof setTimeout>
    const tick = async () => {
      await poll()
      t = setTimeout(tick, openRef.current && !document.hidden ? 5000 : 30000)
    }
    t = setTimeout(tick, 5000)
    return () => clearTimeout(t)
  }, [phase, poll])

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }) }, [msgs, open])
  useEffect(() => { if (open) inputRef.current?.focus() }, [open, phase])
  useEffect(() => { setCanAlert(typeof Notification !== 'undefined' && Notification.permission === 'default') }, [phase])

  function toggle(next: boolean) {
    setOpen(next)
    openRef.current = next
    if (next && phase === 'chat') poll()
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const v = input.trim()
    if (!v || phase === 'busy') return
    setError('')
    setInput('')

    if (phase === 'number') {
      const n = normalizeTrackingNumber(v).slice(0, 32)
      add(local('ME', n))
      if (!TRACKING_PATTERN.test(n)) {
        add(local('BOT', `That doesn’t look like a tracking number. They look like ${siteConfig.tracking.placeholder}.`))
        return
      }
      number.current = n
      add(local('BOT', 'Thanks. Please confirm the email address we have on file for this shipment.'))
      setPhase('email')
    } else if (phase === 'email') {
      add(local('ME', v))
      setPhase('busy')
      const { status, data } = await post('/api/chat/start', { number: number.current, email: v })
      if (data.ok) {
        try { localStorage.setItem(FLAG, '1') } catch {}
        lastId.current = 0
        setMsgs([local('BOT', `Hi ${data.name}, you’re connected. Send your message and our team will reply here.`)])
        loadServer(data.messages ?? [])
        setPhase('chat')
      } else {
        add(local('BOT', `${data.error ?? 'Something went wrong.'}${status === 429 ? '' : ' Let’s try again. Please enter your tracking number.'}`))
        setPhase('number')
      }
    } else {
      const { status, data } = await post('/api/chat/messages', { body: v })
      if (data.ok) {
        lastId.current = Math.max(lastId.current, data.message.id)
        add(fromServer(data.message))
      } else if (status === 401) endLocal('Your chat session ended.')
      else { setInput(v); setError(data.error ?? 'Couldn’t send your message. Please try again.') }
    }
  }

  async function endChat() {
    await post('/api/chat/end', {}).catch(() => {})
    endLocal()
  }

  const placeholder = phase === 'number' ? `Tracking number, e.g. ${siteConfig.tracking.placeholder}` : phase === 'email' ? 'Your email address' : 'Type your message…'

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => toggle(true)}
        aria-label={unread ? `Open chat, ${unread} unread` : 'Open chat'}
        aria-expanded={false}
        className="fixed right-4 bottom-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-hover"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid h-6 min-w-6 place-items-center rounded-full bg-navy px-1 text-xs font-bold text-white">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>
    )
  }

  return (
    <section
      role="dialog"
      aria-label="Chat with our team"
      className="fixed right-4 bottom-4 z-50 flex h-[min(34rem,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-sm border border-border bg-white shadow-2xl"
    >
      <header className="flex items-center justify-between gap-2 bg-navy px-4 py-3 text-white">
        <div>
          <p className="text-sm font-extrabold">Chat with our team</p>
          <p className="text-xs text-white/70">{siteConfig.company.name} support</p>
        </div>
        <div className="flex items-center gap-1">
          {phase === 'chat' && canAlert && (
            <button type="button" aria-label="Turn on message alerts" title="Turn on message alerts" className="grid h-8 w-8 place-items-center rounded-sm hover:bg-white/10"
              onClick={() => Notification.requestPermission().then(() => setCanAlert(Notification.permission === 'default'))}>
              <Bell className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {phase === 'chat' && (
            <button type="button" onClick={endChat} className="rounded-sm px-2 py-1 text-xs font-semibold hover:bg-white/10">End chat</button>
          )}
          <button type="button" onClick={() => toggle(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-sm hover:bg-white/10">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div ref={logRef} role="log" aria-live="polite" className="flex flex-1 flex-col gap-2 overflow-y-auto bg-surface p-4">
        {msgs.map((m) => {
          const mine = m.sender === 'ME' || m.sender === 'CLIENT'
          const note = m.sender === 'SYSTEM'
          return (
            <div key={m.key} className={cn('max-w-[85%] whitespace-pre-wrap break-words rounded-sm px-3 py-2 text-sm', mine ? 'self-end bg-brand text-white' : note ? 'self-center bg-transparent text-xs text-muted-foreground' : 'self-start border border-border bg-white text-navy')}>
              {m.sender === 'AGENT' && <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wider text-brand">Agent</span>}
              {m.body}
            </div>
          )
        })}
      </div>

      {error && <p role="alert" className="bg-white px-4 pt-2 text-xs font-semibold text-destructive">{error}</p>}
      <form onSubmit={onSubmit} className="flex gap-2 border-t border-border bg-white p-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type={phase === 'email' ? 'email' : 'text'}
          maxLength={phase === 'chat' ? 1000 : phase === 'email' ? 254 : 40}
          autoComplete={phase === 'email' ? 'email' : 'off'}
          autoCapitalize={phase === 'number' ? 'characters' : 'off'}
          spellCheck={false}
          disabled={phase === 'busy'}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 min-w-0 flex-1 rounded-sm border border-input px-3 text-sm outline-none focus:border-brand disabled:opacity-60"
        />
        <button type="submit" disabled={phase === 'busy'} aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-brand text-white transition-colors hover:bg-brand-hover disabled:opacity-60">
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </section>
  )
}
