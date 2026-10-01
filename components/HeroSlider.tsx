'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

const AUTOPLAY_MS = 5000
const DRAG_START_PX = 8
const SWIPE_RATIO = 0.18 // fração da largura que confirma a troca
const SWIPE_VELOCITY = 0.45 // px/ms — um "flick" rápido também troca

/** Posição do slide relativa ao atual: 0 = visível, ±1 = vizinho, ±2 = fora de cena. */
function relativePosition(i: number, current: number, n: number, dragDir: number): number {
  const d = (((i - current) % n) + n) % n
  if (d === 0) return 0
  if (n === 2) return dragDir > 0 ? -1 : 1
  if (d === 1) return 1
  if (d === n - 1) return -1
  return d <= n / 2 ? 2 : -2
}

export default function HeroSlider({ slides, ctaLabel, modalStores }: Props) {
  const n = slides.length
  const [current, setCurrent] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)

  const slidesRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, started: false, startX: 0, lastX: 0, lastT: 0, velocity: 0, id: -1 })
  const prevRels = useRef<number[]>([])

  const go = useCallback((delta: number) => {
    setCurrent(c => (((c + delta) % n) + n) % n)
  }, [n])

  // Autoplay: reinicia a cada troca (inclusive manual) e pausa durante o arrasto.
  useEffect(() => {
    if (n < 2 || dragging) return
    const timer = setTimeout(() => go(1), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [n, current, dragging, go])

  const dragDir = dragX === 0 ? 0 : dragX > 0 ? 1 : -1
  const rels = slides.map((_, i) => relativePosition(i, current, n, dragDir))

  // Slide que "pula" de um lado ao outro (volta do carrossel) não deve animar atravessando a tela.
  const jumped = rels.map((r, i) => prevRels.current[i] !== undefined && Math.abs(r - prevRels.current[i]) > 1)
  useLayoutEffect(() => {
    prevRels.current = rels
  })

  const onPointerDown = (e: React.PointerEvent) => {
    if (n < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return
    drag.current = { active: true, started: false, startX: e.clientX, lastX: e.clientX, lastT: e.timeStamp, velocity: 0, id: e.pointerId }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.active || e.pointerId !== d.id) return
    const dx = e.clientX - d.startX
    if (!d.started) {
      if (Math.abs(dx) < DRAG_START_PX) return
      d.started = true
      setDragging(true)
      slidesRef.current?.setPointerCapture(e.pointerId)
    }
    const dt = e.timeStamp - d.lastT
    if (dt > 0) d.velocity = (e.clientX - d.lastX) / dt
    d.lastX = e.clientX
    d.lastT = e.timeStamp
    setDragX(dx)
  }

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.active || e.pointerId !== d.id) return
    d.active = false
    if (!d.started) return
    const width = slidesRef.current?.clientWidth ?? 1
    const dx = e.clientX - d.startX
    const flick = Math.abs(d.velocity) > SWIPE_VELOCITY && Math.sign(d.velocity) === Math.sign(dx)
    setDragging(false)
    setDragX(0)
    if (e.type !== 'pointercancel' && (Math.abs(dx) > width * SWIPE_RATIO || flick)) {
      go(dx < 0 ? 1 : -1)
    }
  }

  const currentSlide = slides[current]
  const isSpecial = Boolean(currentSlide?.isSpecial && currentSlide.buttonUrl)

  return (
    <>
      <section className="hero" aria-label="Banner principal">
        <div
          ref={slidesRef}
          className={`hero__slides${dragging ? ' is-dragging' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className={`hero__slide${i === current ? ' active' : ''}`}
              style={{
                transform: `translate3d(calc(${rels[i] * 100}% + ${Math.abs(rels[i]) <= 1 ? dragX : 0}px), 0, 0)`,
                transition: dragging || jumped[i] ? 'none' : undefined,
                visibility: Math.abs(rels[i]) > 1 ? 'hidden' : undefined,
              }}
              aria-hidden={i !== current}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero__slide-img"
                src={slide.src}
                alt={slide.alt}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            </div>
          ))}
        </div>

        {n > 1 && (
          <>
            <button type="button" className="hero__arrow hero__arrow--prev" onClick={() => go(-1)} aria-label="Banner anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" className="hero__arrow hero__arrow--next" onClick={() => go(1)} aria-label="Próximo banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

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
