import { prisma } from '@/lib/prisma'
import FormPreviewPanel from '@/components/admin/FormPreviewPanel'
import PedidosList from '@/components/admin/PedidosList'

export default async function AdminPedidos() {
  const requests = await prisma.eventRequest.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1>Pedidos</h1>
      <p className="admin-lede">Solicitações de orçamento recebidas pelo formulário de Eventos Corporativos.</p>

      <FormPreviewPanel previewUrl="/preview/eventos-corporativos" previewLabel="Pré-visualização do formulário">
      <div className="admin-panel">
        <PedidosList requests={requests} />
      </div>
      </FormPreviewPanel>
    </div>
  )
}
