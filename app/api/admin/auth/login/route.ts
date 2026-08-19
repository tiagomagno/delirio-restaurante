import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSessionToken, verifyPassword, SESSION_COOKIE, SESSION_TTL_SECONDS } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
  const valid = user ? await verifyPassword(password, user.passwordHash) : false

  if (!user || !valid) {
    return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 })
  }

  const token = await createSessionToken({ sub: user.id, email: user.email })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return response
}
