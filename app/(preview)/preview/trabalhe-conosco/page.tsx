import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'
import TrabalheConoscoClient from '@/app/(site)/trabalhe-conosco/TrabalheConoscoClient'

export const dynamic = 'force-dynamic'

export default async function PreviewTrabalheConosco() {
  const [content, stores] = await Promise.all([getPageContent('trabalhe-conosco'), getStores()])

  return (
    <div className="trabalhe-layout__form" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h2 className="trabalhe-form__title">{content['form.title'] ?? 'Trabalhe com a Gente'}</h2>
      <p className="trabalhe-form__desc">
        {content['form.description'] ??
          'Nossa missão é servir nossos clientes diariamente com muito amor. Trabalhando no Delírio Tropical você poderá exercer esse lindo ofício e perceber da importância do cuidado com as pessoas. Nossos primeiros clientes são nossos colaboradores, e damos oportunidade de crescimento para todas as pessoas da nossa equipe.'}
      </p>
      <TrabalheConoscoClient stores={stores.map(s => ({ id: s.id, name: s.name }))} />
    </div>
  )
}
