import { prisma } from '@/lib/prisma'
import { getPageContent } from '@/lib/data/content'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import CandidaturasList from '@/components/admin/CandidaturasList'
import RecipientsSettings from '@/components/admin/RecipientsSettings'

export default async function AdminCandidaturas() {
  const [applications, content] = await Promise.all([
    prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' } }),
    getPageContent('trabalhe-conosco'),
  ])

  return (
    <div>
      <h1>Candidaturas</h1>
      <p className="admin-lede">Candidaturas recebidas pelo formulário Trabalhe Conosco.</p>

      <FormPreviewPanel
        previewUrl="/preview/trabalhe-conosco"
        previewLabel="Pré-visualização do formulário"
        settingsLabel="Destinatários"
        settings={
          <RecipientsSettings
            endpoint="/api/admin/trabalhe-conosco-recipients"
            title="Destinatários extras"
            description="Além do e-mail da loja escolhida no formulário, esses e-mails também recebem toda candidatura enviada pelo Trabalhe Conosco — de qualquer loja. Um e-mail por linha."
            initial={content['notify.extraRecipients'] ?? ''}
          />
        }
      >
      <div className="admin-panel">
        <CandidaturasList applications={applications} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
