import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE, IS_PRODUCTION, SITE_NAME, SITE_URL } from './pages'

function parseRobots(value: string | undefined): Metadata['robots'] {
  // Fora de produção (sem SITE_ENV=production), força noindex em toda página
  // independente do que o admin configurou — o controle por página é sobre
  // SEO de conteúdo, não sobre esconder um ambiente de staging do Google.
  if (!IS_PRODUCTION) return { index: false, follow: false }

  const directive = (value ?? 'index,follow').trim().toLowerCase()
  return {
    index: !directive.includes('noindex'),
    follow: !directive.includes('nofollow'),
  }
}

export interface BuildPageMetadataInput {
  content: Record<string, string>
  path: string
  title: string
  description?: string
}

export function buildPageMetadata({ content, path, title, description }: BuildPageMetadataInput): Metadata {
  const canonical = content['meta.canonical']?.trim() || `${SITE_URL}${path}`
  const ogTitle = content['og.title']?.trim() || title
  const ogDescription = content['og.description']?.trim() || description
  const ogImage = content['og.image']?.trim() || DEFAULT_OG_IMAGE

  return {
    // A Home já inclui a marca no próprio título ("Delírio Tropical — ...").
    // Sem `absolute`, o template do layout raiz ("%s | Delírio Tropical")
    // duplicaria a marca no <title> final.
    title: path === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: parseRobots(content['meta.robots']),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@deliriotropical',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
