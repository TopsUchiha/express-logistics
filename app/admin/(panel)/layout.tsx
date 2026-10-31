import { PanelShell } from '@/components/admin/panel-shell'
import { requireAdmin } from '@/lib/auth'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  return <PanelShell admin={admin}>{children}</PanelShell>
}
