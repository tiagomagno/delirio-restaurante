import { prisma } from '@/lib/prisma'
import DeleteRowButton from '@/components/admin/DeleteRowButton'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

function formatEventDate(d: Date | null) {
  if (!d) return null
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default async function AdminPedidos() {
  const requests = await prisma.eventRequest.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Pedidos</h1>
      <p className="admin-lede">Solicitações de orçamento recebidas pelo formulário de Eventos Corporativos.</p>

      <div className="admin-panel">
        {requests.length === 0 && <p className="admin-empty">Nenhum pedido recebido ainda.</p>}
        <div className="admin-entry-list">
          {requests.map(r => (
            <div key={r.id} className="admin-entry">
              <div className="admin-entry__top">
                <div>
                  <div className="admin-entry__name">{r.nome}</div>
                  <div className="admin-entry__meta">
                    {r.lojaNome} · {r.pessoas} pessoas
                    {formatEventDate(r.data) && ` · evento em ${formatEventDate(r.data)}`}
                  </div>
                </div>
                <div className="admin-entry__actions">
                  <span className="admin-entry__date">{formatDate(r.createdAt)}</span>
                  <DeleteRowButton
                    endpoint={`/api/admin/event-requests/${r.id}`}
                    confirmMessage={`Excluir o pedido de "${r.nome}"?`}
                  />
                </div>
              </div>
              <div className="admin-entry__contacts">
                {r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}
                {r.celular && <a href={`tel:${r.celular.replace(/\D/g, '')}`}>{r.celular}</a>}
                {r.telefone && <a href={`tel:${r.telefone.replace(/\D/g, '')}`}>{r.telefone}</a>}
              </div>
              {r.descricao && <p className="admin-entry__desc">{r.descricao}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
