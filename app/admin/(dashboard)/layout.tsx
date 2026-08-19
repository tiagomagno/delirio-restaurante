import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LogoutButton from '@/components/admin/LogoutButton'
import SidebarNav from '@/components/admin/SidebarNav'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function displayName(email: string) {
  const local = email.split('@')[0]
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const name = displayName(session.email)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-mark">DT</div>
          <div>
            <div className="admin-sidebar__brand-name">Delírio Admin</div>
            <div className="admin-sidebar__brand-sub">Painel de conteúdo</div>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          <div>
            <div className="admin-sidebar__group-label">Geral</div>
            <SidebarNav />
          </div>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">{session.email}</div>
          <LogoutButton />
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <div className="admin-topbar__greeting-label">{greeting()},</div>
            <div className="admin-topbar__greeting-name">{name}</div>
          </div>
          <div className="admin-topbar__right">
            <div className="admin-topbar__user">
              <div className="admin-topbar__avatar">{name.charAt(0)}</div>
              <div className="admin-topbar__user-name">{name}</div>
            </div>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
