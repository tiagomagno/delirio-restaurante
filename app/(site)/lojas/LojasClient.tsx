'use client'

import { useState } from 'react'
import RetryImage from '@/components/RetryImage'
import { LojaIdentityActions, LojaDetails } from '@/components/LojaInfo'
import type { StoreData, StorePhoto } from '@/lib/data/stores'

/* ─── Carrossel de fotos ─── */
function FotoCarousel({ fotos, nome, priority = false }: { fotos: StorePhoto[]; nome: string; priority?: boolean }) {
  const [idx, setIdx] = useState(0)
  const total = fotos.length
  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  if (total === 0) return null

  const eager = priority && idx === 0

  return (
    <div className="loja-carousel">
      <div className="loja-carousel__frame">
        <RetryImage
          key={fotos[idx].url}
          src={fotos[idx].url}
          alt={fotos[idx].alt || `${nome} — foto ${idx + 1} de ${total}`}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          style={{ objectPosition: `${fotos[idx].position} top` }}
        />
        {total > 1 && (
          <>
            <button className="loja-carousel__arrow loja-carousel__arrow--prev" onClick={prev} aria-label="Foto anterior">‹</button>
            <button className="loja-carousel__arrow loja-carousel__arrow--next" onClick={next} aria-label="Próxima foto">›</button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="loja-carousel__dots">
          {fotos.map((_, i) => (
            <button
              key={i}
              className={`loja-carousel__dot${i === idx ? ' loja-carousel__dot--active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Card de loja ─── */
function LojaCard({ loja, priority = false }: { loja: StoreData; priority?: boolean }) {
  return (
    <article className="loja-card">
      <LojaIdentityActions loja={loja} />
      <FotoCarousel fotos={loja.photos} nome={loja.name} priority={priority} />
      <LojaDetails loja={loja} />
    </article>
  )
}

/* ─── Componente principal ─── */
export default function LojasClient({ stores }: { stores: StoreData[] }) {
  const [regiao, setRegiao] = useState<'rio' | 'niteroi'>('rio')
  const lojasFiltradas = stores.filter(l => l.region === regiao)

  return (
    <div className="lojas-page">
      <nav className="lojas-tabs" aria-label="Filtrar por cidade">
        <button
          className={`lojas-tabs__btn${regiao === 'rio' ? ' lojas-tabs__btn--active' : ''}`}
          onClick={() => setRegiao('rio')}
        >
          Rio de Janeiro
        </button>
        <button
          className={`lojas-tabs__btn${regiao === 'niteroi' ? ' lojas-tabs__btn--active' : ''}`}
          onClick={() => setRegiao('niteroi')}
        >
          Niterói
        </button>
      </nav>

      <div className="lojas-list">
        {lojasFiltradas.map((loja, i) => (
          <LojaCard key={loja.id} loja={loja} priority={i === 0} />
        ))}
      </div>
    </div>
  )
}
