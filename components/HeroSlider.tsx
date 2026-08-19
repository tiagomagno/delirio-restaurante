'use client'

import { useEffect, useState } from 'react'
import CardapioModal, { StoreItem } from './CardapioModal'

interface Props {
  slides: string[]
  ctaLabel: string
  modalStores: StoreItem[]
}

export default function HeroSlider({ slides, ctaLabel, modalStores }: Props) {
  const [current, setCurrent] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <>
      <section className="hero" aria-label="Banner principal">
        <div className="hero__slides">
          {slides.map((src, i) => (
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
            {ctaLabel}
          </button>
        </div>
      </section>

      {modalOpen && <CardapioModal onClose={() => setModalOpen(false)} stores={modalStores} />}
    </>
  )
}
