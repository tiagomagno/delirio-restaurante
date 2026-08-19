import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { IconPlus, IconEdit } from '@/components/admin/icons'

export default async function AdminLojas() {
  const stores = await prisma.store.findMany({ orderBy: { order: 'asc' } })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Lojas</h1>
          <p className="admin-lede" style={{ marginBottom: 0 }}>Unidades exibidas na home, em /lojas e nos formulários do site.</p>
        </div>
        <Link className="admin-btn" href="/admin/lojas/novo">
          <IconPlus size={16} />
          Nova loja
        </Link>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '26%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '18%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Região</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td><img className="admin-thumb" src={store.image} alt="" /></td>
                <td>{store.name}</td>
                <td>{store.region === 'rio' ? 'Rio de Janeiro' : 'Niterói'}</td>
                <td>
                  <span className={`admin-badge admin-badge--${store.active ? 'green' : 'gray'}`}>
                    {store.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <Link className="admin-icon-btn" href={`/admin/lojas/${store.id}`}>
                    <IconEdit size={13} />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr><td colSpan={5}>Nenhuma loja cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
