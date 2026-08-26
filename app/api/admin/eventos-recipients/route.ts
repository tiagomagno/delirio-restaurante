import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

const PAGE = 'eventos-corporativos'
const KEY = 'notify.extraRecipients'

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { value } = await request.json()
  if (typeof value !== 'string') {
    return NextResponse.json({ error: 'value é obrigatório' }, { status: 400 })
  }

  const item = await prisma.pageContent.upsert({
    where: { page_key: { page: PAGE, key: KEY } },
    update: { value },
    create: { page: PAGE, key: KEY, label: 'Destinatários extras (Eventos Corporativos)', value },
  })
  return NextResponse.json(item)
}
