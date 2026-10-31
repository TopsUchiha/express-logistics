export function formatDateTime(value: string | undefined | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatDate(value: string | undefined | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(d)
}

export function formatRelative(value: string | undefined | null, now = Date.now()) {
  if (!value) return '—'
  const t = new Date(value).getTime()
  if (Number.isNaN(t)) return '—'
  const diff = Math.round((t - now) / 1000)
  const abs = Math.abs(diff)
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (abs < 60) return 'just now'
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
  return rtf.format(Math.round(diff / 86400), 'day')
}

export function placeLabel(p?: { city?: string; country?: string } | null) {
  if (!p) return '—'
  return [p.city, p.country].filter(Boolean).join(', ') || '—'
}

export function clampProgress(n: unknown) {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0
  return Math.min(100, Math.max(0, Math.round(v)))
}
