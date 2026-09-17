// Script pontual: cria (ou atualiza) só a linha 'social.youtube_url' em
// PageContent, sem tocar em nenhum outro conteúdo já editado via /admin.
// Rodar uma única vez em produção: node prisma/add-social-youtube.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

await prisma.pageContent.upsert({
  where: { page_key: { page: 'global', key: 'social.youtube_url' } },
  update: {},
  create: {
    page: 'global',
    key: 'social.youtube_url',
    label: 'Link do YouTube',
    value: 'https://www.youtube.com/@deliriotropical9482',
  },
})

console.log('social.youtube_url ok')
await prisma.$disconnect()
