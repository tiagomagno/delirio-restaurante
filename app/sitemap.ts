import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { PUBLIC_PAGES, SITE_URL } from '@/lib/seo/pages'

// force-dynamic é obrigatório aqui (não só revalidate): sem ele o Next tenta
// pre-renderizar este route em build time, e o banco não é alcançável na
// etapa de build do Docker (só em runtime) — isso já quebrou o build antes,
// ver commit b6f967f.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contents = await prisma.pageContent.findMany({
    select: { page: true, updatedAt: true },
  })

  const lastModifiedByPage = new Map<string, Date>()
  for (const c of contents) {
    const current = lastModifiedByPage.get(c.page)
    if (!current || c.updatedAt > current) lastModifiedByPage.set(c.page, c.updatedAt)
  }

  const buildTime = new Date()

  return PUBLIC_PAGES.map(p => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: lastModifiedByPage.get(p.slug) ?? buildTime,
    changeFrequency: p.slug === 'home' ? 'weekly' : 'monthly',
    priority: p.slug === 'home' ? 1 : 0.7,
  }))
}
