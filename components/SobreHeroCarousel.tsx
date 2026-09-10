'use client'

import { useState } from 'react'

const BASE = '/wp-content/uploads/2023/05'

// Sem campo de CMS pra imagem de fundo de cada slide — só título e texto vêm
// do Admin (via PageContent), a imagem continua fixa por posição do slide.
const IMAGES = [
  `${BASE}/delirio-back-nossahistoria.webp`,
  `${BASE}/delirio-back-valores.webp`,
  `${BASE}/delirio-back-estilovida.webp`,
]

export interface SobreHeroSlideData {
  title: string
  text: string
}

interface Props {
  slides: SobreHeroSlideData[]
}

export default function SobreHeroCarousel({ slides }: Props) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length)
  const next = () => setCurrent(i => (i + 1) % slides.length)

  const img = IMAGES[current] ?? IMAGES[0]

  return (
    <section className="sobre-hero" aria-label="Nossa História">
      {/* Background image cobre a seção toda */}
      <div
        className="sobre-hero__bg"
        style={{ backgroundImage: `url(${img})` }}
        aria-hidden="true"
      />

      {/* Painel verde esquerdo com borda curva */}
      <div className="sobre-hero__panel">
        <div className="sobre-hero__panel-stack">
          {/* Os 3 slides ficam empilhados (mesma célula de grid) pra altura
              do painel ser sempre a do slide mais alto — sem "pular" de
              tamanho ao trocar de slide. Só o ativo fica visível. */}
          {slides.map((s, i) => (
            <div
              key={i}
              className={`sobre-hero__panel-inner${i === current ? ' is-active' : ''}`}
              aria-hidden={i !== current}
            >
              <h1 className="sobre-hero__title">
                {s.title.split('\n').map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </h1>
              <p className="sobre-hero__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Setas */}
      <button className="sobre-hero__arrow sobre-hero__arrow--prev" onClick={prev} aria-label="Slide anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="sobre-hero__arrow sobre-hero__arrow--next" onClick={next} aria-label="Próximo slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="sobre-hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`sobre-hero__dot${i === current ? ' sobre-hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
