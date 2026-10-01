import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { createReadStream } from 'fs'
import { Readable } from 'stream'
import path from 'path'

export const dynamic = 'force-dynamic'

const CONTENT_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
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

// Vídeo precisa de suporte a Range (Safari exige; todos usam pra buscar/seek).
async function serveVideo(request: NextRequest, filePath: string, contentType: string) {
  for (let attempt = 0; ; attempt++) {
    try {
      const { size } = await stat(filePath)
      const headers: Record<string, string> = {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      }

      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range') ?? '')
      if (range) {
        let start = range[1] === '' ? NaN : Number(range[1])
        let end = range[2] === '' ? NaN : Number(range[2])
        if (Number.isNaN(start)) {
          // "bytes=-N": últimos N bytes
          start = Math.max(size - end, 0)
          end = size - 1
        } else if (Number.isNaN(end) || end >= size) {
          end = size - 1
        }
        if (start > end || start >= size) {
          return new NextResponse(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
        }
        const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream
        return new NextResponse(stream, {
          status: 206,
          headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) },
        })
      }

      const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream
      return new NextResponse(stream, { headers: { ...headers, 'Content-Length': String(size) } })
    } catch {
      if (attempt >= RETRY_DELAYS_MS.length) {
        return new NextResponse(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
      }
      await sleep(RETRY_DELAYS_MS[attempt])
    }
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
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

  if (contentType.startsWith('video/')) return serveVideo(request, filePath, contentType)

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
