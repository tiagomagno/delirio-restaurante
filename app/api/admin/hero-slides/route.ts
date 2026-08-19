import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(slides)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { imageUrl } = await request.json()
  if (typeof imageUrl !== 'string' || !imageUrl) {
    return NextResponse.json({ error: 'imageUrl é obrigatório' }, { status: 400 })
  }

  const last = await prisma.heroSlide.findFirst({ orderBy: { order: 'desc' } })
  const slide = await prisma.heroSlide.create({
    data: { imageUrl, order: (last?.order ?? -1) + 1 },
  })
  return NextResponse.json(slide, { status: 201 })
}
