'use client'

import { useState, useMemo } from 'react'
import type { StoreData } from '@/lib/data/stores'
import Reveal from './Reveal'

type Filter = 'todas' | 'rio' | 'niteroi'

const VISIBLE = 5

const IconPin = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const IconTruck = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
)

const IconMenu = () => (
  <svg viewBox="0 0 24 24">
    <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
  </svg>
)

export default function StoreCarousel({ stores }: { stores: StoreData[] }) {
  const [filter, setFilter] = useState<Filter>('todas')
  const [page, setPage] = useState(0)

  const filtered = useMemo(
    () => (filter === 'todas' ? stores : stores.filter(s => s.region === filter)),
    [filter, stores],
  )

  const pages = Math.ceil(filtered.length / VISIBLE)
  const visible = filtered.slice(page * VISIBLE, page * VISIBLE + VISIBLE)

  const handleFilter = (f: Filter) => {
    setFilter(f)
    setPage(0)
  }

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
        <div className="lojas__carousel">
          {visible.map((store, i) => (
            <Reveal key={store.id} delay={Math.min(i, 4) * 70} className="store-card-reveal">
            <div className="store-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="store-card__img"
                src={store.image}
                alt={`Loja ${store.name}`}
                loading="lazy"
              />
              <div className="store-card__body">
                <p className="store-card__name">{store.name}</p>
                <p className="store-card__address">
                  {store.address.map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                  {store.bairroCity}
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
                    <span className="store-action__icon"><IconTruck /></span>
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

      {pages > 1 && (
        <div className="carousel-nav">
          <button
            className="carousel-arrow"
            onClick={() => setPage(p => (p - 1 + pages) % pages)}
            aria-label="Anterior"
          >
            ‹
          </button>
          <div className="carousel-dots">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === page ? ' active' : ''}`}
                onClick={() => setPage(i)}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="carousel-arrow"
            onClick={() => setPage(p => (p + 1) % pages)}
            aria-label="Próximo"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
