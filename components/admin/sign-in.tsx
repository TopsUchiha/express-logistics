import { login, setupAdmin } from '@/app/admin/actions'
import { q } from '@/lib/db'
import { siteConfig } from '@/lib/site-config'
import { ui } from '@/components/admin/ui'

const MESSAGES: Record<string, string> = {
  '1': 'Wrong email or password.',
  limit: 'Too many attempts. Please wait a few minutes.',
  setup: 'Setup failed. Check the setup key, use a valid email and a password of at least 12 characters.',
}

export async function SignIn({ error }: { error?: string }) {
  const [{ count }] = await q('select count(*)::int as count from admin_users')
  const setup = count === 0

  return (
    <div className="grid min-h-dvh place-items-center p-4">
      <div className={`${ui.card} w-full max-w-sm`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{siteConfig.company.name}</p>
        <h1 className={`${ui.h1} mt-1`}>{setup ? 'Create the admin account' : 'Admin sign in'}</h1>
        {error && <p role="alert" className="mt-3 text-sm font-semibold text-destructive">{MESSAGES[error] ?? MESSAGES['1']}</p>}
        {setup && !process.env.ADMIN_SETUP_KEY ? (
          <p className="mt-4 text-sm text-muted-foreground">Set ADMIN_SETUP_KEY (16+ characters) in your environment to create the first admin.</p>
        ) : (
          <form action={setup ? setupAdmin : login} className="mt-5 flex flex-col gap-4">
            {setup && (
              <label className={ui.label}>Setup key<input name="setup_key" type="password" required autoComplete="off" className={ui.input} /></label>
            )}
            <label className={ui.label}>Email<input name="email" type="email" required autoComplete="username" className={ui.input} /></label>
            <label className={ui.label}>Password<input name="password" type="password" required minLength={setup ? 12 : undefined} autoComplete={setup ? 'new-password' : 'current-password'} className={ui.input} /></label>
            <button type="submit" className={ui.primary}>{setup ? 'Create account' : 'Sign in'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
