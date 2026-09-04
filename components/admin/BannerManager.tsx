'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowUp, IconArrowDown, IconTrash, IconUpload } from './icons'
import Switch from './Switch'

export interface Slide {
  id: string
  imageUrl: string
  alt: string
  order: number
  active: boolean
  isSpecial: boolean
  buttonLabel: string
  buttonUrl: string
}

async function patchSlide(id: string, data: Record<string, unknown>) {
  await fetch(`/api/admin/hero-slides/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

function SlideCard({ slide, index, total, onMove, onChanged }: {
  slide: Slide
  index: number
  total: number
  onMove: (slide: Slide, direction: -1 | 1) => void
  onChanged: () => void
}) {
  const router = useRouter()
  const [alt, setAlt] = useState(slide.alt)
  const [isSpecial, setIsSpecial] = useState(slide.isSpecial)
  const [buttonLabel, setButtonLabel] = useState(slide.buttonLabel)
  const [buttonUrl, setButtonUrl] = useState(slide.buttonUrl)
  const [error, setError] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  async function saveAlt() {
    if (alt === slide.alt) return
    await patchSlide(slide.id, { alt })
    onChanged()
  }

  async function toggleSpecial(next: boolean) {
    if (next && (!buttonLabel.trim() || !buttonUrl.trim())) {
      setError('Preencha o texto e o link do botão antes de marcar como especial')
      setIsSpecial(true)
      return
    }
    setError('')
    setIsSpecial(next)
    await patchSlide(slide.id, { isSpecial: next })
    onChanged()
  }

  async function saveButtonFields() {
    if (buttonLabel === slide.buttonLabel && buttonUrl === slide.buttonUrl) return
    if (isSpecial && (!buttonLabel.trim() || !buttonUrl.trim())) {
      setError('Preencha o texto e o link do botão')
      return
    }
    setError('')
    await patchSlide(slide.id, { buttonLabel, buttonUrl })
    onChanged()
  }

  async function toggleActive() {
    await patchSlide(slide.id, { active: !slide.active })
    router.refresh()
  }

  async function remove() {
    if (!confirm('Remover este slide do banner?')) return
    await fetch(`/api/admin/hero-slides/${slide.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="admin-entry">
      <div className="admin-entry__top banner-slide__row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="admin-thumb admin-thumb--clickable"
          src={slide.imageUrl}
          alt=""
          onClick={() => setPreviewOpen(true)}
        />

        <label className="banner-slide__alt">
          Texto alternativo da imagem
          <input type="text" value={alt} onChange={e => setAlt(e.target.value)} onBlur={saveAlt} />
        </label>

        <Switch checked={isSpecial} onChange={toggleSpecial} label="Banner especial" />

        <div className="admin-entry__actions">
          <span className={`admin-badge admin-badge--${slide.active ? 'green' : 'gray'}`}>
            {slide.active ? 'Ativo' : 'Inativo'}
          </span>
          {isSpecial && <span className="admin-badge admin-badge--amber">Especial</span>}
          <div className="admin-row-actions">
            <button className="admin-icon-btn" onClick={() => onMove(slide, -1)} disabled={index === 0} aria-label="Mover para cima">
              <IconArrowUp size={14} />
            </button>
            <button className="admin-icon-btn" onClick={() => onMove(slide, 1)} disabled={index === total - 1} aria-label="Mover para baixo">
              <IconArrowDown size={14} />
            </button>
            <button className="admin-icon-btn" onClick={toggleActive}>
              {slide.active ? 'Desativar' : 'Ativar'}
            </button>
            <button className="admin-icon-btn" onClick={remove} aria-label="Excluir">
              <IconTrash size={14} />
            </button>
          </div>
        </div>
      </div>

      {(isSpecial || error) && (
      <div className="admin-form-grid" style={{ marginTop: 14 }}>
        {isSpecial && (
          <>
            <label className="col-6">
              Texto do botão
              <input
                type="text"
                value={buttonLabel}
                onChange={e => setButtonLabel(e.target.value)}
                onBlur={saveButtonFields}
                placeholder="veja o cardápio de Natal"
              />
            </label>
            <label className="col-6">
              Link do botão
              <input
                type="text"
                value={buttonUrl}
                onChange={e => setButtonUrl(e.target.value)}
                onBlur={saveButtonFields}
                placeholder="https://cardapiodigital.delirio.com.br/..."
              />
            </label>
          </>
        )}

        {error && <p className="admin-error col-12">{error}</p>}
      </div>
      )}

      {previewOpen && (
        <div className="admin-modal-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="admin-image-preview" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="admin-image-preview__close"
              onClick={() => setPreviewOpen(false)}
              aria-label="Fechar"
            >
              ×
            </button>
            <img src={slide.imageUrl} alt="" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function BannerManager({ slides }: { slides: Slide[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isSpecial, setIsSpecial] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setError('')
    if (isSpecial && (!buttonLabel.trim() || !buttonUrl.trim())) {
      setError('Preencha o texto e o link do botão para um slide especial')
      return
    }
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'hero')
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Erro no upload')

      const createRes = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadData.url, isSpecial, buttonLabel, buttonUrl }),
      })
      if (!createRes.ok) {
        const result = await createRes.json().catch(() => ({}))
        throw new Error(result.error ?? 'Erro ao salvar slide')
      }

      if (fileRef.current) fileRef.current.value = ''
      setIsSpecial(false)
      setButtonLabel('')
      setButtonUrl('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setUploading(false)
    }
  }

  async function move(slide: Slide, direction: -1 | 1) {
    const index = slides.findIndex(s => s.id === slide.id)
    const swapWith = slides[index + direction]
    if (!swapWith) return
    await Promise.all([
      patchSlide(slide.id, { order: swapWith.order }),
      patchSlide(swapWith.id, { order: slide.order }),
    ])
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="admin-panel">
        <form className="admin-form" onSubmit={handleUpload} style={{ maxWidth: 'none' }}>
          <div className="admin-form-row">
            <label>
              Nova imagem do banner
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
            </label>

            <Switch checked={isSpecial} onChange={setIsSpecial} label="Banner especial" />

            <button className="admin-btn" type="submit" disabled={uploading}>
              <IconUpload size={16} />
              {uploading ? 'Enviando...' : 'Adicionar slide'}
            </button>
          </div>

          {isSpecial && (
            <div className="admin-form-grid">
              <label className="col-6">
                Texto do botão
                <input
                  type="text"
                  value={buttonLabel}
                  onChange={e => setButtonLabel(e.target.value)}
                  placeholder="veja o cardápio de Natal"
                  required={isSpecial}
                />
              </label>
              <label className="col-6">
                Link do botão
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={e => setButtonUrl(e.target.value)}
                  placeholder="https://cardapiodigital.delirio.com.br/..."
                  required={isSpecial}
                />
              </label>
            </div>
          )}
          {error && <p className="admin-error">{error}</p>}
        </form>
      </div>

      <div className="admin-panel">
        <div className="admin-entry-list">
          {slides.map((slide, i) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              index={i}
              total={slides.length}
              onMove={move}
              onChanged={() => router.refresh()}
            />
          ))}
          {slides.length === 0 && <p className="admin-empty">Nenhum slide cadastrado ainda.</p>}
        </div>
      </div>
    </div>
  )
}
