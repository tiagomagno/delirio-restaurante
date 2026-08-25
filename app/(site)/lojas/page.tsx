import type { Metadata } from 'next'
import LojasClient from './LojasClient'
import StructuredData from '@/components/StructuredData'
import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildStoreSchema } from '@/lib/seo/structuredData'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('lojas')
  const title = content['meta.title'] ?? 'Lojas'
  const description = content['meta.description'] ??
    'Encontre a loja Delírio Tropical mais próxima de você. Unidades em Assembléia, Tijuca, Rio Sul, Ipanema, Gávea, Citta América, Barra Shopping, Metropolitano (RJ) e Plaza Niterói.'
  return buildPageMetadata({ content, path: '/lojas', title, description })
}

export default async function Lojas() {
  const stores = await getStores()

  return (
    <main>
      <StructuredData data={stores.map(buildStoreSchema)} />
      <h1 className="sr-only">Nossas Lojas</h1>
      <div className="lojas-page__spacer" />

      <LojasClient stores={stores} />
    </main>
  )
}
