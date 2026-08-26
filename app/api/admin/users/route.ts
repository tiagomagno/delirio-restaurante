import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, createdAt: true },
  })
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { email, password } = await request.json()
  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
  }
  if (typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres' }, { status: 400 })
  }

  try {
    const user = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash: await hashPassword(password),
      },
      select: { id: true, email: true, createdAt: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error && err.message.includes('Unique constraint')
      ? 'Já existe um usuário com esse e-mail'
      : 'Erro ao criar usuário'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
