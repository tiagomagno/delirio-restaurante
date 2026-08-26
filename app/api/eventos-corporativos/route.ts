import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStoreWithRecipients, sendConfirmationEmail } from '@/lib/email/notify'
import { sendEmail } from '@/lib/email/send'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { storeId, nome, pessoas, data, telefone, celular, email, descricao } = body

  if (typeof storeId !== 'string' || !storeId) {
    return NextResponse.json({ error: 'Selecione uma loja' }, { status: 400 })
  }
  if (typeof nome !== 'string' || !nome.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }
  const pessoasNum = Number(pessoas)
  if (!Number.isFinite(pessoasNum) || pessoasNum < 1) {
    return NextResponse.json({ error: 'Quantidade de pessoas inválida' }, { status: 400 })
  }

  const found = await getStoreWithRecipients(storeId)
  if (!found) {
    return NextResponse.json({ error: 'Loja inválida' }, { status: 400 })
  }
  const { store, recipients } = found

  await prisma.eventRequest.create({
    data: {
      lojaEmail: store.email,
      lojaNome: store.name,
      nome: nome.trim(),
      pessoas: pessoasNum,
      data: data ? new Date(data) : null,
      telefone: telefone || null,
      celular: celular || null,
      email: email || null,
      descricao: descricao || null,
    },
  })

  await sendEmail({
    to: recipients,
    subject: `Eventos Corporativos — ${store.name}`,
    text: [
      `Novo pedido de cotação recebido para a loja ${store.name}.`,
      '',
      `Nome: ${nome.trim()}`,
      `Pessoas: ${pessoasNum}`,
      data ? `Data desejada: ${data}` : null,
      email ? `E-mail: ${email}` : null,
      telefone ? `Telefone: ${telefone}` : null,
      celular ? `Celular: ${celular}` : null,
      descricao ? `\nDescrição:\n${descricao}` : null,
    ].filter(Boolean).join('\n'),
  })

  if (email) {
    await sendConfirmationEmail({
      to: email,
      greetingName: nome.trim(),
      formTitle: 'Eventos Corporativos',
      storeName: store.name,
      storeEmail: store.email,
      intro: `Recebemos seu pedido de cotação para a loja ${store.name}. Nossa equipe vai analisar e retornar em breve.`,
      details: [
        { label: 'Pessoas', value: String(pessoasNum) },
        ...(data ? [{ label: 'Data desejada', value: String(data) }] : []),
      ],
    })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
