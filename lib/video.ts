import { parseYouTubeId } from '@/lib/youtube'

export type VideoSource =
  | { type: 'youtube'; id: string }
  | { type: 'instagram'; kind: 'reel' | 'p'; code: string }
  | { type: 'file'; src: string }

// Reconhece links do YouTube, de posts/reels públicos do Instagram e vídeos
// MP4/WebM enviados pelo admin (/uploads/...).
export function parseVideoUrl(input: string | undefined | null): VideoSource | null {
  const yt = parseYouTubeId(input)
  if (yt) return { type: 'youtube', id: yt }

  if (!input) return null
  if (/^\/uploads\/[A-Za-z0-9_./-]+\.(mp4|webm)$/i.test(input.trim()) && !input.includes('..')) {
    return { type: 'file', src: input.trim() }
  }
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\./, '')
  if (host !== 'instagram.com') return null

  // /reel/CODE/, /reels/CODE/, /p/CODE/, /tv/CODE/ ou /usuario/reel/CODE/
  const m = url.pathname.match(/^\/(?:[^/]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/)
  if (!m) return null
  return { type: 'instagram', kind: m[1] === 'p' ? 'p' : 'reel', code: m[2] }
}
