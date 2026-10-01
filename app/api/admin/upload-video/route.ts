import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { getSession } from '@/lib/session'

const MAX_SIZE = 80 * 1024 * 1024 // 80MB — trailer curto; vídeos longos vão pro YouTube
const ALLOWED_FOLDERS = new Set(['sobre'])

function detectKind(buf: Buffer): 'mp4' | 'webm' | null {
  // MP4/MOV: "ftyp" a partir do byte 4. WebM/Matroska: assinatura EBML 1A 45 DF A3.
  if (buf.length > 12 && buf.subarray(4, 8).toString('ascii') === 'ftyp') return 'mp4'
  if (buf.length > 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'webm'
  return null
}

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
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Vídeo maior que 80MB' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const kind = detectKind(buffer)
  if (!kind) {
    return NextResponse.json({ error: 'Envie um vídeo MP4 ou WebM' }, { status: 400 })
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })
  const fileName = `${randomUUID()}.${kind}`
  await writeFile(path.join(uploadDir, fileName), buffer)

  return NextResponse.json({ url: `/uploads/${folder}/${fileName}` })
}
