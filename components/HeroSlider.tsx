'use client'

import { useEffect, useState } from 'react'
import CardapioModal, { StoreItem } from './CardapioModal'

export interface HeroSlideData {
  src: string
  alt: string
  isSpecial: boolean
  buttonLabel: string
  buttonUrl: string
}

interface Props {
  slides: HeroSlideData[]
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

  const currentSlide = slides[current]
  const isSpecial = Boolean(currentSlide?.isSpecial && currentSlide.buttonUrl)

  return (
    <>
      <section className="hero" aria-label="Banner principal">
        <div className="hero__slides">
          {slides.map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.src}
              className={`hero__slide${i === current ? ' active' : ''}`}
              src={slide.src}
              alt={slide.alt}
              aria-hidden={i !== current}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          ))}
        </div>
        <div className="hero__btn-wrap">
          {isSpecial ? (
            <a
              className="hero__btn"
              href={currentSlide.buttonUrl}
              target="_blank"
              rel="noopener"
            >
              {currentSlide.buttonLabel || 'veja o cardápio especial'}
            </a>
          ) : (
            <button
              className="hero__btn"
              onClick={() => setModalOpen(true)}
              aria-haspopup="dialog"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </section>

      {modalOpen && <CardapioModal onClose={() => setModalOpen(false)} stores={modalStores} />}
    </>
  )
}
