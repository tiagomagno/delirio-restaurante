'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconGrid, IconImage, IconStore, IconPages, IconClipboard, IconMail, IconSearch, IconBriefcase, IconUsers } from './icons'

const GROUPS = [
  {
    label: 'Geral',
    items: [
      { href: '/admin', label: 'Início', icon: IconGrid },
      { href: '/admin/banner', label: 'Banner', icon: IconImage },
      { href: '/admin/lojas', label: 'Lojas', icon: IconStore },
      { href: '/admin/paginas', label: 'Páginas', icon: IconPages },
      { href: '/admin/seo', label: 'SEO', icon: IconSearch },
    ],
  },
  {
    label: 'Formulários',
    items: [
      { href: '/admin/pedidos', label: 'Pedidos', icon: IconClipboard },
      { href: '/admin/contatos', label: 'Contatos', icon: IconMail },
      { href: '/admin/candidaturas', label: 'Candidaturas', icon: IconBriefcase },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/admin/usuarios', label: 'Usuários', icon: IconUsers },
    ],
  },
]

export default function SidebarNav() {
  const pathname = usePathname()

  return (
    <>
      {GROUPS.map(group => (
        <div key={group.label}>
          <div className="admin-sidebar__group-label">{group.label}</div>
          <div className="admin-sidebar__group">
            {group.items.map(item => {
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
        </div>
      ))}
    </>
  )
}
