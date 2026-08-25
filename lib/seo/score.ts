export interface SeoScoreInput {
  title?: string
  description?: string
  robots?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export interface SeoCheck {
  label: string
  passed: boolean
  hint?: string
}

export interface SeoScoreResult {
  score: number
  checks: SeoCheck[]
}

// Todo check sempre recebe um hint — inclusive quando passou — pra deixar
// explícito qual valor está de fato sendo usado (próprio ou fallback
// automático). Um score não é confiável se ele consegue "passar" um campo
// sem que o time veja o que foi de fato avaliado.
export function scorePage(input: SeoScoreInput): SeoScoreResult {
  const checks: SeoCheck[] = []

  const title = input.title?.trim() ?? ''
  checks.push({
    label: 'Título preenchido (até ~60 caracteres)',
    passed: title.length > 0 && title.length <= 60,
    hint: title.length === 0
      ? 'Sem título definido'
      : title.length > 60
        ? `${title.length} caracteres — pode truncar nos resultados de busca: "${title}"`
        : `${title.length} caracteres: "${title}"`,
  })

  const description = input.description?.trim() ?? ''
  checks.push({
    label: 'Meta description preenchida (até ~160 caracteres)',
    passed: description.length > 0 && description.length <= 160,
    hint: description.length === 0
      ? 'Sem description definida'
      : description.length > 160
        ? `${description.length} caracteres — pode truncar nos resultados de busca`
        : `${description.length} caracteres`,
  })

  const robots = (input.robots ?? 'index,follow').trim().toLowerCase()
  const indexed = !robots.includes('noindex')
  checks.push({
    label: 'Indexação habilitada (index)',
    passed: indexed,
    hint: indexed ? `robots: "${robots}"` : 'Página marcada como noindex — não aparecerá no Google',
  })

  const ogImage = input.ogImage?.trim() ?? ''
  checks.push({
    label: 'Imagem de Open Graph definida',
    passed: Boolean(ogImage),
    hint: ogImage
      ? ogImage
      : 'Vazio — usando a imagem padrão do site. Defina uma própria em Páginas → SEO se quiser diferenciar.',
  })

  const ogTitleRaw = input.ogTitle?.trim() ?? ''
  const ogTitleResolved = ogTitleRaw || title
  checks.push({
    label: 'Título de Open Graph (usado ao compartilhar)',
    passed: ogTitleResolved.length > 0 && ogTitleResolved.length <= 60,
    hint: ogTitleRaw
      ? `Customizado: "${ogTitleRaw}"`
      : ogTitleResolved
        ? `Vazio — usando automaticamente o título da página: "${ogTitleResolved}"`
        : 'Sem título de Open Graph nem título de página pra usar como fallback',
  })

  const ogDescriptionRaw = input.ogDescription?.trim() ?? ''
  const ogDescriptionResolved = ogDescriptionRaw || description
  checks.push({
    label: 'Descrição de Open Graph (usada ao compartilhar)',
    passed: ogDescriptionResolved.length > 0 && ogDescriptionResolved.length <= 160,
    hint: ogDescriptionRaw
      ? `Customizada (${ogDescriptionRaw.length} caracteres)`
      : ogDescriptionResolved
        ? `Vazio — usando automaticamente a description da página (${ogDescriptionResolved.length} caracteres)`
        : 'Sem descrição de Open Graph nem description de página pra usar como fallback',
  })

  const passedCount = checks.filter(c => c.passed).length
  const score = Math.round((passedCount / checks.length) * 100)

  return { score, checks }
}
