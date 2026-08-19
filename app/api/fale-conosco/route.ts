import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { lojaEmail, lojaNome, nome, email, celular, mensagem } = body

  if (typeof lojaEmail !== 'string' || !lojaEmail || typeof lojaNome !== 'string' || !lojaNome) {
    return NextResponse.json({ error: 'Selecione uma loja' }, { status: 400 })
  }
  if (typeof nome !== 'string' || !nome.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }
  if (typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
  }
  if (typeof mensagem !== 'string' || !mensagem.trim()) {
    return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
  }

  await prisma.contactMessage.create({
    data: {
      lojaEmail,
      lojaNome,
      nome: nome.trim(),
      email: email.trim(),
      celular: celular || '',
      mensagem: mensagem.trim(),
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
