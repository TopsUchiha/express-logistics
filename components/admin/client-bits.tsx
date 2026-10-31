'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { markChatRead } from '@/app/admin/actions'
import { ui } from './ui'

/** Re-renders the page every few seconds so new chat messages appear without a reload. */
export function AutoRefresh({ seconds = 8 }: { seconds?: number }) {
  const router = useRouter()
  useEffect(() => {
    const t = setInterval(() => { if (!document.hidden) router.refresh() }, seconds * 1000)
    return () => clearInterval(t)
  }, [router, seconds])
  return null
}

/** Clears a thread's unread count from the browser, then refreshes so the nav badge updates. */
export function MarkRead({ id, hasUnread }: { id: string; hasUnread: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (hasUnread) markChatRead(id).then(() => router.refresh())
  }, [id, hasUnread, router])
  return null
}

export function ConfirmButton({ label, message }: { label: string; message: string }) {
  return (
    <button type="submit" className={ui.danger} onClick={(e) => { if (!window.confirm(message)) e.preventDefault() }}>
      {label}
    </button>
  )
}
