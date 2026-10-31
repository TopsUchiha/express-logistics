// Run:  node scripts/check-env.mjs      (from the project folder, the one with package.json)
// Shows which env files are read, whether the admin path and database work, and your admin URL.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const cwd = process.cwd()
const ok = (m) => console.log('  OK      ' + m)
const bad = (m) => console.log('  PROBLEM ' + m)
const note = (m) => console.log('  note    ' + m)

console.log(`\nFolder: ${cwd}`)
if (!fs.existsSync(path.join(cwd, 'package.json')) || !fs.existsSync(path.join(cwd, 'proxy.ts'))) {
  bad('this does not look like the project folder (no package.json / proxy.ts here). cd into it first.')
}

const system = { ADMIN_PATH: process.env.ADMIN_PATH, DATABASE_URL: process.env.DATABASE_URL, ADMIN_SETUP_KEY: process.env.ADMIN_SETUP_KEY }
const files = ['.env.local', '.env']
const found = files.filter((f) => fs.existsSync(path.join(cwd, f)))
const stray = fs.readdirSync(cwd).filter((f) => /^\.env/.test(f) && !files.includes(f) && f !== '.env.example')
console.log('\nEnv files:')
if (found.length) ok(found.join(', ') + ' found')
else bad('no .env.local or .env in this folder. Create .env.local here (same folder as package.json).')
if (stray.length) bad(`these look like mis-named env files and are NOT read: ${stray.join(', ')}`)

const vals = {}
for (const f of [...found].reverse()) {
  const text = fs.readFileSync(path.join(cwd, f), 'utf8').replace(/^\uFEFF/, '')
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m || line.trim().startsWith('#')) continue
    vals[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}
for (const [k, v] of Object.entries(system)) if (v !== undefined) note(`${k} is also set in your Windows/shell environment, which OVERRIDES the file. Remove it or restart the terminal.`)
const get = (k) => system[k] ?? vals[k] ?? ''

console.log('\nAdmin path:')
const raw = get('ADMIN_PATH').replace(/^\/+|\/+$/g, '')
if (!raw) bad('ADMIN_PATH is empty. In dev the built-in fallback /logistix/control/panel is used; on the live site the panel is off.')
else if (!/^[A-Za-z0-9/_-]{8,}$/.test(raw)) bad('ADMIN_PATH must be 8+ characters using only letters, digits, - _ /')
else ok(`your admin URL will be  http://localhost:3000/${raw}`)

console.log('\nSetup key:')
const key = get('ADMIN_SETUP_KEY')
if (!key) bad('ADMIN_SETUP_KEY is empty (needed once, to create the first admin).')
else if (key.length < 16) bad('ADMIN_SETUP_KEY must be at least 16 characters.')
else ok(`set (${key.length} characters)`)

console.log('\nDatabase:')
const url = get('DATABASE_URL')
if (!url) bad('DATABASE_URL is empty.')
else {
  let host = '?'
  try { host = new URL(url).host } catch { bad('DATABASE_URL is not a valid URL. Check the quotes and that nothing is cut off.') }
  note(`host: ${host}`)
  const pool = new pg.Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 10000 })
  pool.on('error', () => {})
  try {
    const r = await pool.query('select version() as v')
    ok('connected: ' + String(r.rows[0].v).split(' on ')[0])
  } catch (e) {
    bad('could not connect: ' + (e && e.message ? e.message : e))
  } finally {
    await pool.end().catch(() => {})
  }
}
console.log('\nMap (optional):')
const tok = get('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN')
if (!tok) note('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is empty, so /track shows a placeholder instead of the map.')
else if (tok.startsWith('sk.')) bad('this is a SECRET token (sk.). Use the public one that starts with pk.')
else if (!tok.startsWith('pk.')) bad('the token should start with pk.')
else if (/\s/.test(tok)) bad('the token contains spaces. Remove them.')
else ok(`public token found (${tok.length} characters). It is only read when the server STARTS: stop every server, delete the .next folder, then run pnpm dev.`)
console.log('\nFix any PROBLEM lines, then stop every dev server (Ctrl+C in each terminal) and run: pnpm dev\n')
