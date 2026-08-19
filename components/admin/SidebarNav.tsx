'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconGrid, IconImage, IconStore, IconPages, IconClipboard, IconMail } from './icons'

const NAV = [
  { href: '/admin', label: 'Início', icon: IconGrid },
  { href: '/admin/banner', label: 'Banner', icon: IconImage },
  { href: '/admin/lojas', label: 'Lojas', icon: IconStore },
  { href: '/admin/paginas', label: 'Páginas', icon: IconPages },
  { href: '/admin/pedidos', label: 'Pedidos', icon: IconClipboard },
  { href: '/admin/contatos', label: 'Contatos', icon: IconMail },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="admin-sidebar__group">
      {NAV.map(item => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            className={`admin-sidebar__link${active ? ' admin-sidebar__link--active' : ''}`}
          >
            <item.icon />
            <span className="admin-sidebar__link-label">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
