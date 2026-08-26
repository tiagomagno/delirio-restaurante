import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyOuvidoria } from '@/lib/email/notify'

export async function POST(request: NextRequest) {
  const { mensagem } = await request.json()

  if (typeof mensagem !== 'string' || !mensagem.trim()) {
    return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
  }

  await prisma.ouvidoriaMessage.create({
    data: { mensagem: mensagem.trim() },
  })

  await notifyOuvidoria(
    ['Nova mensagem recebida pelo canal de Ouvidoria.', '', 'Mensagem:', mensagem.trim()].join('\n'),
  )

  return NextResponse.json({ ok: true }, { status: 201 })
}
