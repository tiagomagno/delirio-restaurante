import Link from 'next/link'
import SobreHeroCarousel from '@/components/SobreHeroCarousel'

export const metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a história do Delírio Tropical, nascido em 1983 no centro do Rio de Janeiro. Nossos valores, projetos sociais e o compromisso com sustentabilidade e alimentação saudável.',
}

const PlayIcon = () => (
  <div className="sobre-play-btn" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
)

export default function SobreNos() {
  return (
    <main>

      {/* ── Hero — Carrossel ── */}
      <SobreHeroCarousel />

      {/* ── Sustentabilidade ── */}
      <section id="sustentabilidade" className="sobre-sust" aria-label="Sustentabilidade">
        <div className="sobre-sust__inner">
          <div className="sobre-sust__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_7.jpg"
              alt="Nosso jeitinho sustentável"
              loading="lazy"
            />
            <PlayIcon />
          </div>
          <div className="sobre-sust__content">
            <h2 className="sobre-sust__title">
              Nosso jeitinho<br />Delírio de ser...<br />mais sustentável!
            </h2>
            <p className="sobre-sust__intro">
              Acreditamos em um futuro melhor, com alimentação segura e saudável para todos. Por isso, investimos
              em ações que caminham juntos na mesma direção. Venha conhecer alguns dos selos e parceiros que
              garantem a qualidade do nosso trabalho.
            </p>
            <div className="sobre-parceiros">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-rancho-francisco.jpg" alt="Rancho São Francisco" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-eureciclo.jpg" alt="Eureciclo" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-eva-energia.jpg" alt="EVA Energia" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-teiares.jpg" alt="Teiares" loading="lazy" />
            </div>
            <a
              href="https://www.instagram.com/deliriotropical"
              target="_blank"
              rel="noopener"
              className="sobre-cta__btn"
            >
              Acompanhe em nossas redes
            </a>
          </div>
        </div>
      </section>

      {/* ── Instituto Compartilhar ── */}
      <section id="social" className="sobre-instituto" aria-label="Instituto Compartilhar">
        <div className="sobre-instituto__text">
          <h2 className="sobre-instituto__title">Instituto<br />Compartilhar</h2>
          <p className="sobre-instituto__desc">
            Motivados pelo amor ao esporte e pelo caráter de um jeito transformador, o Instituto
            Compartilhar foi fundado em 2003 pelo técnico Bernardinho e na lista de dois
            institutos sem fins lucrativos que oportuniza crianças e adolescentes, prioritariamente
            estudantes de escolas públicas, a praticarem esporte de forma divertida ao mesmo
            tempo em que aprendem valores essenciais para a sua formação.
          </p>
          <a href="http://compartilhar.org.br/" target="_blank" rel="noopener" className="sobre-instituto__btn">
            Saiba mais
          </a>
        </div>
        <div className="sobre-instituto__img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://delirio.com.br/wp-content/uploads/2023/05/delirio-assembleia-1985.webp"
            alt="Instituto Compartilhar"
            loading="lazy"
          />
        </div>
      </section>

      {/* ── Rancho ── */}
      <section id="rancho" className="sobre-rancho-section" aria-label="Rancho São Francisco">
        <div className="sobre-rancho-section__grid">
          <div className="sobre-rancho-card">
            <div className="sobre-rancho-card__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-rancho-francisco.jpg" alt="Plantação no rancho" loading="lazy" />
              <PlayIcon />
            </div>
            <p className="sobre-rancho-card__text">
              Com o passar dos anos, aprendemos a plantar, cultivar e colher — muitos dos nossos alimentos provêm de nossa horta orgânica.
            </p>
          </div>
          <div className="sobre-rancho-card">
            <div className="sobre-rancho-card__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-rancho-francisco.jpg" alt="Compostagem no rancho" loading="lazy" />
              <PlayIcon />
            </div>
            <p className="sobre-rancho-card__text">
              Os resíduos orgânicos de nossas lojas viram adubo por meio da compostagem. Venha conhecer por trás desse processo!
            </p>
          </div>
          <div className="sobre-rancho-card sobre-rancho-card--with-info">
            <div className="sobre-rancho-card__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-rancho-francisco.jpg" alt="Alimentos orgânicos" loading="lazy" />
              <PlayIcon />
            </div>
            <div className="sobre-rancho-info">
              <h2 className="sobre-rancho-info__title">Conheça<br />o rancho</h2>
              <p className="sobre-rancho-info__desc">
                Valorizamos a proveniência dos alimentos. Nossa relação com o Rancho São Francisco é uma parceria
                de longa data onde cultivamos nossos alimentos orgânicos.
              </p>
            </div>
            <p className="sobre-rancho-card__text">
              Grande parte do segredo da nossa comida ser tão gostosa está aqui, nos cuidados com os alimentos desde o plantio, até a sua mesa.
            </p>
          </div>
        </div>
      </section>

      {/* ── Livro ── */}
      <section className="sobre-livro" aria-label="Livro Delírio Tropical 40 anos">
        <div className="sobre-livro__inner">
          <div className="sobre-livro__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://delirio.com.br/wp-content/uploads/2023/05/Livro-Balcao-02-CROP-1024x830.jpg" alt="Livro Delírio Tropical 40 anos" loading="lazy" />
          </div>
          <div className="sobre-livro__text">
            <h2 className="sobre-historia__title">Livro<br />Delírio Tropical</h2>
            <p className="sobre-livro__desc">
              Há 4 décadas, nascia o Delírio Tropical com um sonho simples: levar comida leve, saudável e cheia de
              sabor para os cariocas. Esse sonho cresceu, atravessou gerações e se tornou parte da história da Cidade
              Maravilhosa. Essa jornada está registrada em nosso livro especial de 40 anos, uma coleção de receitas
              e sabores que contam histórias.
            </p>
            <a href="https://delirio.com.br" target="_blank" rel="noopener" className="sobre-cta__btn">
              Acesse e leve o Delírio para sua casa
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sobre-cta" aria-label="Venha nos visitar">
        <h2 className="sobre-cta__title">Venha nos visitar</h2>
        <p className="sobre-cta__text">Temos lojas no Rio de Janeiro e em Niterói. Encontre a mais perto de você.</p>
        <Link href="/lojas" className="sobre-cta__btn">Ver nossas lojas</Link>
      </section>

    </main>
  )
}
