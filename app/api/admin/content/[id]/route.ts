import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const { value } = await request.json()
  if (typeof value !== 'string') {
    return NextResponse.json({ error: 'value é obrigatório' }, { status: 400 })
  }

  const item = await prisma.pageContent.update({ where: { id }, data: { value } })
  return NextResponse.json(item)
}
