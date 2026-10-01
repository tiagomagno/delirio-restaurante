// Script pontual: cria só as linhas 'doc.*' da página
// 'sobre-nos' (seção "40 anos — Documentário"), sem tocar em nenhum outro
// conteúdo já editado via /admin. Não sobrescreve valores que já existam.
// Rodar uma única vez em produção: node prisma/add-sobre-documentario.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const rows = [
  { key: 'doc.enabled', label: '40 anos — Documentário — Exibir seção', value: 'false' },
  { key: 'doc.image', label: '40 anos — Documentário — Imagem do banner', value: '' },
  { key: 'doc.title', label: '40 anos — Documentário — Título (leitores de tela)', value: '40 anos de Delírio — O documentário' },
  { key: 'doc.video_url', label: '40 anos — Documentário — Link do vídeo no YouTube', value: '' },
  { key: 'doc.full_url', label: '40 anos — Documentário — Link da versão completa (botão)', value: '' },
  { key: 'doc.cta', label: '40 anos — Documentário — Texto do botão', value: 'Assistir à versão completa' },
]

for (const r of rows) {
  await prisma.pageContent.upsert({
    where: { page_key: { page: 'sobre-nos', key: r.key } },
    update: {},
    create: { page: 'sobre-nos', ...r },
  })
  console.log(`${r.key} ok`)
}

await prisma.$disconnect()
