import type { Metadata } from 'next'
import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'
import FaleConoscoClient from './FaleConoscoClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('fale-conosco')
  return {
    title: content['meta.title'] ?? 'Fale Conosco',
    description: content['meta.description'] ??
      'Entre em contato com a loja Delírio Tropical de sua preferência. Envie sua mensagem e nossa equipe retornará em breve.',
  }
}

export default async function FaleConosco() {
  const [stores, content] = await Promise.all([getStores(), getPageContent('fale-conosco')])

  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">{content['hero.title'] ?? 'Fale Conosco'}</h1>
        <p className="page-hero__subtitle">
          {content['hero.subtitle'] ?? 'Assim poderemos servir ainda melhor'}
        </p>
      </div>

      <div className="fale-form">
        <h2 className="fale-form__title">{content['form.title'] ?? 'Envie sua mensagem'}</h2>
        <p className="fale-form__sub">
          {content['form.description'] ?? 'Preencha o formulário abaixo e nossa equipe entrará em contato em breve.'}
        </p>

        <FaleConoscoClient stores={stores.map(s => ({ name: s.name, email: s.email }))} />
      </div>
    </main>
  )
}
