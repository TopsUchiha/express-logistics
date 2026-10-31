import type { LegalSection } from '@/lib/legal-content'
import { Container } from './primitives'

export function LegalDocument({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-[260px_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand">On this page</p>
          <ol className="flex flex-col gap-1 border-l-2 border-border">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-brand hover:text-navy">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="flex max-w-3xl flex-col gap-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="text-2xl font-extrabold text-navy">
                <span className="mr-3 text-brand">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-[15px] leading-relaxed text-muted-foreground">
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.list && (
                  <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-brand">
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </section>
  )
}
