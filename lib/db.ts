import { Pool, types } from 'pg'
import { SCHEMA } from './schema'

types.setTypeParser(1082, (v: string) => v) // keep DATE as 'YYYY-MM-DD'
types.setTypeParser(20, (v: string) => Number(v)) // bigint ids fit in a JS number

const g = globalThis as unknown as { pool?: Pool; ready?: Promise<unknown> }

function pool() {
  if (!g.pool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
    const p = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
    p.on('error', () => {}) // an idle connection dropped by the server must not crash the process
    g.pool = p
    g.ready = p.query(SCHEMA).catch((e) => {
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
