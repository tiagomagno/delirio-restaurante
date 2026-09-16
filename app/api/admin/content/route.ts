import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const page = request.nextUrl.searchParams.get('page')
  const where = page ? { page } : {}
  const items = await prisma.pageContent.findMany({ where, orderBy: [{ page: 'asc' }, { key: 'asc' }] })
  return NextResponse.json(items)
}
