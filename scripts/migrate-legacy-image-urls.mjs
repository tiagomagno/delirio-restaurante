// Atualiza, no banco já populado, as URLs de imagens legadas de /wp-content/uploads
// que ainda apontam pra .jpg/.jpeg/.png para a versão .webp gerada por
// scripts/convert-legacy-images.mjs. Idempotente: rodar de novo não faz nada
// se já não houver mais nada em .jpg/.jpeg/.png.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LEGACY_EXT_RE = /(\/wp-content\/uploads\/[^"'\s]+)\.(jpe?g|png)(?=$|["'\s])/gi

function toWebp(url) {
  if (typeof url !== 'string') return url
  return url.replace(LEGACY_EXT_RE, '$1.webp')
}

async function main() {
  let slidesChanged = 0
  const slides = await prisma.heroSlide.findMany()
  for (const slide of slides) {
    const next = toWebp(slide.imageUrl)
    if (next !== slide.imageUrl) {
      await prisma.heroSlide.update({ where: { id: slide.id }, data: { imageUrl: next } })
      slidesChanged++
      console.log(`HeroSlide ${slide.id}: ${slide.imageUrl} -> ${next}`)
    }
  }

  let storesChanged = 0
  const stores = await prisma.store.findMany()
  for (const store of stores) {
    const nextImage = toWebp(store.image)
    const nextPhotos = Array.isArray(store.photos) ? store.photos.map(toWebp) : store.photos
    const imageDiff = nextImage !== store.image
    const photosDiff = Array.isArray(store.photos) && JSON.stringify(nextPhotos) !== JSON.stringify(store.photos)
    if (imageDiff || photosDiff) {
      await prisma.store.update({
        where: { id: store.id },
        data: { image: nextImage, photos: nextPhotos },
      })
      storesChanged++
      console.log(`Store ${store.slug}: ${imageDiff ? 'image' : ''}${imageDiff && photosDiff ? ' + ' : ''}${photosDiff ? 'photos' : ''} atualizados`)
    }
  }

  let contentChanged = 0
  const ogEntries = await prisma.pageContent.findMany({ where: { key: 'og.image' } })
  for (const entry of ogEntries) {
    const next = toWebp(entry.value)
    if (next !== entry.value) {
      await prisma.pageContent.update({ where: { id: entry.id }, data: { value: next } })
      contentChanged++
      console.log(`PageContent ${entry.page}.og.image: ${entry.value} -> ${next}`)
    }
  }

  console.log(`\nHeroSlide atualizados: ${slidesChanged}/${slides.length}`)
  console.log(`Store atualizados: ${storesChanged}/${stores.length}`)
  console.log(`PageContent (og.image) atualizados: ${contentChanged}/${ogEntries.length}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
