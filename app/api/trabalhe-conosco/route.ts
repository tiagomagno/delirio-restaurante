import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { getStoreWithRecipients } from '@/lib/email/notify'
import { sendEmail } from '@/lib/email/send'
import { SITE_URL } from '@/lib/seo/pages'

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
}
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const storeId = String(formData.get('storeId') || '')
  const nome = String(formData.get('nome') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const telefone = String(formData.get('telefone') || '').trim()
  const vaga = String(formData.get('vaga') || '').trim()
  const mensagem = String(formData.get('mensagem') || '').trim()
  const curriculo = formData.get('curriculo')

  if (!storeId) return NextResponse.json({ error: 'Selecione uma loja' }, { status: 400 })
  if (!nome) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  if (!email) return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
  if (!telefone) return NextResponse.json({ error: 'Celular é obrigatório' }, { status: 400 })
  if (!vaga) return NextResponse.json({ error: 'Selecione uma vaga' }, { status: 400 })
  if (!(curriculo instanceof File) || curriculo.size === 0) {
    return NextResponse.json({ error: 'Envie seu currículo' }, { status: 400 })
  }
  const ext = ALLOWED_TYPES[curriculo.type]
  if (!ext) return NextResponse.json({ error: 'Currículo deve ser PDF, DOC ou DOCX' }, { status: 400 })
  if (curriculo.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Currículo maior que 10MB' }, { status: 400 })
  }

  const found = await getStoreWithRecipients(storeId)
  if (!found) return NextResponse.json({ error: 'Loja inválida' }, { status: 400 })
  const { store, recipients } = found

  const fileName = `${randomUUID()}${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'curriculos')
  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await curriculo.arrayBuffer())
  await writeFile(path.join(uploadDir, fileName), buffer)
  const curriculoUrl = `/uploads/curriculos/${fileName}`

  await prisma.jobApplication.create({
    data: {
      lojaEmail: store.email,
      lojaNome: store.name,
      nome,
      email,
      telefone,
      vaga,
      mensagem: mensagem || null,
      curriculoUrl,
      curriculoNome: curriculo.name,
    },
  })

  await sendEmail({
    to: recipients,
    subject: `Trabalhe Conosco — ${store.name} (${vaga})`,
    text: [
      `Nova candidatura recebida pelo Trabalhe Conosco para a loja ${store.name}.`,
      '',
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Celular: ${telefone}`,
      `Vaga: ${vaga}`,
      mensagem ? `\nMensagem:\n${mensagem}` : null,
      '',
      `Currículo: ${SITE_URL}${curriculoUrl}`,
    ].filter(Boolean).join('\n'),
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
