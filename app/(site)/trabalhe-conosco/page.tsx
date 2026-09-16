import type { Metadata } from 'next'
import { getPageContent } from '@/lib/data/content'
import { getStores } from '@/lib/data/stores'
import { buildPageMetadata } from '@/lib/seo/metadata'
import TrabalheConoscoClient from './TrabalheConoscoClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('trabalhe-conosco')
  const title = content['meta.title'] ?? 'Trabalhe com a Gente'
  const description = content['meta.description'] ??
    'Faça parte da equipe Delírio Tropical. Confira as vagas disponíveis para atendente, auxiliar de cozinha, saladeiro, cozinheiro e mais. Candidate-se agora.'
  return buildPageMetadata({ content, path: '/trabalhe-conosco', title, description })
}

export default async function TrabalheConosco() {
  const [content, stores] = await Promise.all([getPageContent('trabalhe-conosco'), getStores()])

  return (
    <main id="main-content" tabIndex={-1}>
      <div className="page-hero">
        <h1 className="page-hero__title">{content['hero.title'] ?? 'Trabalhe com a Gente'}</h1>
        <p className="page-hero__subtitle">{content['hero.subtitle'] ?? 'Faça parte da nossa equipe'}</p>
      </div>

      <div className="trabalhe-layout">

        {/* ── Formulário ── */}
        <div className="trabalhe-layout__form">
          <h2 className="trabalhe-form__title">{content['form.title'] ?? 'Trabalhe com a Gente'}</h2>
          <p className="trabalhe-form__desc">
            {content['form.description'] ??
              'Nossa missão é servir nossos clientes diariamente com muito amor. Trabalhando no Delírio Tropical você poderá exercer esse lindo ofício e perceber da importância do cuidado com as pessoas. Nossos primeiros clientes são nossos colaboradores, e damos oportunidade de crescimento para todas as pessoas da nossa equipe.'}
          </p>

          <TrabalheConoscoClient stores={stores.map(s => ({ id: s.id, name: s.name }))} />
        </div>

        {/* ── Imagem lateral ── */}
        <div className="trabalhe-layout__img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wp-content/uploads/2023/07/back-trabalhe-conosco.webp"
            alt="Cozinha Delírio Tropical"
            loading="lazy"
          />
        </div>

      </div>
    </main>
  )
}
