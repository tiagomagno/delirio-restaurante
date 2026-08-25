import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { PUBLIC_PAGES, SITE_URL } from '@/lib/seo/pages'

// Sitemap não precisa refletir uma edição do admin na hora — ficar até 1h
// desatualizado é inofensivo aqui (diferente das páginas de conteúdo, onde
// force-dynamic é necessário). Evita bater no banco a cada crawl do Google.
export const revalidate = 3600

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
