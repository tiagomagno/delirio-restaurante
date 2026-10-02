'use client'

import { useEffect } from 'react'

const LERP = 0.1
const WHEEL_MIN_DELTA = 40 // abaixo disso é trackpad, que já tem inércia nativa

/** True se o elemento (ou um ancestral) rola por conta própria — nesse caso o wheel é dele. */
function insideScrollable(el: Element | null): boolean {
  for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
    if (node.closest('[role="dialog"], [aria-modal="true"]') === node) return true
    const { overflowY } = getComputedStyle(node)
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node !== document.body
    }
  }
  return false
}

/**
 * Rolagem suave com inércia para roda de mouse (desktop). Não faz nada em touch,
 * em trackpad nem com prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reduced.matches) return

    let target = window.scrollY
    let raf = 0
    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

    const tick = () => {
      const diff = target - window.scrollY
      if (Math.abs(diff) < 0.5) {
        window.scrollTo({ top: target, behavior: 'instant' })
        raf = 0
        return
      }
      window.scrollTo({ top: window.scrollY + diff * LERP, behavior: 'instant' })
      raf = requestAnimationFrame(tick)
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      if (document.body.style.overflow === 'hidden') return // modal aberto
      if (insideScrollable(e.target as Element)) return

      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
      if (!raf && Math.abs(delta) < WHEEL_MIN_DELTA) return

      e.preventDefault()
      if (!raf) target = window.scrollY
      target = Math.min(Math.max(target + delta, 0), maxScroll())
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // Rolagem por outros meios (teclado, âncora, barra) reposiciona o alvo.
    const onScroll = () => {
      if (!raf) target = window.scrollY
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
