import { prisma } from '@/lib/prisma'
import ContentManager from '@/components/admin/ContentManager'

export default async function AdminPaginas() {
  const items = await prisma.pageContent.findMany({ orderBy: [{ page: 'asc' }, { key: 'asc' }] })

  return (
    <div>
      <h1>Páginas</h1>
      <p className="admin-lede">Escolha a página e edite o texto. As mudanças aparecem no site imediatamente.</p>
      <ContentManager items={items} />
    </div>
  )
}
