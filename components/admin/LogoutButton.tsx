'use client'

import { useRouter } from 'next/navigation'
import { IconLogout } from './icons'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button className="admin-sidebar__logout" onClick={handleLogout}>
      <IconLogout size={18} />
      <span>Sair</span>
    </button>
  )
}
