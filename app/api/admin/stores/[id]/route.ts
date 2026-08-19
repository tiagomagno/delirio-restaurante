import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

const EDITABLE_FIELDS = [
  'slug', 'name', 'address', 'bairroCity', 'region', 'image', 'photos',
  'mapsUrl', 'deliveryUrl', 'menuUrl', 'hours', 'phones', 'whatsapp',
  'email', 'highlight', 'order', 'active',
] as const

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const data: Record<string, unknown> = {}
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field]
  }

  try {
    const store = await prisma.store.update({ where: { id }, data })
    return NextResponse.json(store)
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar loja' }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  await prisma.store.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
