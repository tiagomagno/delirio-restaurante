import { prisma } from '@/lib/prisma'
import { getPageContent } from '@/lib/data/content'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import ContatosList from '@/components/admin/ContatosList'
import RecipientsSettings from '@/components/admin/RecipientsSettings'

export default async function AdminContatos() {
  const [messages, content] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
    getPageContent('fale-conosco'),
  ])

  return (
    <div>
      <h1>Contatos</h1>
      <p className="admin-lede">Mensagens recebidas pelo formulário Fale Conosco.</p>

      <FormPreviewPanel
        previewUrl="/preview/fale-conosco"
        previewLabel="Pré-visualização do formulário"
        settingsLabel="Destinatários"
        settings={
          <RecipientsSettings
            endpoint="/api/admin/fale-conosco-recipients"
            title="Destinatários extras"
            description="Além do e-mail da loja escolhida no formulário, esses e-mails também recebem toda mensagem enviada pelo Fale Conosco — de qualquer loja. Um e-mail por linha."
            initial={content['notify.extraRecipients'] ?? ''}
          />
        }
      >
      <div className="admin-panel">
        <ContatosList messages={messages} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
