import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'
import { getSession } from '@/lib/session'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_SIZE = 8 * 1024 * 1024 // 8MB
const ALLOWED_FOLDERS = new Set(['hero', 'lojas'])
const WEBP_QUALITY = 70
// Fotos de celular costumam vir em 3000-4000px de largura — bem além do que
// qualquer exibição no site precisa (até o banner em tela cheia). Limita a
// largura pra evitar que a miniatura de 220px no admin sirva o arquivo
// inteiro em altíssima resolução.
const MAX_WIDTH = 2000

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const folder = formData.get('folder')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 })
  }
  if (typeof folder !== 'string' || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: 'Pasta inválida' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Arquivo maior que 8MB' }, { status: 400 })
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })

  const originalBuffer = Buffer.from(await file.arrayBuffer())

  // GIFs animados perderiam a animação na conversão (sharp mantém só o 1º frame), então são salvos como estão.
  if (file.type === 'image/gif') {
    const signature = originalBuffer.subarray(0, 6).toString('ascii')
    if (signature !== 'GIF87a' && signature !== 'GIF89a') {
      return NextResponse.json({ error: 'Arquivo não é um GIF válido' }, { status: 400 })
    }
    const fileName = `${randomUUID()}.gif`
    await writeFile(path.join(uploadDir, fileName), originalBuffer)
    return NextResponse.json({ url: `/uploads/${folder}/${fileName}` })
  }

  const webpBuffer = await sharp(originalBuffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  const fileName = `${randomUUID()}.webp`
  await writeFile(path.join(uploadDir, fileName), webpBuffer)

  return NextResponse.json({ url: `/uploads/${folder}/${fileName}` })
}
