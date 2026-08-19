'use client'

import { useEffect } from 'react'

export interface StoreItem {
  name: string
  menuUrl: string
  highlight?: boolean
}

const IconStore = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 4H4v2l8 5 8-5V4zM4 13v7h16v-7l-8 5-8-5z"/>
  </svg>
)

interface Props {
  onClose: () => void
  stores: StoreItem[]
}

export default function CardapioModal({ onClose, stores }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="cardapio-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Consulte o cardápio">
      <div className="cardapio-modal" onClick={e => e.stopPropagation()}>
        <button className="cardapio-modal__close" onClick={onClose} aria-label="Fechar">×</button>
        <h2 className="cardapio-modal__title">Consulte o cardápio</h2>
        <p className="cardapio-modal__sub">Selecione a loja:</p>
        <ul className="cardapio-modal__list">
          {stores.map(store => (
            <li key={store.name} className="cardapio-modal__item">
              {store.menuUrl ? (
                <a
                  href={store.menuUrl}
                  target="_blank"
                  rel="noopener"
                  className="cardapio-modal__link"
                >
                  <span className={`cardapio-modal__icon${store.highlight ? ' cardapio-modal__icon--hl' : ''}`}>
                    <IconStore />
                  </span>
                  <span className="cardapio-modal__name">{store.name}</span>
                </a>
              ) : (
                <span className="cardapio-modal__link cardapio-modal__link--disabled">
                  <span className="cardapio-modal__icon">
                    <IconStore />
                  </span>
                  <span className="cardapio-modal__name">{store.name}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
