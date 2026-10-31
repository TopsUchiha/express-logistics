import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } }

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-dvh bg-surface">{children}</main>
}
