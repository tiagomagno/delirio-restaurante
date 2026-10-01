// Seções das páginas editáveis pelo admin: ordem, visibilidade e agrupamento
// dos textos. Sem dependência de banco, então serve tanto às páginas públicas
// (que renderizam as seções na ordem salva) quanto ao painel.

export const LAYOUT_KEY = 'layout.sections'

export interface SectionDef {
  id: string
  label: string
  description?: string
  // Fica sempre no topo e sempre visível — o header fixo do site se apoia nela.
  pinnedFirst?: boolean
  // Visibilidade enquanto o admin ainda não salvou nenhuma configuração.
  defaultVisible?: boolean
}

export interface SectionState {
  id: string
  label: string
  description?: string
  visible: boolean
  pinned: boolean
}

// Só Home e Sobre Nós são feitas de blocos independentes; as demais páginas
// só têm textos e SEO.
export const PAGE_SECTIONS: Record<string, SectionDef[]> = {
  home: [
    { id: 'hero', label: 'Banner (topo)', description: 'Os slides são gerenciados em Banner.', pinnedFirst: true },
    { id: 'lojas', label: 'Lojas', description: 'Carrossel das unidades (gerenciado em Lojas).' },
    { id: 'escolha', label: 'Escolha a opção' },
    { id: 'historia', label: 'Desde 1983' },
  ],
  'sobre-nos': [
    { id: 'hero', label: 'Carrossel do topo', pinnedFirst: true },
    { id: 'doc', label: '40 anos — documentário', defaultVisible: false },
    { id: 'sust', label: 'Sustentabilidade' },
    { id: 'instituto', label: 'Projetos sociais', description: 'Carrossel dos institutos.' },
    { id: 'rancho', label: 'Conheça o rancho' },
    { id: 'livro', label: 'Livro Delírio Tropical' },
  ],
}

export interface TextGroupDef {
  id: string
  label: string
  prefixes: string[]
}

// Agrupamento da aba "Textos por seção". Chaves de SEO (meta./og.) vão pra aba
// SEO; o que não casar com nenhum grupo cai em "Outros".
export const PAGE_TEXT_GROUPS: Record<string, TextGroupDef[]> = {
  home: [
    { id: 'hero', label: 'Banner (topo)', prefixes: ['hero.'] },
    { id: 'escolha', label: 'Escolha a opção', prefixes: ['escolha.'] },
    { id: 'historia', label: 'Desde 1983', prefixes: ['historia.'] },
  ],
  'sobre-nos': [
    { id: 'hero', label: 'Carrossel do topo', prefixes: ['hero.'] },
    { id: 'doc', label: '40 anos — documentário', prefixes: ['doc.'] },
    { id: 'sust', label: 'Sustentabilidade', prefixes: ['sust.'] },
    { id: 'rancho', label: 'Conheça o rancho', prefixes: ['rancho.'] },
    { id: 'livro', label: 'Livro Delírio Tropical', prefixes: ['livro.'] },
  ],
  encomendas: [
    { id: 'hero', label: 'Topo', prefixes: ['hero.'] },
    { id: 'card1', label: 'Card 1', prefixes: ['card1.'] },
    { id: 'card2', label: 'Card 2', prefixes: ['card2.'] },
    { id: 'info', label: 'Informações', prefixes: ['info.'] },
    { id: 'opcoes', label: 'Opções', prefixes: ['opcoes.'] },
    { id: 'faq', label: 'Perguntas frequentes', prefixes: ['faq.'] },
  ],
  'eventos-corporativos': [
    { id: 'hero', label: 'Topo', prefixes: ['hero.'] },
    { id: 'form', label: 'Formulário', prefixes: ['form.'] },
  ],
  'fale-conosco': [
    { id: 'hero', label: 'Topo', prefixes: ['hero.'] },
    { id: 'form', label: 'Formulário', prefixes: ['form.'] },
    { id: 'notify', label: 'Notificação por e-mail', prefixes: ['notify.'] },
  ],
  ouvidoria: [{ id: 'hero', label: 'Topo', prefixes: ['hero.'] }],
  'trabalhe-conosco': [
    { id: 'hero', label: 'Topo', prefixes: ['hero.'] },
    { id: 'form', label: 'Formulário', prefixes: ['form.'] },
  ],
  'uso-e-privacidade': [
    { id: 'hero', label: 'Topo', prefixes: ['hero.'] },
    { id: 'intro', label: 'Introdução', prefixes: ['intro.'] },
    { id: 'cookies', label: 'Cookies', prefixes: ['cookies.'] },
    { id: 'dart', label: 'Cookie DART', prefixes: ['dart.'] },
    { id: 'anuncios', label: 'Anúncios', prefixes: ['anuncios.'] },
    { id: 'terceiros', label: 'Terceiros', prefixes: ['terceiros.'] },
  ],
  global: [
    { id: 'header', label: 'Header', prefixes: ['header.'] },
    { id: 'footer', label: 'Footer', prefixes: ['footer.'] },
    { id: 'social', label: 'Redes sociais', prefixes: ['social.'] },
    { id: 'seo', label: 'SEO do site', prefixes: ['title.', 'description'] },
  ],
}

export function isSeoKey(key: string): boolean {
  return key.startsWith('meta.') || key.startsWith('og.')
}

// Combina a configuração salva (JSON em PageContent) com o registro de seções:
// ids novos entram no fim, ids que não existem mais são descartados e a seção
// fixa fica sempre em primeiro lugar e visível.
export function resolveSections(page: string, raw?: string | null): SectionState[] {
  const defs = PAGE_SECTIONS[page]
  if (!defs) return []

  let stored: { id: string; visible?: boolean }[] = []
  try {
    const parsed = JSON.parse(raw ?? '[]')
    if (Array.isArray(parsed)) {
      stored = parsed.filter(s => s && typeof s.id === 'string')
    }
  } catch {
    // configuração corrompida: cai no padrão
  }

  const byId = new Map(defs.map(d => [d.id, d]))
  const orderedIds: string[] = []
  for (const s of stored) {
    if (byId.has(s.id) && !orderedIds.includes(s.id)) orderedIds.push(s.id)
  }
  for (const d of defs) if (!orderedIds.includes(d.id)) orderedIds.push(d.id)

  const states = orderedIds.map<SectionState>(id => {
    const def = byId.get(id)!
    const saved = stored.find(s => s.id === id)
    return {
      id,
      label: def.label,
      description: def.description,
      pinned: !!def.pinnedFirst,
      visible: def.pinnedFirst ? true : (saved?.visible ?? def.defaultVisible ?? true),
    }
  })

  // seção fixa vai pro topo, o resto mantém a ordem relativa
  return [...states.filter(s => s.pinned), ...states.filter(s => !s.pinned)]
}

export function visibleSectionIds(page: string, raw?: string | null): string[] {
  return resolveSections(page, raw).filter(s => s.visible).map(s => s.id)
}
