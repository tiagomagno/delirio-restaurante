import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getStoreWithRecipients, sendConfirmationEmail } from '@/lib/email/notify'
import { sendEmail } from '@/lib/email/send'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { storeId, nome, email, celular, mensagem } = body

  if (typeof storeId !== 'string' || !storeId) {
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

  const found = await getStoreWithRecipients(storeId)
  if (!found) {
    return NextResponse.json({ error: 'Loja inválida' }, { status: 400 })
  }
  const { store, recipients } = found

  await prisma.contactMessage.create({
    data: {
      lojaEmail: store.email,
      lojaNome: store.name,
      nome: nome.trim(),
      email: email.trim(),
      celular: celular || '',
      mensagem: mensagem.trim(),
    },
  })

  await sendEmail({
    to: recipients,
    subject: `Fale Conosco — ${store.name}`,
    text: [
      `Nova mensagem recebida pelo Fale Conosco para a loja ${store.name}.`,
      '',
      `Nome: ${nome.trim()}`,
      `E-mail: ${email.trim()}`,
      celular ? `Celular: ${celular}` : null,
      '',
      'Mensagem:',
      mensagem.trim(),
    ].filter(Boolean).join('\n'),
  })

  await sendConfirmationEmail({
    to: email.trim(),
    greetingName: nome.trim(),
    formTitle: 'Fale Conosco',
    storeName: store.name,
    storeEmail: store.email,
    intro: `Recebemos sua mensagem enviada para a loja ${store.name}. Nossa equipe vai te responder em breve.`,
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
