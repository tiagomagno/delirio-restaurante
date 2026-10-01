'use client'

import { useState } from 'react'
import type { DragEvent, KeyboardEvent } from 'react'
import { IconGrip } from './icons'

// Reordenação por arrasto com a API nativa de drag-and-drop do navegador (sem
// dependência extra). A alça (DragHandle) é o que se arrasta, mas a imagem do
// arrasto é o cartão inteiro. Também dá pra reordenar pelo teclado: com a alça
// focada, setas ↑/↓ movem o item.
//
// `keys` é a lista atual (na ordem de exibição); `onReorder` recebe a nova ordem.
export function useDragSort(keys: string[], onReorder: (orderedKeys: string[]) => void) {
  const [dragKey, setDragKey] = useState<string | null>(null)
  const [overKey, setOverKey] = useState<string | null>(null)

  function reset() {
    setDragKey(null)
    setOverKey(null)
  }

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || to >= keys.length) return
    const next = [...keys]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onReorder(next)
  }

  function handleProps(key: string) {
    return {
      draggable: true,
      onDragStart: (e: DragEvent<HTMLElement>) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', key)
        const card = e.currentTarget.closest('[data-sort-item]')
        if (card) e.dataTransfer.setDragImage(card, 24, 24)
        setDragKey(key)
      },
      onDragEnd: reset,
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        const i = keys.indexOf(key)
        if (e.key === 'ArrowUp') { e.preventDefault(); move(i, i - 1) }
        if (e.key === 'ArrowDown') { e.preventDefault(); move(i, i + 1) }
      },
    }
  }

  function itemProps(key: string, baseClass = '') {
    const from = dragKey ? keys.indexOf(dragKey) : -1
    const to = keys.indexOf(key)
    const showLine = dragKey !== null && overKey === key && dragKey !== key
    const state = [
      dragKey === key ? 'is-dragging' : '',
      showLine ? (from > to ? 'is-drop-before' : 'is-drop-after') : '',
    ].filter(Boolean).join(' ')
    return {
      'data-sort-item': '',
      className: [baseClass, state].filter(Boolean).join(' '),
      onDragOver: (e: DragEvent<HTMLElement>) => {
        if (dragKey === null) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (overKey !== key) setOverKey(key)
      },
      onDrop: (e: DragEvent<HTMLElement>) => {
        if (dragKey === null) return
        e.preventDefault()
        move(keys.indexOf(dragKey), keys.indexOf(key))
        reset()
      },
    }
  }

  return { handleProps, itemProps }
}

export type DragSort = ReturnType<typeof useDragSort>

export function DragHandle({ props, label = 'Arrastar para reordenar' }: {
  props: ReturnType<DragSort['handleProps']>
  label?: string
}) {
  return (
    <button
      type="button"
      className="admin-drag-handle"
      aria-label={`${label} (ou use as setas ↑ ↓)`}
      title="Arraste para reordenar"
      {...props}
    >
      <IconGrip size={18} />
    </button>
  )
}
