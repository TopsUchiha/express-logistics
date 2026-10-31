import { randomInt } from 'crypto'
import { q } from '../db'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I

/** LGX- plus 10 random characters (about 50 bits), so numbers can't be guessed by counting. */
export async function newTrackingNumber() {
  for (;;) {
    const n = 'LGX-' + Array.from({ length: 10 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
    if (!(await q('select 1 from shipments where tracking_number = $1', [n])).length) return n
  }
}
