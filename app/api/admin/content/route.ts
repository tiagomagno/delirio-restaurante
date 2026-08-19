import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page')
  const where = page ? { page } : {}
  const items = await prisma.pageContent.findMany({ where, orderBy: [{ page: 'asc' }, { key: 'asc' }] })
  return NextResponse.json(items)
}
