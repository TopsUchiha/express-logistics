'use client'

import { useId, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AccordionItemData = { title: string; content: React.ReactNode }

export function Accordion({
  items,
  defaultOpen = 0,
  tone = 'light',
}: {
  items: AccordionItemData[]
  defaultOpen?: number | null
  tone?: 'light' | 'dark'
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const baseId = useId()

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i
        const btnId = `${baseId}-btn-${i}`
        const panelId = `${baseId}-panel-${i}`
        return (
          <div
            key={item.title}
            className={cn(
              'rounded-sm border transition-colors',
              tone === 'light'
                ? isOpen
                  ? 'border-brand bg-white shadow-sm'
                  : 'border-border bg-white'
                : isOpen
                  ? 'border-brand bg-white/5'
                  : 'border-white/15 bg-white/[0.03]',
            )}
          >
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold sm:px-6',
                  tone === 'light' ? 'text-navy' : 'text-white',
                )}
              >
                {item.title}
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-sm transition-colors',
                    isOpen ? 'bg-brand text-white' : tone === 'light' ? 'bg-surface text-navy' : 'bg-white/10 text-white',
                  )}
                >
                  {isOpen ? <Minus className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={cn('grid transition-[grid-template-rows] duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div
                  className={cn(
                    'px-5 pb-5 text-[15px] leading-relaxed sm:px-6',
                    tone === 'light' ? 'text-muted-foreground' : 'text-white/75',
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
