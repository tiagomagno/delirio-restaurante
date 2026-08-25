export interface PublicPage {
  slug: string
  path: string
  label: string
  fallbackTitle: string
}

const PRODUCTION_SITE_URL = 'https://delirio.com.br'

export const SITE_URL = (process.env.SITE_URL?.trim() || PRODUCTION_SITE_URL).replace(/\/$/, '')

// Indexação só é liberada quando SITE_ENV=production é setado explicitamente no
// ambiente (Coolify, etc). Sem essa variável, o robots.txt e o meta robots
// bloqueiam tudo — evita que uma cópia de staging seja indexada por engano.
export const IS_PRODUCTION = process.env.SITE_ENV === 'production'

export const SITE_NAME = 'Delírio Tropical'
export const DEFAULT_OG_IMAGE = '/wp-content/uploads/2023/09/banner_delirio_7.jpg'
export const SITE_LOGO = '/wp-content/uploads/2023/05/logo-delirio.webp'

export const PUBLIC_PAGES: PublicPage[] = [
  { slug: 'home', path: '/', label: 'Home', fallbackTitle: 'Delírio Tropical — Restaurante Saudável desde 1983' },
  { slug: 'sobre-nos', path: '/sobre-nos', label: 'Sobre Nós', fallbackTitle: 'Sobre Nós' },
  { slug: 'lojas', path: '/lojas', label: 'Lojas', fallbackTitle: 'Lojas' },
  { slug: 'encomendas', path: '/encomendas', label: 'Encomendas', fallbackTitle: 'Encomendas' },
  { slug: 'trabalhe-conosco', path: '/trabalhe-conosco', label: 'Trabalhe com a Gente', fallbackTitle: 'Trabalhe com a Gente' },
  { slug: 'eventos-corporativos', path: '/eventos-corporativos', label: 'Eventos Corporativos', fallbackTitle: 'Eventos Corporativos' },
  { slug: 'fale-conosco', path: '/fale-conosco', label: 'Fale Conosco', fallbackTitle: 'Fale Conosco' },
  { slug: 'ouvidoria', path: '/ouvidoria', label: 'Ouvidoria', fallbackTitle: 'Ouvidoria' },
  { slug: 'uso-e-privacidade', path: '/uso-e-privacidade', label: 'Uso e Privacidade', fallbackTitle: 'Uso e Privacidade' },
]
