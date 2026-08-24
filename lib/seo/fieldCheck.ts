export const TITLE_LIMIT = 60
export const DESCRIPTION_LIMIT = 160

export type FieldCheckStatus = 'ok' | 'warn' | 'neutral'

export interface FieldCheckResult {
  status: FieldCheckStatus
  message: string
}

const VALID_ROBOTS = ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow']

/**
 * Validação ao vivo de um campo de SEO, pro editor ver na hora se o que
 * está digitando está dentro do esperado — mesma régua usada no score de
 * /admin/seo, só que por campo em vez de por página. `siblings` são os
 * outros valores da página atual (pelo `key`), pra resolver fallback
 * (og.title vazio cai no meta.title, por ex.) e para o canonical/robots
 * não precisarem de contexto externo.
 */
export function checkSeoField(key: string, rawValue: string, siblings: Record<string, string>): FieldCheckResult | null {
  const value = rawValue.trim()

  switch (key) {
    case 'meta.title': {
      if (!value) return { status: 'warn', message: 'Sem título' }
      if (value.length > TITLE_LIMIT) return { status: 'warn', message: `${value.length} caracteres — pode truncar na busca` }
      return { status: 'ok', message: `${value.length} caracteres` }
    }

    case 'og.title': {
      const fallback = siblings['meta.title']?.trim() ?? ''
      const resolved = value || fallback
      if (!resolved) return { status: 'warn', message: 'Sem título nem fallback' }
      if (resolved.length > TITLE_LIMIT) return { status: 'warn', message: `${resolved.length} caracteres — pode truncar` }
      return value
        ? { status: 'ok', message: `${resolved.length} caracteres` }
        : { status: 'ok', message: `usando o título da página (${resolved.length} caracteres)` }
    }

    case 'meta.description': {
      if (!value) return { status: 'warn', message: 'Sem description' }
      if (value.length > DESCRIPTION_LIMIT) return { status: 'warn', message: `${value.length} caracteres — pode truncar na busca` }
      return { status: 'ok', message: `${value.length} caracteres` }
    }

    case 'og.description': {
      const fallback = siblings['meta.description']?.trim() ?? ''
      const resolved = value || fallback
      if (!resolved) return { status: 'warn', message: 'Sem description nem fallback' }
      if (resolved.length > DESCRIPTION_LIMIT) return { status: 'warn', message: `${resolved.length} caracteres — pode truncar` }
      return value
        ? { status: 'ok', message: `${resolved.length} caracteres` }
        : { status: 'ok', message: `usando a description da página (${resolved.length} caracteres)` }
    }

    case 'meta.robots': {
      const v = (value || 'index,follow').toLowerCase()
      if (!VALID_ROBOTS.includes(v)) {
        return { status: 'warn', message: 'Valor não reconhecido — use index,follow / noindex,follow / noindex,nofollow' }
      }
      if (v.includes('noindex')) return { status: 'warn', message: 'Página não será indexada pelo Google' }
      return { status: 'ok', message: 'indexação normal' }
    }

    case 'meta.canonical': {
      if (!value) return { status: 'neutral', message: 'usando a URL padrão da página' }
      try {
        const url = new URL(value)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('protocol')
        return { status: 'ok', message: 'URL válida' }
      } catch {
        return { status: 'warn', message: 'URL inválida — precisa começar com https://' }
      }
    }

    case 'og.image': {
      if (!value) return { status: 'neutral', message: 'vazio — usando a imagem padrão do site' }
      return { status: 'ok', message: 'imagem própria definida' }
    }

    default:
      return null
  }
}
