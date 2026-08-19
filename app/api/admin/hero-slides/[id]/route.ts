import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const data: { order?: number; active?: boolean } = {}
  if (typeof body.order === 'number') data.order = body.order
  if (typeof body.active === 'boolean') data.active = body.active

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
