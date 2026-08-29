'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import type { StoreData } from '@/lib/data/stores'
import Reveal from './Reveal'

type Filter = 'todas' | 'rio' | 'niteroi'

const IconPin = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const IconMoto = () => (
  <svg viewBox="0 0 24 24">
    <path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h1.65l2.77-2.77c-.21.54-.32 1.14-.32 1.77 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97zM7.82 15C7.4 16.15 6.3 17 5 17c-1.65 0-3-1.35-3-3s1.35-3 3-3c1.3 0 2.4.85 2.82 2H5v2h2.82zM19 17c-1.65 0-3-1.35-3-3 0-.16.02-.31.05-.46L17.76 15H19v-1.24l1.71-1.71c.18.42.29.88.29 1.36 0 1.65-1.35 3-3 3z" />
  </svg>
)

const IconMenu = () => (
  <svg viewBox="0 0 24 24">
    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
  </svg>
)

export default function StoreCarousel({ stores }: { stores: StoreData[] }) {
  const [filter, setFilter] = useState<Filter>('todas')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [nav, setNav] = useState({ index: 0, pages: 1 })

  const filtered = useMemo(
    () => (filter === 'todas' ? stores : stores.filter(s => s.region === filter)),
    [filter, stores],
  )

  const updateNav = useCallback(() => {
    const el = scrollRef.current
    if (!el || el.clientWidth === 0) return
    const hasOverflow = el.scrollWidth - el.clientWidth > 4
    const pages = hasOverflow ? Math.ceil(el.scrollWidth / el.clientWidth) : 1
    const index = hasOverflow ? Math.min(pages - 1, Math.round(el.scrollLeft / el.clientWidth)) : 0
    setNav({ index, pages })
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0 })
    updateNav()
  }, [filtered, updateNav])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateNav, { passive: true })
    const observer = new ResizeObserver(updateNav)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', updateNav)
      observer.disconnect()
    }
  }, [updateNav])

  function goTo(index: number) {
    const el = scrollRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(nav.pages - 1, index))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  const handleFilter = (f: Filter) => setFilter(f)

  return (
    <div className="lojas">
      <h2 className="lojas__title">Lojas Delírio</h2>
      <p className="lojas__subtitle">Visite a loja mais próxima ou peça por delivery</p>

      <div className="lojas__tabs" role="tablist">
        {(['todas', 'rio', 'niteroi'] as Filter[]).map(f => (
          <button
            key={f}
            className={`lojas__tab${filter === f ? ' active' : ''}`}
            onClick={() => handleFilter(f)}
            role="tab"
            aria-selected={filter === f}
          >
            {f === 'todas' ? 'Todas' : f === 'rio' ? 'Rio de Janeiro' : 'Niterói'}
          </button>
        ))}
      </div>

      <div className="lojas__carousel-wrap">
        <div className="lojas__carousel" ref={scrollRef}>
          {filtered.map((store, i) => (
            <Reveal key={store.id} delay={Math.min(i, 4) * 70} className="store-card-reveal">
            <div className="store-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="store-card__img"
                src={store.image}
                alt={store.imageAlt || `Loja ${store.name}`}
                loading="lazy"
              />
              <div className="store-card__body">
                <p className="store-card__name">{store.name}</p>
                <p className="store-card__address" title={[...store.address, store.bairroCity].join(', ')}>
                  {[...store.address, store.bairroCity].join(', ')}
                </p>
                <div className="store-card__actions">
                  <a
                    className="store-action"
                    href={store.mapsUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Como chegar em ${store.name}`}
                  >
                    <span className="store-action__icon"><IconPin /></span>
                    <span className="store-action__label">Como chegar</span>
                  </a>
                  <a
                    className="store-action"
                    href={store.deliveryUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Delivery ${store.name}`}
                  >
                    <span className="store-action__icon"><IconMoto /></span>
                    <span className="store-action__label">Delivery</span>
                  </a>
                  <a
                    className="store-action"
                    href={store.menuUrl}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Cardápio ${store.name}`}
                  >
                    <span className="store-action__icon"><IconMenu /></span>
                    <span className="store-action__label">Ver cardápio</span>
                  </a>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>

      {nav.pages > 1 && (
        <div className="carousel-nav">
          <button
            className="carousel-arrow"
            onClick={() => goTo(nav.index - 1)}
            disabled={nav.index === 0}
            aria-label="Anterior"
          >
            ‹
          </button>
          <div className="carousel-dots">
            {Array.from({ length: nav.pages }, (_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === nav.index ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="carousel-arrow"
            onClick={() => goTo(nav.index + 1)}
            disabled={nav.index === nav.pages - 1}
            aria-label="Próximo"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
