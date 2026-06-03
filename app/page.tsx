import type { Metadata } from 'next'
import HeroSlider from '@/components/HeroSlider'
import StoreCarousel from '@/components/StoreCarousel'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Delírio Tropical — Restaurante Saudável desde 1983',
  description: 'Culinária natural, fresca e saborosa no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos personalizados.',
  openGraph: {
    title: 'Delírio Tropical — Restaurante Saudável desde 1983',
    description: 'Culinária natural, fresca e saborosa no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos personalizados.',
    url: 'https://delirio.com.br',
  },
}

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <HeroSlider />

      {/* ── Lojas ── */}
      <section id="lojas" aria-label="Nossas lojas">
        <StoreCarousel />
      </section>

      {/* ── Escolha ── */}
      <section className="escolha" aria-label="Nossas opções">
        <h2 className="escolha__title">Escolha a opção que melhor lhe atende</h2>
        <div className="escolha__cards">

          <div className="escolha__card">
            <div className="escolha__card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://delirio.com.br/wp-content/uploads/2023/05/Pico-de-Gallo-1-1-scaled.jpg"
                alt="Encomendas Delírio Tropical"
                loading="lazy"
              />
              <div className="escolha__card-overlay">
                <span className="escolha__card-label">Encomendas</span>
              </div>
            </div>
            <div className="escolha__card-body">
              <p className="escolha__card-desc">
                Faça seu pedido por aqui, receba em casa<br />
                ou agende a retirada na loja mais próxima
              </p>
              <a
                href="https://cardapioencomendas.delirio.com.br/"
                target="_blank"
                rel="noopener"
                className="escolha__card-btn"
              >
                Faça seu pedido
              </a>
            </div>
          </div>

          <div className="escolha__card">
            <div className="escolha__card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://delirio.com.br/wp-content/uploads/2023/07/Quiche-de-tomate-com-manjericao-02-PEDRO.jpg"
                alt="Eventos Corporativos e Familiares"
                loading="lazy"
              />
              <div className="escolha__card-overlay">
                <span className="escolha__card-label">
                  Eventos<br />Corporativos<br />e Familiares
                </span>
              </div>
            </div>
            <div className="escolha__card-body">
              <p className="escolha__card-desc">
                Contate nossa equipe para<br />
                auxiliá-lo na criação de seu evento
              </p>
              <Link href="/eventos-corporativos" className="escolha__card-btn">
                Solicite um orçamento
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── Desde 1983 ── */}
      <section className="historia" aria-label="Nossa história">
        <div className="historia__left">
          <h2 className="historia__year">Desde<br />1983</h2>
          <p className="historia__text">
            Todos os dias, preparamos uma comida fresca, leve e muito saborosa com amor e carinho.
          </p>
          <Link href="/sobre-nos" className="historia__btn">Saiba Mais</Link>
        </div>
        <div className="historia__right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="historia__photo"
            src="https://delirio.com.br/wp-content/uploads/2023/05/delirio-assembleia-1985.webp"
            alt="Equipe Delírio Tropical em 1985"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  )
}
