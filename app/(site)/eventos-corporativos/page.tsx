import type { Metadata } from 'next'
import EventosClient from './EventosClient'
import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('eventos-corporativos')
  return {
    title: content['meta.title'] ?? 'Eventos Corporativos',
    description: content['meta.description'] ??
      'Planeje seu evento corporativo ou familiar com o Delírio Tropical. Cardápio personalizado, atendimento exclusivo e sugestões feitas pelo gerente da loja escolhida.',
  }
}

export default async function EventosCorporativos() {
  const [stores, content] = await Promise.all([getStores(), getPageContent('eventos-corporativos')])

  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">{content['hero.title'] ?? 'Eventos Corporativos'}</h1>
        <p className="page-hero__subtitle">
          {content['hero.subtitle'] ?? 'Cardápio personalizado para o evento da sua empresa'}
        </p>
      </div>

      <EventosClient
        stores={stores.map(s => ({ name: s.name, email: s.email }))}
        title={content['form.title'] ?? 'Faça o seu evento com o Delírio!'}
        description={content['form.description'] ??
          'Preparamos um cardápio personalizado para o evento da sua empresa.\nO gerente da loja escolhida vai entrar em contato com um cardápio e\nsugestões personalizadas para o seu evento!'}
      />
    </main>
  )
}
