import type { Metadata } from 'next'
import Link from 'next/link'
import { getPageContent } from '@/lib/data/content'
import { buildPageMetadata } from '@/lib/seo/metadata'
import OuvidoriaClient from './OuvidoriaClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('ouvidoria')
  const title = content['meta.title'] ?? 'Ouvidoria'
  const description = content['meta.description'] ??
    'Canal anônimo de ouvidoria do Delírio Tropical. Compartilhe sua opinião de forma confidencial. Sua voz é importante para a melhoria contínua dos nossos serviços.'
  return buildPageMetadata({ content, path: '/ouvidoria', title, description })
}

export default async function Ouvidoria() {
  const content = await getPageContent('ouvidoria')

  return (
    <main id="main-content" tabIndex={-1}>
      <div className="page-hero">
        <h1 className="page-hero__title">{content['hero.title'] ?? 'Ouvidoria'}</h1>
        <p className="page-hero__subtitle">{content['hero.subtitle'] ?? 'Sua voz é importante para nós'}</p>
      </div>

      <div className="ouvidoria-wrap">
        <div className="ouvidoria-notice">
          <svg viewBox="0 0 24 24" className="ouvidoria-notice__icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>
            As interações pela ouvidoria são <strong>anônimas</strong> e por essa razão não serão respondidas. Caso queira interagir com nossa equipe, comunique-se pela aba{' '}
            <Link href="/fale-conosco">&ldquo;Fale Conosco&rdquo;</Link>.
          </p>
        </div>

        <OuvidoriaClient />
      </div>
    </main>
  )
}
