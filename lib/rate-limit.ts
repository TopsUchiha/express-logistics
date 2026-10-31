import { q } from './db'

/**
 * Counts one hit for `key` inside a sliding-reset window. Returns true when the caller is over `max`.
 * Stored in Postgres so it works across serverless instances.
 */
export async function limited(key: string, max: number, windowSec: number) {
  const [r] = await q(
    `insert into rate_limits(key, count, window_start) values ($1, 1, now())
     on conflict (key) do update set
       count = case when rate_limits.window_start < now() - make_interval(secs => $2) then 1 else rate_limits.count + 1 end,
       window_start = case when rate_limits.window_start < now() - make_interval(secs => $2) then now() else rate_limits.window_start end
     returning count`,
    [key, windowSec],
  )
  return (r.count as number) > max
}
