import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'
import FaleConoscoClient from '@/app/(site)/fale-conosco/FaleConoscoClient'

export const dynamic = 'force-dynamic'

export default async function PreviewFaleConosco() {
  const [stores, content] = await Promise.all([getStores(), getPageContent('fale-conosco')])

  return (
    <div className="fale-form" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h2 className="fale-form__title">{content['form.title'] ?? 'Envie sua mensagem'}</h2>
      <p className="fale-form__sub">
        {content['form.description'] ?? 'Preencha o formulário abaixo e nossa equipe entrará em contato em breve.'}
      </p>
      <FaleConoscoClient stores={stores.map(s => ({ id: s.id, name: s.name }))} />
    </div>
  )
}
