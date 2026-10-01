import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { validateSeoValueForSave } from '@/lib/seo/fieldCheck'
import { isValidHttpUrl } from '@/lib/validateUrl'
import { parseVideoUrl } from '@/lib/video'

// Campos da seção "40 anos" de Sobre Nós têm formato próprio.
function validateDocValue(key: string, value: string): string | null {
  const v = value.trim()
  if (key === 'doc.enabled') return v === 'true' || v === 'false' ? null : 'Valor inválido'
  if (key === 'doc.image') return v === '' || v.startsWith('/uploads/') ? null : 'Imagem inválida'
  if (key === 'doc.video_url') return v === '' || parseVideoUrl(v) ? null : 'o link do vídeo precisa ser do YouTube, do Instagram ou um vídeo enviado pelo painel.'
  if (key === 'doc.full_url') return v === '' || isValidHttpUrl(v) ? null : 'o link do botão precisa começar com http:// ou https://.'
  return null
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const { value } = await request.json()
  if (typeof value !== 'string') {
    return NextResponse.json({ error: 'value é obrigatório' }, { status: 400 })
  }

  const existing = await prisma.pageContent.findUnique({ where: { id }, select: { key: true } })
  if (!existing) {
    return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
  }

  const validationError = validateSeoValueForSave(existing.key, value)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const docError = validateDocValue(existing.key, value)
  if (docError) {
    return NextResponse.json({ error: docError }, { status: 400 })
  }

  const item = await prisma.pageContent.update({ where: { id }, data: { value } })
  return NextResponse.json(item)
}
