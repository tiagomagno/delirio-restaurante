import { prisma } from '@/lib/prisma'
import { getPageContent } from '@/lib/data/content'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import PedidosList from '@/components/admin/PedidosList'
import EventosRecipientsSettings from '@/components/admin/EventosRecipientsSettings'

export default async function AdminPedidos() {
  const [requests, content] = await Promise.all([
    prisma.eventRequest.findMany({ orderBy: { createdAt: 'desc' } }),
    getPageContent('eventos-corporativos'),
  ])

  return (
    <div>
      <h1>Pedidos</h1>
      <p className="admin-lede">Solicitações de orçamento recebidas pelo formulário de Eventos Corporativos.</p>

      <FormPreviewPanel
        previewUrl="/preview/eventos-corporativos"
        previewLabel="Pré-visualização do formulário"
        settingsLabel="Destinatários"
        settings={<EventosRecipientsSettings initial={content['notify.extraRecipients'] ?? ''} />}
      >
      <div className="admin-panel">
        <PedidosList requests={requests} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
