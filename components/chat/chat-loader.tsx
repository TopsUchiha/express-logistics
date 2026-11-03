'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ChatWidget = dynamic(() => import('./chat-widget').then((m) => m.ChatWidget), { ssr: false })

/** Loads the chat widget once the browser is idle, so it never competes with the page itself. */
export function ChatLoader() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(() => setReady(true), 1500)
    return () => clearTimeout(t)
  }, [])
  return ready ? <ChatWidget /> : null
}
