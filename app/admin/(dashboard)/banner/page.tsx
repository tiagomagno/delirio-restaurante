import { prisma } from '@/lib/prisma'
import BannerManager from '@/components/admin/BannerManager'

export default async function AdminBanner() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } })

  return (
    <div>
      <h1>Banner principal</h1>
      <p className="admin-lede">Imagens exibidas no carrossel do topo da home.</p>
      <BannerManager slides={slides} />
    </div>
  )
}
