import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(slides)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { imageUrl, alt, isSpecial, buttonLabel, buttonUrl } = await request.json()
  if (typeof imageUrl !== 'string' || !imageUrl) {
    return NextResponse.json({ error: 'imageUrl é obrigatório' }, { status: 400 })
  }
  if (typeof alt !== 'string' || !alt.trim()) {
    return NextResponse.json({ error: 'Texto alternativo (alt) é obrigatório' }, { status: 400 })
  }
  if (isSpecial && (typeof buttonLabel !== 'string' || !buttonLabel.trim())) {
    return NextResponse.json({ error: 'Texto do botão é obrigatório em slide especial' }, { status: 400 })
  }
  if (isSpecial && (typeof buttonUrl !== 'string' || !buttonUrl.trim())) {
    return NextResponse.json({ error: 'Link do botão é obrigatório em slide especial' }, { status: 400 })
  }

  const last = await prisma.heroSlide.findFirst({ orderBy: { order: 'desc' } })
  const slide = await prisma.heroSlide.create({
    data: {
      imageUrl,
      alt: alt.trim(),
      order: (last?.order ?? -1) + 1,
      isSpecial: Boolean(isSpecial),
      buttonLabel: isSpecial ? buttonLabel.trim() : null,
      buttonUrl: isSpecial ? buttonUrl.trim() : null,
    },
  })
  return NextResponse.json(slide, { status: 201 })
}
