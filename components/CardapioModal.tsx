'use client'

import { useEffect } from 'react'

interface StoreItem {
  name: string
  menuUrl: string
  highlight?: boolean
}

const MODAL_STORES: StoreItem[] = [
  { name: 'Assembléia',         menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/965e1d05-efa4-48d5-a0f4-fc9fdba6afee', highlight: true },
  { name: 'Shopping Rio Sul',   menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/dce05ee3-4573-4a49-9433-a5d12305faad' },
  { name: 'Shopping Metropolitano', menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/9d7d132a-ca39-4c4e-90ac-7aaa891376d5' },
  { name: 'Ipanema',            menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/7b9659ef-9dfc-4330-a828-cde89b0753eb' },
  { name: 'Plaza Niterói',      menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/40e7e5e6-e7ce-488c-98c4-afabf650e969' },
  { name: 'Shopping Tijuca',    menuUrl: '' },
  { name: 'Citta América',      menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/3965d1a1-8830-4cf6-b73f-db3485bd226a' },
  { name: 'Gávea',              menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/2f546851-9d64-4fc0-a2fc-1912df983ecf' },
  { name: 'Barra Shopping',     menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/24f7ac5d-c0e0-41cc-b971-cffdfdbfcc84' },
]

const IconStore = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 4H4v2l8 5 8-5V4zM4 13v7h16v-7l-8 5-8-5z"/>
  </svg>
)

interface Props {
  onClose: () => void
}

export default function CardapioModal({ onClose }: Props) {
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
          {MODAL_STORES.map(store => (
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
