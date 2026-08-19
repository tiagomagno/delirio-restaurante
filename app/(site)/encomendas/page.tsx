import type { Metadata } from 'next'
import Multiline from '@/components/Multiline'
import { getPageContent } from '@/lib/data/content'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('encomendas')
  return { title: content['meta.title'] ?? 'Encomendas' }
}

export default async function Encomendas() {
  const content = await getPageContent('encomendas')

  return (
    <main>
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <h1 className="page-hero__title">{content['hero.title'] ?? 'Encomendas'}</h1>
        <p className="page-hero__subtitle">
          {content['hero.subtitle'] ?? 'Peça nossos pratos favoritos para entregar onde você quiser'}
        </p>
      </div>

      {/* ── Opções ── */}
      <section className="enc-opcoes" aria-label="Opções de encomenda">
        <h2 className="enc-opcoes__title">{content['opcoes.title'] ?? 'Escolha como prefere'}</h2>
        <p className="enc-opcoes__sub">
          {content['opcoes.subtitle'] ?? 'Encomende para receber em casa ou para seu evento corporativo e familiar'}
        </p>

        <div className="enc-cards">

          <div className="enc-card">
            <div className="enc-card__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://delirio.com.br/wp-content/uploads/2023/05/Pico-de-Gallo-1-1-scaled.jpg"
                alt="Encomendas Delírio Tropical"
              />
              <div className="enc-card__overlay">
                <span className="enc-card__label">Encomendas</span>
              </div>
            </div>
            <div className="enc-card__body">
              <h3 className="enc-card__title">{content['card1.title'] ?? 'Peça pelo delivery'}</h3>
              <p className="enc-card__desc">
                {content['card1.desc'] ?? 'Faça seu pedido por aqui, receba em casa ou agende a retirada na loja mais próxima de você.'}
              </p>
              <a
                href="https://delirio.com.br/delivery"
                target="_blank"
                rel="noopener"
                className="enc-card__btn"
              >
                {content['card1.cta'] ?? 'Fazer meu pedido'}
              </a>
            </div>
          </div>

          <div className="enc-card">
            <div className="enc-card__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://delirio.com.br/wp-content/uploads/2023/07/Quiche-de-tomate-com-manjericao-02-PEDRO.jpg"
                alt="Eventos Corporativos e Familiares"
              />
              <div className="enc-card__overlay">
                <span className="enc-card__label">
                  Eventos<br />Corporativos<br />e Familiares
                </span>
              </div>
            </div>
            <div className="enc-card__body">
              <h3 className="enc-card__title">{content['card2.title'] ?? 'Eventos e confraternizações'}</h3>
              <p className="enc-card__desc">
                {content['card2.desc'] ?? 'Nossa equipe está pronta para auxiliá-lo na criação do menu perfeito para o seu evento.'}
              </p>
              <a
                href="https://wa.me/552140427171"
                target="_blank"
                rel="noopener"
                className="enc-card__btn"
              >
                {content['card2.cta'] ?? 'Solicitar orçamento'}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── Info ── */}
      <section className="enc-info" aria-label="Por que encomendar">
        <h2 className="enc-info__title">{content['info.title'] ?? 'Por que encomendar com a gente?'}</h2>
        <div className="enc-info__grid">
          <div>
            <p className="enc-info-item__num">{content['info.stat1.num'] ?? '+40'}</p>
            <p className="enc-info-item__label"><Multiline text={content['info.stat1.label'] ?? 'Anos servindo\no Rio de Janeiro'} /></p>
          </div>
          <div>
            <p className="enc-info-item__num">{content['info.stat2.num'] ?? '9'}</p>
            <p className="enc-info-item__label"><Multiline text={content['info.stat2.label'] ?? 'Lojas para\nretirada rápida'} /></p>
          </div>
          <div>
            <p className="enc-info-item__num">{content['info.stat3.num'] ?? '100%'}</p>
            <p className="enc-info-item__label"><Multiline text={content['info.stat3.label'] ?? 'Ingredientes frescos\npreparados no dia'} /></p>
          </div>
        </div>
      </section>
    </main>
  )
}
