import { cache } from 'react'
import { prisma } from '@/lib/prisma'

export const getPageContent = cache(async (page: string): Promise<Record<string, string>> => {
  const items = await prisma.pageContent.findMany({ where: { page } })
  return Object.fromEntries(items.map(i => [i.key, i.value]))
})
