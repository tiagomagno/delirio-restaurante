'use client'

import { useState } from 'react'
import type { StoreData } from '@/lib/data/stores'

/* ─── Ícones ─── */
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}
function IconDelivery() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  )
}
function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
    </svg>
  )
}
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  )
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  )
}

/* ─── Carrossel de fotos ─── */
function FotoCarousel({ fotos, nome }: { fotos: string[]; nome: string }) {
  const [idx, setIdx] = useState(0)
  const total = fotos.length
  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  if (total === 0) return null

  return (
    <div className="loja-carousel">
      <div className="loja-carousel__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={fotos[idx]}
          src={fotos[idx]}
          alt={`${nome} — foto ${idx + 1} de ${total}`}
          loading="lazy"
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
function LojaCard({ loja }: { loja: StoreData }) {
  const telefone = loja.phones[0] ?? ''
  const horario1 = loja.hours[0] ?? ''
  const horario2 = loja.hours[1]

  return (
    <article className="loja-card">
      <div className="loja-card__top">
        <div className="loja-card__identity">
          <h2 className="loja-card__nome">{loja.name}</h2>
          <p className="loja-card__endereco">{loja.address.join(' ')}</p>
          <p className="loja-card__bairro">{loja.bairroCity}</p>
        </div>

        <div className="loja-card__actions">
          <a href={loja.mapsUrl} target="_blank" rel="noopener" className="loja-action" aria-label="Como chegar">
            <span className="loja-action__circle"><IconPin /></span>
            <span className="loja-action__label">COMO CHEGAR</span>
          </a>
          <a href={loja.deliveryUrl} target="_blank" rel="noopener" className="loja-action" aria-label="Delivery">
            <span className="loja-action__circle"><IconDelivery /></span>
            <span className="loja-action__label">DELIVERY</span>
          </a>
          {loja.menuUrl ? (
            <a href={loja.menuUrl} target="_blank" rel="noopener" className="loja-action" aria-label="Ver cardápio">
              <span className="loja-action__circle"><IconMenu /></span>
              <span className="loja-action__label">VER CARDÁPIO</span>
            </a>
          ) : (
            <span className="loja-action loja-action--disabled" aria-hidden="true">
              <span className="loja-action__circle"><IconMenu /></span>
              <span className="loja-action__label">VER CARDÁPIO</span>
            </span>
          )}
        </div>
      </div>

      <FotoCarousel fotos={loja.photos} nome={loja.name} />

      <div className="loja-card__details">
        <div className="loja-card__horario">
          <h3 className="loja-card__section-title">Horário de Funcionamento</h3>
          <p>{horario1}</p>
          {horario2 && <p>{horario2}</p>}
        </div>

        <div className="loja-card__contatos">
          <h3 className="loja-card__section-title">Contatos</h3>
          <ul className="loja-card__contact-list">
            {loja.whatsapp && (
              <li>
                <a
                  href={`https://api.whatsapp.com/send?phone=${loja.whatsapp}`}
                  target="_blank"
                  rel="noopener"
                  className="loja-card__contact-link loja-card__contact-link--wa"
                >
                  <IconWhatsApp />
                  <span>{loja.whatsapp.replace('55', '(').replace(/^\((\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}</span>
                </a>
              </li>
            )}
            {telefone && (
              <li>
                <a href={`tel:${telefone.replace(/\D/g, '')}`} className="loja-card__contact-link">
                  <IconPhone />
                  <span>{telefone}</span>
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${loja.email}`} className="loja-card__contact-link">
                <IconEmail />
                <span>{loja.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
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
        {lojasFiltradas.map(loja => (
          <LojaCard key={loja.id} loja={loja} />
        ))}
      </div>
    </div>
  )
}
