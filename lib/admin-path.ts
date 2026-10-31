// Public URL of the admin panel. Set ADMIN_PATH (8+ characters, letters/digits/-/_//) to something only you know,
// e.g. ADMIN_PATH=ops/panel-k7q2x9m4. Without it the panel is disabled in production.
const raw = (process.env.ADMIN_PATH ?? '').replace(/^\/+|\/+$/g, '')
const path = raw || (process.env.NODE_ENV === 'production' ? '' : 'logistix/control/panel')
export const ADMIN_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-lgx_admin' : 'lgx_admin'
export const ADMIN_BASE = /^[A-Za-z0-9/_-]{8,}$/.test(path) ? `/${path}` : ''
