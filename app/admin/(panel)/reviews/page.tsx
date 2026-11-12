import { Star } from 'lucide-react'
import { deleteReview, setReviewStatus } from '../../actions'
import { q } from '@/lib/db'
import { fmt } from '@/lib/status'
import { ConfirmButton } from '@/components/admin/client-bits'
import { ui } from '@/components/admin/ui'

const badge: Record<string, string> = {
  PENDING: 'bg-brand text-white',
  APPROVED: 'bg-green-600 text-white',
  REJECTED: 'bg-muted-foreground text-white',
}

export default async function Reviews() {
  const rows = await q("select id, name, rating, body, status, created_at from reviews order by (status = 'PENDING') desc, created_at desc limit 100")
  const act = (id: string, status: string, label: string, cls: string) => (
    <form action={setReviewStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={cls}>{label}</button>
    </form>
  )
  return (
    <div className="flex flex-col gap-5">
      <h1 className={ui.h1}>Customer reviews</h1>
      <p className="text-sm text-muted-foreground">Reviews sent from the website wait here. Only approved reviews appear on the homepage.</p>
      {rows.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
      {rows.map((r) => (
        <article key={r.id} className={`${ui.card} flex flex-col gap-3`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-extrabold text-navy">
                {r.name} <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${badge[r.status]}`}>{r.status.charAt(0) + r.status.slice(1).toLowerCase()}</span>
              </p>
              <div className="mt-1 flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-4 w-4 ${i <= r.rating ? 'fill-brand text-brand' : 'fill-transparent text-border'}`} aria-hidden="true" />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{fmt(r.created_at)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {r.status !== 'APPROVED' && act(r.id, 'APPROVED', 'Approve', ui.primary)}
              {r.status !== 'REJECTED' && act(r.id, 'REJECTED', 'Reject', ui.secondary)}
              <form action={deleteReview}>
                <input type="hidden" name="id" value={r.id} />
                <ConfirmButton label="Delete" message="Delete this review?" />
              </form>
            </div>
          </div>
          <p className="whitespace-pre-wrap break-words text-sm text-navy">{r.body}</p>
        </article>
      ))}
    </div>
  )
}
