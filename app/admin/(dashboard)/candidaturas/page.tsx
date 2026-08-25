import { prisma } from '@/lib/prisma'
import DeleteRowButton from '@/components/admin/DeleteRowButton'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export default async function AdminCandidaturas() {
  const applications = await prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Candidaturas</h1>
      <p className="admin-lede">Candidaturas recebidas pelo formulário Trabalhe Conosco.</p>

      <FormPreviewPanel previewUrl="/preview/trabalhe-conosco" previewLabel="Pré-visualização do formulário">
      <div className="admin-panel">
        {applications.length === 0 && <p className="admin-empty">Nenhuma candidatura recebida ainda.</p>}
        <div className="admin-entry-list">
          {applications.map(a => (
            <div key={a.id} className="admin-entry">
              <div className="admin-entry__top">
                <div>
                  <div className="admin-entry__name">{a.nome}</div>
                  <div className="admin-entry__meta">{a.lojaNome} · {a.vaga}</div>
                </div>
                <div className="admin-entry__actions">
                  <span className="admin-entry__date">{formatDate(a.createdAt)}</span>
                  <DeleteRowButton
                    endpoint={`/api/admin/job-applications/${a.id}`}
                    confirmMessage={`Excluir a candidatura de "${a.nome}"?`}
                  />
                </div>
              </div>
              <div className="admin-entry__contacts">
                <a href={`mailto:${a.email}`}>{a.email}</a>
                <a href={`tel:${a.telefone.replace(/\D/g, '')}`}>{a.telefone}</a>
                <a href={a.curriculoUrl} target="_blank" rel="noopener">{a.curriculoNome}</a>
              </div>
              {a.mensagem && <p className="admin-entry__desc">{a.mensagem}</p>}
            </div>
          ))}
        </div>
      </div>
      </FormPreviewPanel>
    </div>
  )
}
