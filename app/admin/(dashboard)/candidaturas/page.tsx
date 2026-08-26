import { prisma } from '@/lib/prisma'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import CandidaturasList from '@/components/admin/CandidaturasList'

export default async function AdminCandidaturas() {
  const applications = await prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Candidaturas</h1>
      <p className="admin-lede">Candidaturas recebidas pelo formulário Trabalhe Conosco.</p>

      <FormPreviewPanel previewUrl="/preview/trabalhe-conosco" previewLabel="Pré-visualização do formulário">
      <div className="admin-panel">
        <CandidaturasList applications={applications} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
