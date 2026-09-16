import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const CONTENT_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
}

// Se o arquivo estático não existir ainda (às vezes o upload demora um
// instante pra propagar no storage), o Next.js cai no fallback padrão de
// "não encontrado" — e esse fallback fica em cache por minutos, deixando a
// imagem quebrada bem depois do arquivo já existir. Essa rota assume o
// controle de /uploads: tenta ler o arquivo direto do disco algumas vezes
// antes de desistir, e nunca deixa um 404 momentâneo ficar em cache.
const RETRY_DELAYS_MS = [150, 300, 600, 1200]

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params
  const uploadsRoot = path.join(process.cwd(), 'public', 'uploads')
  const filePath = path.join(uploadsRoot, ...segments)

  if (filePath !== uploadsRoot && !filePath.startsWith(uploadsRoot + path.sep)) {
    return new NextResponse(null, { status: 400 })
  }

  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()]
  if (!contentType) {
    return new NextResponse(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  for (let attempt = 0; ; attempt++) {
    try {
      const buffer = await readFile(filePath)
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch {
      if (attempt >= RETRY_DELAYS_MS.length) {
        return new NextResponse(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
      }
      await sleep(RETRY_DELAYS_MS[attempt])
    }
  }
}
