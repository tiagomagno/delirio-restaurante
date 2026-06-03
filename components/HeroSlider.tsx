'use client'

import { useEffect, useState } from 'react'
import CardapioModal from './CardapioModal'

const SLIDES = [
  'https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_7.jpg',
  'https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_6.jpg',
  'https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_4.jpg',
  'https://delirio.com.br/wp-content/uploads/2023/05/Delirio_slide2.jpg',
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <section className="hero" aria-label="Banner principal">
        <div className="hero__slides">
          {SLIDES.map((src, i) => (
            <div
              key={src}
              className={`hero__slide${i === current ? ' active' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
              aria-hidden={i !== current}
            />
          ))}
        </div>
        <div className="hero__btn-wrap">
          <button
            className="hero__btn"
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
          >
            veja o cardápio do dia
          </button>
        </div>
      </section>

      {modalOpen && <CardapioModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
