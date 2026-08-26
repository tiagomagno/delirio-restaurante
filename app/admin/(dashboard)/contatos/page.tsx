import { prisma } from '@/lib/prisma'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import ContatosList from '@/components/admin/ContatosList'

export default async function AdminContatos() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Contatos</h1>
      <p className="admin-lede">Mensagens recebidas pelo formulário Fale Conosco.</p>

      <FormPreviewPanel previewUrl="/preview/fale-conosco" previewLabel="Pré-visualização do formulário">
      <div className="admin-panel">
        <ContatosList messages={messages} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
