import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'
import EventosClient from '@/app/(site)/eventos-corporativos/EventosClient'

export const dynamic = 'force-dynamic'

export default async function PreviewEventosCorporativos() {
  const [stores, content] = await Promise.all([getStores(), getPageContent('eventos-corporativos')])

  return (
    <EventosClient
      stores={stores.map(s => ({ id: s.id, name: s.name }))}
      title={content['form.title'] ?? 'Faça o seu evento com o Delírio!'}
      description={content['form.description'] ??
        'Preparamos um cardápio personalizado para o evento da sua empresa.\nO gerente da loja escolhida vai entrar em contato com um cardápio e\nsugestões personalizadas para o seu evento!'}
    />
  )
}
