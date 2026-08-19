import type { Metadata } from 'next'
import LojasClient from './LojasClient'
import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('lojas')
  return {
    title: content['meta.title'] ?? 'Lojas',
    description: content['meta.description'] ??
      'Encontre a loja Delírio Tropical mais próxima de você. Unidades em Assembléia, Tijuca, Rio Sul, Ipanema, Gávea, Citta América, Barra Shopping, Metropolitano (RJ) e Plaza Niterói.',
  }
}

export default async function Lojas() {
  const [stores, content] = await Promise.all([getStores(), getPageContent('lojas')])

  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">{content['hero.title'] ?? 'Nossas Lojas'}</h1>
        <p className="page-hero__subtitle">
          {content['hero.subtitle'] ?? 'Rio de Janeiro e Niterói — encontre a loja mais próxima de você'}
        </p>
      </div>

      <LojasClient stores={stores} />
    </main>
  )
}
