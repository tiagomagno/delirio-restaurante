import { prisma } from '@/lib/prisma'
import PagesManager from '@/components/admin/PagesManager'

export default async function AdminPaginas() {
  const items = await prisma.pageContent.findMany({ orderBy: [{ page: 'asc' }, { key: 'asc' }] })

  return (
    <div>
      <h1>Páginas</h1>
      <p className="admin-lede">Escolha a página para editar as seções, os textos e o SEO. As mudanças aparecem no site imediatamente.</p>
      <PagesManager items={items} />
    </div>
  )
}
