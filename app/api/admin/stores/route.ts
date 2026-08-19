import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  const stores = await prisma.store.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(stores)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json()
  const required = ['slug', 'name', 'address', 'bairroCity', 'region', 'image', 'mapsUrl', 'hours', 'phones', 'email']
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return NextResponse.json({ error: `Campo obrigatório ausente: ${field}` }, { status: 400 })
    }
  }

  const last = await prisma.store.findFirst({ orderBy: { order: 'desc' } })
  try {
    const store = await prisma.store.create({
      data: {
        slug: body.slug,
        name: body.name,
        address: body.address,
        bairroCity: body.bairroCity,
        region: body.region,
        image: body.image,
        photos: body.photos ?? undefined,
        mapsUrl: body.mapsUrl,
        deliveryUrl: body.deliveryUrl || null,
        menuUrl: body.menuUrl || null,
        hours: body.hours,
        phones: body.phones,
        whatsapp: body.whatsapp || null,
        email: body.email,
        highlight: Boolean(body.highlight),
        order: (last?.order ?? -1) + 1,
      },
    })
    return NextResponse.json(store, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error && err.message.includes('Unique constraint')
      ? 'Já existe uma loja com esse slug'
      : 'Erro ao criar loja'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
