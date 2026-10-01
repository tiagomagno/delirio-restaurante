'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconTrash, IconUpload, IconCheck } from './icons'
import Switch from './Switch'
import RetryImage from '@/components/RetryImage'
import { DragHandle, type DragSort, useDragSort } from './useDragSort'

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

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface FieldValues {
  alt: string
  buttonLabel: string
  buttonUrl: string
}

function fieldsOf(slide: Slide): FieldValues {
  return { alt: slide.alt, buttonLabel: slide.buttonLabel, buttonUrl: slide.buttonUrl }
}

async function patchSlide(id: string, data: Record<string, unknown>) {
  return fetch(`/api/admin/hero-slides/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

function SlideCard({
  slide, values, error, sort, onFieldChange, onToggleSpecial, onToggleActive, onRemove,
}: {
  slide: Slide
  sort: DragSort
  values: FieldValues
  error?: string
  onFieldChange: (id: string, field: keyof FieldValues, value: string) => void
  onToggleSpecial: (slide: Slide, next: boolean) => void
  onToggleActive: (slide: Slide) => void
  onRemove: (slide: Slide) => void
}) {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div {...sort.itemProps(slide.id, 'admin-entry')}>
      <div className="admin-entry__top banner-slide__row">
        <DragHandle props={sort.handleProps(slide.id)} />
        <RetryImage
          className="admin-thumb admin-thumb--clickable"
          src={slide.imageUrl}
          alt=""
          onClick={() => setPreviewOpen(true)}
        />

        <label className="banner-slide__alt">
          Texto alternativo da imagem
          <input type="text" value={values.alt} onChange={e => onFieldChange(slide.id, 'alt', e.target.value)} />
        </label>

        <Switch checked={slide.isSpecial} onChange={next => onToggleSpecial(slide, next)} label="Banner especial" />

        <div className="admin-entry__actions">
          <span className={`admin-badge admin-badge--${slide.active ? 'green' : 'gray'}`}>
            {slide.active ? 'Ativo' : 'Inativo'}
          </span>
          {slide.isSpecial && <span className="admin-badge admin-badge--amber">Especial</span>}
          <div className="admin-row-actions">
            <button className="admin-icon-btn" onClick={() => onToggleActive(slide)}>
              {slide.active ? 'Desativar' : 'Ativar'}
            </button>
            <button className="admin-icon-btn" onClick={() => onRemove(slide)} aria-label="Excluir">
              <IconTrash size={14} />
            </button>
          </div>
        </div>
      </div>

      {(slide.isSpecial || error) && (
      <div className="admin-form-grid" style={{ marginTop: 14 }}>
        {slide.isSpecial && (
          <>
            <label className="col-6">
              Texto do botão
              <input
                type="text"
                value={values.buttonLabel}
                onChange={e => onFieldChange(slide.id, 'buttonLabel', e.target.value)}
                placeholder="veja o cardápio de Natal"
              />
            </label>
            <label className="col-6">
              Link do botão
              <input
                type="text"
                value={values.buttonUrl}
                onChange={e => onFieldChange(slide.id, 'buttonUrl', e.target.value)}
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
            <RetryImage src={slide.imageUrl} alt="" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function BannerManager({ slides: serverSlides }: { slides: Slide[] }) {
  const router = useRouter()
  // Ordem otimista: ao soltar o arrasto a lista já reflete a nova ordem, sem
  // esperar o servidor; volta a vir do servidor quando os dados são recarregados.
  const [orderIds, setOrderIds] = useState<string[] | null>(null)
  const slides = orderIds
    ? orderIds.map(id => serverSlides.find(s => s.id === id)).filter((s): s is Slide => !!s)
    : serverSlides
  useEffect(() => setOrderIds(null), [serverSlides])
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [alt, setAlt] = useState('')
  const [isSpecial, setIsSpecial] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')

  // Valores pendentes (ainda não salvos) e o último valor confirmado no
  // servidor, por slide — permite um único botão "Salvar alterações" para
  // qualquer combinação de campos editados em qualquer slide.
  const [values, setValues] = useState<Record<string, FieldValues>>(() =>
    Object.fromEntries(slides.map(s => [s.id, fieldsOf(s)])),
  )
  const [saved, setSaved] = useState<Record<string, FieldValues>>(() =>
    Object.fromEntries(slides.map(s => [s.id, fieldsOf(s)])),
  )
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Acompanha slides adicionados/removidos (upload novo, exclusão) sem
  // descartar edições pendentes de slides que continuam existindo.
  useEffect(() => {
    const ids = new Set(slides.map(s => s.id))
    setValues(v => {
      const next: Record<string, FieldValues> = {}
      for (const s of slides) next[s.id] = v[s.id] ?? fieldsOf(s)
      return next
    })
    setSaved(v => {
      const next: Record<string, FieldValues> = {}
      for (const s of slides) next[s.id] = v[s.id] ?? fieldsOf(s)
      return next
    })
    setFieldErrors(fe => Object.fromEntries(Object.entries(fe).filter(([id]) => ids.has(id))))
  }, [serverSlides])

  const dirtyIds = slides.map(s => s.id).filter(id => JSON.stringify(values[id]) !== JSON.stringify(saved[id]))
  const dirtyCount = dirtyIds.length

  function setField(id: string, field: keyof FieldValues, value: string) {
    setValues(v => ({ ...v, [id]: { ...v[id], [field]: value } }))
    if (saveState !== 'idle') setSaveState('idle')
  }

  async function saveAll() {
    if (dirtyCount === 0) return
    setSaveState('saving')
    const newFieldErrors: Record<string, string> = {}
    const toSave = dirtyIds.filter(id => {
      const slide = slides.find(s => s.id === id)!
      const v = values[id]
      if (!v.alt.trim()) {
        newFieldErrors[id] = 'Texto alternativo é obrigatório'
        return false
      }
      if (slide.isSpecial && (!v.buttonLabel.trim() || !v.buttonUrl.trim())) {
        newFieldErrors[id] = 'Preencha o texto e o link do botão'
        return false
      }
      return true
    })
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors)
      setSaveState('error')
      return
    }
    try {
      const results = await Promise.all(
        toSave.map(async id => {
          const v = values[id]
          const res = await patchSlide(id, { alt: v.alt, buttonLabel: v.buttonLabel, buttonUrl: v.buttonUrl })
          return { id, ok: res.ok }
        }),
      )
      const failed = results.filter(r => !r.ok)
      if (failed.length > 0) {
        setFieldErrors(Object.fromEntries(failed.map(f => [f.id, 'Erro ao salvar'])))
        setSaveState('error')
        return
      }
      setFieldErrors({})
      setSaved(s => ({ ...s, ...Object.fromEntries(toSave.map(id => [id, values[id]])) }))
      setSaveState('saved')
      setTimeout(() => setSaveState(s => (s === 'saved' ? 'idle' : s)), 2500)
    } catch {
      setSaveState('error')
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setError('')
    if (!alt.trim()) {
      setError('Descreva a imagem no texto alternativo antes de adicionar o slide')
      return
    }
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
        body: JSON.stringify({ imageUrl: uploadData.url, alt, isSpecial, buttonLabel, buttonUrl }),
      })
      if (!createRes.ok) {
        const result = await createRes.json().catch(() => ({}))
        throw new Error(result.error ?? 'Erro ao salvar slide')
      }

      if (fileRef.current) fileRef.current.value = ''
      setAlt('')
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

  // Reaproveita os valores de "order" que já existem, redistribuídos na nova
  // sequência, e só grava os slides que de fato mudaram de posição.
  async function reorder(orderedIds: string[]) {
    setOrderIds(orderedIds)
    const orders = slides.map(s => s.order).sort((a, b) => a - b)
    const byId = new Map(slides.map(s => [s.id, s]))
    const updates = orderedIds
      .map((id, i) => ({ id, order: orders[i] }))
      .filter(u => byId.get(u.id)?.order !== u.order)
    try {
      const results = await Promise.all(updates.map(u => patchSlide(u.id, { order: u.order })))
      if (results.some(r => !r.ok)) throw new Error('reorder failed')
      setError('')
    } catch {
      setError('Não foi possível salvar a nova ordem. Tente novamente.')
    }
    router.refresh()
  }

  const sort = useDragSort(slides.map(s => s.id), reorder)

  async function toggleSpecial(slide: Slide, next: boolean) {
    const v = saved[slide.id]
    if (next && (!v.buttonLabel.trim() || !v.buttonUrl.trim())) {
      setFieldErrors(fe => ({ ...fe, [slide.id]: 'Preencha e salve o texto e o link do botão antes de marcar como especial' }))
      return
    }
    setFieldErrors(fe => { const n = { ...fe }; delete n[slide.id]; return n })
    await patchSlide(slide.id, { isSpecial: next })
    router.refresh()
  }

  async function toggleActive(slide: Slide) {
    await patchSlide(slide.id, { active: !slide.active })
    router.refresh()
  }

  async function remove(slide: Slide) {
    if (!confirm('Remover este slide do banner?')) return
    await fetch(`/api/admin/hero-slides/${slide.id}`, { method: 'DELETE' })
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

          <div className="admin-form-grid">
            <label className="col-12">
              Texto alternativo da imagem (descreva o que aparece na foto, para quem usa leitor de tela)
              <input
                type="text"
                value={alt}
                onChange={e => setAlt(e.target.value)}
                placeholder="ex.: Prato de salada com frango grelhado e legumes frescos"
                required
              />
            </label>
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
        <div className="admin-paginas-toolbar">
          <p className="admin-paginas-toolbar__status">
            {saveState === 'error'
              ? 'Erro ao salvar — confira os campos abaixo e tente novamente.'
              : dirtyCount > 0
                ? `${dirtyCount} ${dirtyCount === 1 ? 'slide com alteração não salva' : 'slides com alterações não salvas'}`
                : 'Tudo salvo'}
          </p>
          <button
            type="button"
            className="admin-btn"
            onClick={saveAll}
            disabled={dirtyCount === 0 || saveState === 'saving'}
          >
            {saveState === 'saving' ? 'Salvando...' : saveState === 'saved' ? <><IconCheck size={15} /> Salvo</> : 'Salvar alterações'}
          </button>
        </div>

        <div className="admin-entry-list">
          {slides.map(slide => (
            <SlideCard
              key={slide.id}
              slide={slide}
              sort={sort}
              values={values[slide.id] ?? fieldsOf(slide)}
              error={fieldErrors[slide.id]}
              onFieldChange={setField}
              onToggleSpecial={toggleSpecial}
              onToggleActive={toggleActive}
              onRemove={remove}
            />
          ))}
          {slides.length === 0 && <p className="admin-empty">Nenhum slide cadastrado ainda.</p>}
        </div>
      </div>
    </div>
  )
}
