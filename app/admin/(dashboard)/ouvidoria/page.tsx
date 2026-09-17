import { prisma } from '@/lib/prisma'
import { getPageContent } from '@/lib/data/content'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import OuvidoriaList from '@/components/admin/OuvidoriaList'
import RecipientsSettings from '@/components/admin/RecipientsSettings'

export default async function AdminOuvidoria() {
  const [messages, content] = await Promise.all([
    prisma.ouvidoriaMessage.findMany({ orderBy: { createdAt: 'desc' } }),
    getPageContent('ouvidoria'),
  ])

  return (
    <div>
      <h1>Ouvidoria</h1>
      <p className="admin-lede">Mensagens anônimas recebidas pelo canal de Ouvidoria.</p>

      <FormPreviewPanel
        previewUrl="/preview/ouvidoria"
        previewLabel="Pré-visualização do formulário"
        settingsLabel="Destinatários"
        settings={
          <RecipientsSettings
            endpoint="/api/admin/ouvidoria-recipients"
            title="Destinatários"
            description="E-mails que recebem toda mensagem enviada pelo canal de Ouvidoria (anônimo, sem loja associada). Um e-mail por linha."
            initial={content['notify.extraRecipients'] ?? ''}
          />
        }
      >
      <div className="admin-panel">
        <OuvidoriaList messages={messages} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
