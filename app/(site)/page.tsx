import type { Metadata } from 'next'
import HeroSlider from '@/components/HeroSlider'
import StoreCarousel from '@/components/StoreCarousel'
import Multiline from '@/components/Multiline'
import Reveal from '@/components/Reveal'
import Link from 'next/link'
import { getStores } from '@/lib/data/stores'
import { getPageContent } from '@/lib/data/content'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('home')
  const title = content['meta.title'] ?? 'Delírio Tropical — Restaurante Saudável desde 1983'
  const description = content['meta.description'] ??
    'Culinária natural, fresca e saborosa no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos personalizados.'
  return {
    title,
    description,
    openGraph: { title, description, url: 'https://delirio.com.br' },
  }
}

export default async function Home() {
  const [stores, content, slides] = await Promise.all([
    getStores(),
    getPageContent('home'),
    prisma.heroSlide.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
  ])

  const modalStores = stores.map(s => ({ name: s.name, menuUrl: s.menuUrl, highlight: s.highlight }))

  return (
    <main>
      {/* ── Hero ── */}
      <HeroSlider
        slides={slides.map(s => s.imageUrl)}
        ctaLabel={content['hero.cta'] ?? 'veja o cardápio do dia'}
        modalStores={modalStores}
      />

      {/* ── Lojas ── */}
      <section id="lojas" aria-label="Nossas lojas">
        <StoreCarousel stores={stores} />
      </section>

      {/* ── Escolha ── */}
      <section className="escolha" aria-label="Nossas opções">
        <h2 className="escolha__title">
          {content['escolha.title'] ?? 'Escolha a opção que melhor lhe atende'}
        </h2>
        <div className="escolha__cards">

          <Reveal className="escolha__card-reveal">
          <div className="escolha__card">
            <div className="escolha__card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wp-content/uploads/2023/05/Pico-de-Gallo-1-1-scaled.jpg"
                alt="Encomendas Delírio Tropical"
                loading="lazy"
              />
              <div className="escolha__card-overlay">
                <span className="escolha__card-label">Encomendas</span>
              </div>
            </div>
            <div className="escolha__card-body">
              <p className="escolha__card-desc">
                <Multiline text={content['escolha.encomendas.desc'] ?? 'Faça seu pedido por aqui, receba em casa\nou agende a retirada na loja mais próxima'} />
              </p>
              <a
                href="https://cardapioencomendas.delirio.com.br/"
                target="_blank"
                rel="noopener"
                className="escolha__card-btn"
              >
                {content['escolha.encomendas.cta'] ?? 'Faça seu pedido'}
              </a>
            </div>
          </div>
          </Reveal>

          <Reveal className="escolha__card-reveal" delay={120}>
          <div className="escolha__card">
            <div className="escolha__card-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wp-content/uploads/2023/07/Quiche-de-tomate-com-manjericao-02-PEDRO.jpg"
                alt="Eventos Corporativos e Familiares"
                loading="lazy"
              />
              <div className="escolha__card-overlay">
                <span className="escolha__card-label">
                  <Multiline text={content['escolha.eventos.label'] ?? 'Eventos\nCorporativos\ne Familiares'} />
                </span>
              </div>
            </div>
            <div className="escolha__card-body">
              <p className="escolha__card-desc">
                <Multiline text={content['escolha.eventos.desc'] ?? 'Contate nossa equipe para\nauxiliá-lo na criação de seu evento'} />
              </p>
              <Link href="/eventos-corporativos" className="escolha__card-btn">
                {content['escolha.eventos.cta'] ?? 'Solicite um orçamento'}
              </Link>
            </div>
          </div>
          </Reveal>

        </div>
      </section>

      {/* ── Desde 1983 ── */}
      <section className="historia" aria-label="Nossa história">
        <div className="historia__left">
          <h2 className="historia__year">
            <Multiline text={content['historia.title'] ?? 'Desde\n1983'} />
          </h2>
          <p className="historia__text">
            {content['historia.text'] ?? 'Todos os dias, preparamos uma comida fresca, leve e muito saborosa com amor e carinho.'}
          </p>
          <Link href="/sobre-nos" className="historia__btn">{content['historia.cta'] ?? 'Saiba Mais'}</Link>
        </div>
        <div className="historia__right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="historia__photo"
            src="/wp-content/uploads/2023/05/delirio-assembleia-1985.webp"
            alt="Equipe Delírio Tropical em 1985"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  )
}
