import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

const KEY = 'notify.extraRecipients'

/**
 * Fábrica do handler PATCH usado pelas rotas /api/admin/*-recipients — cada
 * formulário guarda sua lista de e-mails em PageContent(page, "notify.extraRecipients").
 */
export function createRecipientsPatchHandler(page: string, label: string) {
  return async function PATCH(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { value } = await request.json()
    if (typeof value !== 'string') {
      return NextResponse.json({ error: 'value é obrigatório' }, { status: 400 })
    }

    const item = await prisma.pageContent.upsert({
      where: { page_key: { page, key: KEY } },
      update: { value },
      create: { page, key: KEY, label, value },
    })
    return NextResponse.json(item)
  }
}
