import Link from 'next/link'
import SobreHeroCarousel from '@/components/SobreHeroCarousel'
import InstitutoCarousel from '@/components/InstitutoCarousel'

export const metadata = {
  title: 'Sobre Nós | Delírio Tropical',
  description: 'Conheça a história do Delírio Tropical, nascido em 1983 no centro do Rio de Janeiro.',
}

const BASE = 'https://delirio.com.br/wp-content/uploads/2023'

export default function SobreNos() {
  return (
    <main>

      {/* ── 1. Carrossel Hero ── */}
      <SobreHeroCarousel />

      {/* ── 2. Sustentabilidade ── */}
      <section id="sustentabilidade" className="sobre-sust" aria-label="Sustentabilidade">
        <div className="sobre-sust__inner">
          <div className="sobre-sust__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/05/back-video-sustentabilidade.jpg`}
              alt="Vídeo sustentabilidade Delírio Tropical"
              loading="lazy"
            />
            <div className="sobre-play-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="sobre-sust__content">
            <h2 className="sobre-sust__title">
              Nosso jeitinho<br />Delírio de ser...<br />mais sustentável!
            </h2>
            <p className="sobre-sust__intro">
              Acreditamos em um futuro melhor, com alimentação segura e saudável para todos. Por isso, investimos
              em ações que caminham juntos na mesma direção. Venha conhecer alguns dos selos e parceiros que
              garantem a qualidade de nosso trabalho.
            </p>
            <div className="sobre-parceiros">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/07/logo-rancho-francisco.jpg`} alt="Rancho São Francisco" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/07/logo-eureciclo.jpg`} alt="Eureciclo" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/07/logo-eva-energia.jpg`} alt="EVA Energia" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/07/logo-teiares.jpg`} alt="Teiares" loading="lazy" />
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

      {/* ── 3. Projetos Sociais — Carrossel ── */}
      <InstitutoCarousel />

      {/* ── 4. Rancho ── */}
      <section id="rancho" className="sobre-rancho-section" aria-label="Rancho São Francisco">
        <div className="sobre-rancho-section__inner">
          <div className="sobre-rancho-section__videos">
            <div className="sobre-rancho-card">
              <div className="sobre-rancho-card__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE}/05/video1.jpg`} alt="Plantação no rancho" loading="lazy" />
                <div className="sobre-play-btn" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <p className="sobre-rancho-card__text">
                Com o passar dos anos, aprendemos a plantar, cultivar e colher, por isso muitos dos nossos alimentos provém de nossa horta orgânica.
              </p>
            </div>
            <div className="sobre-rancho-card">
              <div className="sobre-rancho-card__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE}/05/video2.jpg`} alt="Compostagem no rancho" loading="lazy" />
                <div className="sobre-play-btn" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <p className="sobre-rancho-card__text">
                Os resíduos orgânicos de nossas lojas viram adubo por meio da compostagem. Venha conhecer por trás desse processo!
              </p>
            </div>
            <div className="sobre-rancho-card">
              <div className="sobre-rancho-card__thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE}/05/video3.jpg`} alt="Alimentos do rancho" loading="lazy" />
                <div className="sobre-play-btn" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <p className="sobre-rancho-card__text">
                Grande parte do segredo de nossas comida ser tão gostosa está aqui, nos cuidados com os alimentos desde o plantio, até a sua mesa.
              </p>
            </div>
          </div>
          <div className="sobre-rancho-info">
            <h2 className="sobre-rancho-info__title">Conheça<br />o rancho</h2>
            <p className="sobre-rancho-info__desc">
              Valorizamos a proveniência dos alimentos. Nossa relação com o Rancho São Francisco é uma parceria
              de longa data onde cultivamos nossos alimentos orgânicos.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Livro ── */}
      <section className="sobre-livro" aria-label="Livro Delírio Tropical 40 anos">
        <div className="sobre-livro__inner">
          <div className="sobre-livro__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/05/Livro-Balcao-02-CROP-1024x830.jpg`} alt="Livro Delírio Tropical 40 anos" loading="lazy" />
          </div>
          <div className="sobre-livro__text">
            <h2 className="sobre-historia__title">Livro<br />Delírio Tropical</h2>
            <p className="sobre-livro__desc">
              Há 4 décadas, nascia o Delírio Tropical com um sonho simples: levar comida leve, saudável e cheia de
              sabor para os cariocas. Esse sonho cresceu, atravessou gerações e se tornou parte da história da Cidade
              Maravilhosa. Essa jornada esta registrada em nosso livro especial de 40 anos, uma coleção receitas e
              sabores que contam histórias.
            </p>
            <a href="https://delirio.com.br" target="_blank" rel="noopener" className="sobre-livro__btn">
              Acesse e leve o Delírio para sua casa
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
