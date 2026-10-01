import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { LAYOUT_KEY, PAGE_SECTIONS, resolveSections } from '@/lib/sections'

// Salva a ordem e a visibilidade das seções de uma página.
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const page = body?.page
  const sections = body?.sections
  const defs = typeof page === 'string' ? PAGE_SECTIONS[page] : undefined

  if (!defs || !Array.isArray(sections)) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const known = new Set(defs.map(d => d.id))
  const seen = new Set<string>()
  for (const s of sections) {
    if (!s || typeof s.id !== 'string' || typeof s.visible !== 'boolean' || !known.has(s.id) || seen.has(s.id)) {
      return NextResponse.json({ error: 'Seção inválida' }, { status: 400 })
    }
    seen.add(s.id)
  }

  // resolveSections normaliza: seção fixa no topo e visível, ids faltantes no fim
  const normalized = resolveSections(page, JSON.stringify(sections)).map(s => ({ id: s.id, visible: s.visible }))
  const value = JSON.stringify(normalized)

  const row = await prisma.pageContent.upsert({
    where: { page_key: { page, key: LAYOUT_KEY } },
    update: { value },
    create: { page, key: LAYOUT_KEY, label: 'Ordem e visibilidade das seções', value },
  })
  return NextResponse.json({ id: row.id, sections: normalized })
}
