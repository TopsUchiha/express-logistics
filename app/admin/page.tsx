import { Dashboard } from '@/components/admin/dashboard'
import { PanelShell } from '@/components/admin/panel-shell'
import { SignIn } from '@/components/admin/sign-in'
import { getAdmin } from '@/lib/auth'

// The secret URL itself: the sign-in form when signed out, the dashboard when signed in.
export default async function AdminHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const admin = await getAdmin()
  if (!admin) return <SignIn error={(await searchParams).error} />
  return (
    <PanelShell admin={admin}>
      <Dashboard />
    </PanelShell>
  )
}
