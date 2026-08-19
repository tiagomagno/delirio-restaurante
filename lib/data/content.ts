import { prisma } from '@/lib/prisma'

export async function getPageContent(page: string): Promise<Record<string, string>> {
  const items = await prisma.pageContent.findMany({ where: { page } })
  return Object.fromEntries(items.map(i => [i.key, i.value]))
}
