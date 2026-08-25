// Converte as imagens legadas de public/wp-content (JPG/PNG) para WebP (qualidade 70),
// gerando os .webp ao lado dos originais sem apagá-los. Idempotente: pula o que já existe.
import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..', 'public', 'wp-content')
const QUALITY = 70
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png'])

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walk(full))
    } else {
      files.push(full)
    }
  }
  return files
}

async function main() {
  const files = await walk(ROOT)
  const targets = files.filter(f => SOURCE_EXT.has(path.extname(f).toLowerCase()))

  let converted = 0
  let skipped = 0
  let totalBefore = 0
  let totalAfter = 0

  for (const file of targets) {
    const webpPath = file.slice(0, -path.extname(file).length) + '.webp'
    if (files.includes(webpPath)) {
      skipped++
      continue
    }
    const before = (await stat(file)).size
    await sharp(file).webp({ quality: QUALITY }).toFile(webpPath)
    const after = (await stat(webpPath)).size
    totalBefore += before
    totalAfter += after
    converted++
    console.log(`${path.relative(ROOT, file)} -> .webp  (${(before / 1024).toFixed(0)}KiB -> ${(after / 1024).toFixed(0)}KiB)`)
  }

  console.log(`\nConvertidos: ${converted}, já existiam: ${skipped}`)
  if (converted > 0) {
    console.log(`Tamanho total: ${(totalBefore / 1024 / 1024).toFixed(2)}MiB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MiB`)
  }
}

main()
