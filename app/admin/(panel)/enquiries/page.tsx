import { deleteEnquiry, setEnquiryStatus } from '../../actions'
import { q } from '@/lib/db'
import { fmt } from '@/lib/status'
import { ConfirmButton } from '@/components/admin/client-bits'
import { ui } from '@/components/admin/ui'

export default async function Enquiries() {
  const rows = await q('select id, name, email, message, status, created_at from contact_messages order by created_at desc limit 100')
  return (
    <div className="flex flex-col gap-5">
      <h1 className={ui.h1}>Website enquiries</h1>
      {rows.length === 0 && <p className="text-sm text-muted-foreground">No enquiries yet.</p>}
      {rows.map((m) => (
        <article key={m.id} className={`${ui.card} flex flex-col gap-3`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-extrabold text-navy">{m.name} {m.status === 'NEW' && <span className="ml-2 rounded-full bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">New</span>}</p>
              <a href={`mailto:${m.email}`} className="text-sm text-brand hover:underline">{m.email}</a>
              <p className="text-xs text-muted-foreground">{fmt(m.created_at)}</p>
            </div>
            <div className="flex gap-2">
              <form action={setEnquiryStatus}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="status" value={m.status === 'NEW' ? 'DONE' : 'NEW'} />
                <button className={ui.secondary}>{m.status === 'NEW' ? 'Mark done' : 'Mark new'}</button>
              </form>
              <form action={deleteEnquiry}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton label="Delete" message="Delete this enquiry?" />
              </form>
            </div>
          </div>
          <p className="whitespace-pre-wrap break-words text-sm text-navy">{m.message}</p>
        </article>
      ))}
    </div>
  )
}
