'use client'

import { Container } from '@/components/shared/primitives'

// Visitors only see a generic message. On your own computer (pnpm dev) the real error is shown too.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="bg-surface py-24">
      <Container className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-extrabold text-navy">Something went wrong</h1>
        <p className="text-muted-foreground">Please try again. If it keeps happening, email us and we’ll look into it.</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="max-w-full overflow-x-auto whitespace-pre-wrap rounded-sm border border-border bg-white p-3 text-xs text-destructive">{error.message}</pre>
        )}
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center rounded-sm bg-brand px-7 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-hover"
        >
          Try again
        </button>
      </Container>
    </section>
  )
}
