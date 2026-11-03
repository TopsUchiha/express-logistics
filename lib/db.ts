import { Pool, types } from 'pg'
import { SCHEMA, SCHEMA_VERSION } from './schema'

types.setTypeParser(1082, (v: string) => v) // keep DATE as 'YYYY-MM-DD'
types.setTypeParser(1114, (v: string) => v) // keep TIMESTAMP (no zone) exactly as stored, e.g. an estimated delivery time
types.setTypeParser(20, (v: string) => Number(v)) // bigint ids fit in a JS number

const g = globalThis as unknown as { pool?: Pool; ready?: Promise<unknown> }

/** One quick check per cold start. The full schema only runs when the database is new or out of date. */
async function ensureSchema(p: Pool) {
  try {
    const r = await p.query('select version from schema_meta where id = 1')
    if (r.rows[0] && r.rows[0].version >= SCHEMA_VERSION) return
  } catch {
    /* first run: schema_meta does not exist yet */
  }
  const c = await p.connect()
  try {
    await c.query('begin')
    await c.query('select pg_advisory_xact_lock(727272)') // two cold starts must not build the schema at the same time
    await c.query(SCHEMA)
    await c.query(
      'insert into schema_meta(id, version) values (1, $1) on conflict (id) do update set version = excluded.version',
      [SCHEMA_VERSION],
    )
    await c.query('commit')
  } catch (e) {
    await c.query('rollback').catch(() => {})
    throw e
  } finally {
    c.release()
  }
}

function pool() {
  if (!g.pool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
    const p = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
    p.on('error', () => {}) // an idle connection dropped by the server must not crash the process
    g.pool = p
    g.ready = ensureSchema(p).catch((e) => {
      g.pool = undefined
      throw e
    })
  }
  return g.pool
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function q(text: string, params: unknown[] = []): Promise<any[]> {
  const p = pool()
  await g.ready
  return (await p.query(text, params)).rows
}

export const isId = (s: string) => /^[0-9a-f-]{36}$/i.test(s)
