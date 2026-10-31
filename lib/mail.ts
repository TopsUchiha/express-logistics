// Sends plain-text email through Resend's HTTP API. Does nothing when RESEND_API_KEY / MAIL_FROM are not set,
// so the site works without email (in-app notifications still work).
export async function sendMail(to: string | string[], subject: string, text: string) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  const list = (Array.isArray(to) ? to : [to]).filter(Boolean)
  if (!key || !from || list.length === 0) return false
  try {
    const res = await fetch(process.env.RESEND_API_URL ?? 'https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: list, subject, text }),
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

export const adminNotifyList = () =>
  (process.env.ADMIN_NOTIFY_EMAIL ?? '').split(',').map((e) => e.trim()).filter(Boolean)
