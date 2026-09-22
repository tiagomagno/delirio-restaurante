/**
 * Reprocessa as imagens ja enviadas pelo admin (public/uploads/hero e
 * public/uploads/lojas) que ficaram em resolucao original antes da correcao
 * do endpoint de upload (que agora limita tudo a 2000px de largura).
 *
 * So mexe em arquivos do disco — nao toca no banco de dados. Como o nome do
 * arquivo nao muda, as URLs salvas no Prisma (HeroSlide.imageUrl,
 * Store.image, Store.photos[].url) continuam apontando pro mesmo lugar.
 *
 * Idempotente: rodar de novo so reprocessa o que ainda estiver acima de
 * 2000px (na pratica, nada, ja que a segunda passada nao encontra mais
 * nada maior que o limite).
 *
 * Uso (rodar dentro do container/pasta da aplicacao em producao, onde existe
 * public/uploads e node_modules com o sharp instalado):
 *   node scripts/resize-existing-uploads.mjs
 */
import { readFile, readdir, rename, writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const FOLDERS = ['hero', 'lojas']
const MAX_WIDTH = 2000
const WEBP_QUALITY = 70

async function processFile(filePath) {
  // Lê o arquivo inteiro pra memória antes de processar, em vez de passar o
  // caminho direto pro sharp — assim nenhum handle de leitura fica preso ao
  // arquivo original na hora de sobrescrevê-lo (renomear por cima de um
  // arquivo que o sharp ainda tem aberto falha silenciosamente em alguns
  // ambientes).
  const originalBuffer = await readFile(filePath)
  const before = originalBuffer.length
  const metadata = await sharp(originalBuffer).metadata()

  if (!metadata.width || metadata.width <= MAX_WIDTH) {
    console.log(`[OK]   ${filePath} — ${metadata.width}px, já dentro do limite`)
    return { resized: false, saved: 0 }
  }

  const resizedBuffer = await sharp(originalBuffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  const tmpPath = `${filePath}.tmp`
  await writeFile(tmpPath, resizedBuffer)
  await rename(tmpPath, filePath)

  const savedKb = ((before - resizedBuffer.length) / 1024).toFixed(0)
  console.log(`[FIX]  ${filePath} — ${metadata.width}px → ${MAX_WIDTH}px (${savedKb} KB economizados)`)
  return { resized: true, saved: before - resizedBuffer.length }
}

async function main() {
  let scanned = 0
  let resized = 0
  let totalSaved = 0
  let errors = 0

  for (const folder of FOLDERS) {
    const dir = path.join(process.cwd(), 'public', 'uploads', folder)
    let entries
    try {
      entries = await readdir(dir)
    } catch {
      console.log(`[SKIP] pasta ${dir} não existe, pulando`)
      continue
    }

    for (const entry of entries) {
      if (!entry.endsWith('.webp')) continue // gifs animados ficam como estão, mesma regra do upload
      scanned++
      const filePath = path.join(dir, entry)
      try {
        const result = await processFile(filePath)
        if (result.resized) {
          resized++
          totalSaved += result.saved
        }
      } catch (err) {
        errors++
        console.error(`[ERRO] ${filePath}:`, err instanceof Error ? err.message : err)
      }
    }
  }

  console.log('\n--- Resumo ---')
  console.log(`Arquivos verificados: ${scanned}`)
  console.log(`Redimensionados: ${resized}`)
  console.log(`Espaço economizado: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`)
  if (errors > 0) console.log(`Erros: ${errors}`)
}

main()
