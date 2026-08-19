import { prisma } from '@/lib/prisma'
import DeleteRowButton from '@/components/admin/DeleteRowButton'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export default async function AdminContatos() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Contatos</h1>
      <p className="admin-lede">Mensagens recebidas pelo formulário Fale Conosco.</p>

      <div className="admin-panel">
        {messages.length === 0 && <p className="admin-empty">Nenhum contato recebido ainda.</p>}
        <div className="admin-entry-list">
          {messages.map(m => (
            <div key={m.id} className="admin-entry">
              <div className="admin-entry__top">
                <div>
                  <div className="admin-entry__name">{m.nome}</div>
                  <div className="admin-entry__meta">{m.lojaNome}</div>
                </div>
                <div className="admin-entry__actions">
                  <span className="admin-entry__date">{formatDate(m.createdAt)}</span>
                  <DeleteRowButton
                    endpoint={`/api/admin/contact-messages/${m.id}`}
                    confirmMessage={`Excluir a mensagem de "${m.nome}"?`}
                  />
                </div>
              </div>
              <div className="admin-entry__contacts">
                <a href={`mailto:${m.email}`}>{m.email}</a>
                {m.celular && <a href={`tel:${m.celular.replace(/\D/g, '')}`}>{m.celular}</a>}
              </div>
              <p className="admin-entry__desc">{m.mensagem}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
