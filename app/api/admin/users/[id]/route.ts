import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hashPassword } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const { password } = await request.json()
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres' }, { status: 400 })
  }

  try {
    await prisma.adminUser.update({
      where: { id },
      data: { passwordHash: await hashPassword(password) },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  if (id === session.sub) {
    return NextResponse.json({ error: 'Você não pode excluir seu próprio usuário' }, { status: 400 })
  }

  const total = await prisma.adminUser.count()
  if (total <= 1) {
    return NextResponse.json({ error: 'É preciso manter ao menos um usuário admin' }, { status: 400 })
  }

  await prisma.adminUser.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
