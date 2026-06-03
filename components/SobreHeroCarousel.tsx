'use client'

import { useState } from 'react'

const SLIDES = [
  {
    label: 'Nossa História',
    title: 'Nossa\nHistória',
    text: 'Em 1983 nasce uma história de amor em pleno centro do Rio de Janeiro. A primeira loja da Rua da Assembleia surpreende com uma comida leve, saudável e em harmonia com o clima tropical. Desde então, o Delírio Tropical tornou-se querido dos cariocas e ícone para os visitantes da cidade maravilhosa. O "Delírio" não parou de crescer e inovar, sendo sempre fiel aos seus valores, crenças e princípios.',
    img: 'https://delirio.com.br/wp-content/uploads/2023/06/Assembleia-Baixa-5x5-591-px.jpg',
    imgAlt: 'Fachada Delírio Tropical — Rua da Assembleia',
  },
  {
    label: 'Um Estilo de Vida',
    title: 'Os seres\nbrasileiros\nnos inspiram',
    text: 'Somos urbanos, praianos, trabalhadores conectados com a natureza. Sempre procuramos estar à frente, não temos medo de mudanças. Servimos para todos uma comida feita com amor.',
    img: 'https://delirio.com.br/wp-content/uploads/2023/05/Livro-Balcao-02-CROP-1024x830.jpg',
    imgAlt: 'Delírio Tropical — estilo de vida',
  },
  {
    label: 'Nossos Valores',
    title: 'Verdade,\namor e\ntradição',
    text: 'Somos verdadeiros em tudo que fazemos. Acreditamos no potencial das gerações futuras. O resto é fruto de muito amor, trabalho e dedicação. Graças a uma equipe feliz e ingredientes selecionados.',
    img: 'https://delirio.com.br/wp-content/uploads/2023/05/delirio-assembleia-1985.webp',
    imgAlt: 'Equipe Delírio Tropical em 1985',
  },
]

export default function SobreHeroCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(i => (i + 1) % SLIDES.length)

  const slide = SLIDES[current]

  return (
    <section className="sobre-hero" aria-label="Nossa História">
      <button className="sobre-hero__arrow sobre-hero__arrow--prev" onClick={prev} aria-label="Slide anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="sobre-hero__slide">
        <div className="sobre-hero__left">
          <p className="sobre-hero__label">{slide.label}</p>
          <h1 className="sobre-hero__title">
            {slide.title.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h1>
          <p className="sobre-hero__text">{slide.text}</p>
        </div>
        <div className="sobre-hero__right">
          <div className="sobre-hero__circle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.img} alt={slide.imgAlt} />
          </div>
        </div>
      </div>

      <button className="sobre-hero__arrow sobre-hero__arrow--next" onClick={next} aria-label="Próximo slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="sobre-hero__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`sobre-hero__dot${i === current ? ' sobre-hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
