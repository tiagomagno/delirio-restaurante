import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { lojaEmail, lojaNome, nome, pessoas, data, telefone, celular, email, descricao } = body

  if (typeof lojaEmail !== 'string' || !lojaEmail || typeof lojaNome !== 'string' || !lojaNome) {
    return NextResponse.json({ error: 'Selecione uma loja' }, { status: 400 })
  }
  if (typeof nome !== 'string' || !nome.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }
  const pessoasNum = Number(pessoas)
  if (!Number.isFinite(pessoasNum) || pessoasNum < 1) {
    return NextResponse.json({ error: 'Quantidade de pessoas inválida' }, { status: 400 })
  }

  await prisma.eventRequest.create({
    data: {
      lojaEmail,
      lojaNome,
      nome: nome.trim(),
      pessoas: pessoasNum,
      data: data ? new Date(data) : null,
      telefone: telefone || null,
      celular: celular || null,
      email: email || null,
      descricao: descricao || null,
    },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
