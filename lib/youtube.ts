// Extrai o ID de 11 caracteres de um link do YouTube (watch, youtu.be, embed,
// shorts, live). Retorna null se não for um link reconhecível do YouTube.
const ID_RE = /^[A-Za-z0-9_-]{11}$/

export function parseYouTubeId(input: string | undefined | null): string | null {
  if (!input) return null
  const raw = input.trim()
  if (ID_RE.test(raw)) return raw

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\.|^m\./, '')
  let id: string | null = null

  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v')
    } else {
      const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/)
      id = m ? m[1] : null
    }
  }

  return id && ID_RE.test(id) ? id : null
}
