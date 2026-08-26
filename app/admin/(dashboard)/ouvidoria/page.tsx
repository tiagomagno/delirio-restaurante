import { prisma } from '@/lib/prisma'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import OuvidoriaList from '@/components/admin/OuvidoriaList'

export default async function AdminOuvidoria() {
  const messages = await prisma.ouvidoriaMessage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Ouvidoria</h1>
      <p className="admin-lede">Mensagens anônimas recebidas pelo canal de Ouvidoria.</p>

      <FormPreviewPanel previewUrl="/preview/ouvidoria" previewLabel="Pré-visualização do formulário">
      <div className="admin-panel">
        <OuvidoriaList messages={messages} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
