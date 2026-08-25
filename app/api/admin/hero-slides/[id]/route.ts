import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const data: {
    order?: number
    active?: boolean
    alt?: string
    isSpecial?: boolean
    buttonLabel?: string | null
    buttonUrl?: string | null
  } = {}
  if (typeof body.order === 'number') data.order = body.order
  if (typeof body.active === 'boolean') data.active = body.active
  if (typeof body.alt === 'string') data.alt = body.alt
  if (typeof body.isSpecial === 'boolean') data.isSpecial = body.isSpecial
  if (typeof body.buttonLabel === 'string') data.buttonLabel = body.buttonLabel || null
  if (typeof body.buttonUrl === 'string') data.buttonUrl = body.buttonUrl || null

  const slide = await prisma.heroSlide.update({ where: { id }, data })
  return NextResponse.json(slide)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  await prisma.heroSlide.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
