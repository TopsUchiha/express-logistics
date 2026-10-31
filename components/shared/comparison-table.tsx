import { comparisonRows } from '@/lib/services-data'
import { cn } from '@/lib/utils'

function Score({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${label}: ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn('h-2.5 w-5 rounded-sm', i < value ? 'bg-brand' : 'bg-border')} />
      ))}
    </div>
  )
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-sm border border-border bg-white shadow-[0_4px_24px_rgba(11,26,43,0.08)]">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="bg-navy text-xs font-bold uppercase tracking-wider text-white">
            <th scope="col" className="px-6 py-4">Service</th>
            <th scope="col" className="px-6 py-4">Speed</th>
            <th scope="col" className="px-6 py-4">Cost efficiency</th>
            <th scope="col" className="px-6 py-4">Capacity</th>
            <th scope="col" className="min-w-[260px] px-6 py-4">Ideal for</th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.service} className="border-t border-border even:bg-surface/60">
              <th scope="row" className="px-6 py-5 text-base font-extrabold text-navy">{row.service}</th>
              <td className="px-6 py-5"><Score value={row.speed} label="Speed" /></td>
              <td className="px-6 py-5"><Score value={row.cost} label="Cost efficiency" /></td>
              <td className="px-6 py-5"><Score value={row.capacity} label="Capacity" /></td>
              <td className="px-6 py-5 text-[15px] text-muted-foreground">{row.idealFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
