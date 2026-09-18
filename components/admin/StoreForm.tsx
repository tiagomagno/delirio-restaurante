'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconTrash, IconArrowUp, IconArrowDown, IconHome, IconStore, IconAlignLeft, IconAlignCenter, IconAlignRight, IconMoreVertical, IconUpload } from './icons'
import RetryImage from '@/components/RetryImage'
import type { StorePhoto, StorePhotoPosition } from '@/lib/data/stores'

const POSITION_OPTIONS: { value: StorePhotoPosition; label: string; icon: typeof IconAlignLeft }[] = [
  { value: 'left', label: 'Esquerda', icon: IconAlignLeft },
  { value: 'center', label: 'Centro', icon: IconAlignCenter },
  { value: 'right', label: 'Direita', icon: IconAlignRight },
]

export interface StoreFormData {
  id?: string
  slug: string
  name: string
  address: string[]
  bairroCity: string
  region: string
  image: string
  imageAlt: string
  storeImage: string
  storeImageAlt: string
  photos: StorePhoto[]
  mapsUrl: string
  deliveryUrl: string
  menuUrl: string
  hours: string[]
  phones: string[]
  whatsapp: string
  email: string
  extraRecipients: string[]
  highlight: boolean
  active: boolean
}

const EMPTY: StoreFormData = {
  slug: '', name: '', address: [''], bairroCity: '', region: 'rio', image: '', imageAlt: '',
  storeImage: '', storeImageAlt: '', photos: [],
  mapsUrl: '', deliveryUrl: '', menuUrl: '', hours: [''], phones: [''], whatsapp: '', email: '',
  extraRecipients: [],
  highlight: false, active: true,
}

type Section = 'geral' | 'contato' | 'galeria' | 'visibilidade'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'geral', label: 'Dados gerais' },
  { id: 'contato', label: 'Formulário de contato' },
  { id: 'galeria', label: 'Galeria de fotos' },
  { id: 'visibilidade', label: 'Visibilidade' },
]

async function uploadImage(file: File, folder: string) {
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Erro no upload')
  return data.url as string
}

// Lojas antigas podem ter uma "foto principal" que nunca foi enviada para a
// galeria. Injeta essa foto como primeiro item da galeria para que ela vire
// a capa selecionável, em vez de ficar órfã fora da lista.
function normalizeInitial(initial: StoreFormData): StoreFormData {
  if (!initial.image || initial.photos.some(p => p.url === initial.image)) return initial
  return { ...initial, photos: [{ url: initial.image, alt: initial.imageAlt, position: 'center' }, ...initial.photos] }
}

export default function StoreForm({ title, initial }: { title: React.ReactNode; initial?: StoreFormData }) {
  const router = useRouter()
  const [data, setData] = useState<StoreFormData>(() => normalizeInitial(initial ?? EMPTY))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [section, setSection] = useState<Section>('geral')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const photosRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof StoreFormData>(key: K, value: StoreFormData[K]) {
    setData(d => ({ ...d, [key]: value }))
  }

  function setLines(key: 'address' | 'hours' | 'phones', text: string) {
    set(key, text.split('\n'))
  }

  function setExtraRecipients(text: string) {
    set('extraRecipients', text.split('\n'))
  }

  async function handlePhotosUpload() {
    const files = photosRef.current?.files
    if (!files || files.length === 0) return
    setError('')
    try {
      const urls = await Promise.all(Array.from(files).map(f => uploadImage(f, 'lojas')))
      const newPhotos: StorePhoto[] = urls.map(url => ({ url, alt: '', position: 'center' }))
      setData(d => ({
        ...d,
        photos: [...d.photos, ...newPhotos],
        image: d.image || newPhotos[0].url,
      }))
      if (photosRef.current) photosRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload')
    }
  }

  function setPhotoAlt(url: string, alt: string) {
    set('photos', data.photos.map(p => (p.url === url ? { ...p, alt } : p)))
  }

  function setPhotoPosition(url: string, position: StorePhotoPosition) {
    set('photos', data.photos.map(p => (p.url === url ? { ...p, position } : p)))
  }

  function removePhoto(url: string) {
    setData(d => {
      const photos = d.photos.filter(p => p.url !== url)
      const image = d.image === url ? (photos[0]?.url ?? '') : d.image
      const storeImage = d.storeImage === url ? '' : d.storeImage
      return { ...d, photos, image, storeImage }
    })
  }

  function setHomeCover(url: string) {
    set('image', url)
  }

  function setStoreCover(url: string) {
    set('storeImage', data.storeImage === url ? '' : url)
  }

  // Move dentro da sublista visível (a Galeria, que exclui as capas) em vez de
  // por índice bruto do array — assim a seta sempre troca com o item vizinho
  // que o usuário está vendo, mesmo que uma capa esteja intercalada no array.
  function moveGalleryPhoto(url: string, direction: -1 | 1, visibleList: StorePhoto[]) {
    const idx = visibleList.findIndex(p => p.url === url)
    const targetUrl = visibleList[idx + direction]?.url
    if (!targetUrl) return
    const a = data.photos.findIndex(p => p.url === url)
    const b = data.photos.findIndex(p => p.url === targetUrl)
    const photos = [...data.photos]
    ;[photos[a], photos[b]] = [photos[b], photos[a]]
    set('photos', photos)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const cover = data.photos.find(p => p.url === data.image)
    if (!cover) {
      setError('Envie ao menos uma foto na galeria e marque uma como capa da Home')
      setSection('galeria')
      return
    }
    const storeCover = data.photos.find(p => p.url === data.storeImage)
    setSaving(true)
    const payload = {
      ...data,
      imageAlt: cover.alt,
      storeImageAlt: storeCover?.alt ?? '',
      address: data.address.map(l => l.trim()).filter(Boolean),
      hours: data.hours.map(l => l.trim()).filter(Boolean),
      phones: data.phones.map(l => l.trim()).filter(Boolean),
      extraRecipients: data.extraRecipients.map(l => l.trim()).filter(Boolean),
    }
    try {
      const url = data.id ? `/api/admin/stores/${data.id}` : '/api/admin/stores'
      const method = data.id ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Erro ao salvar loja')
      router.push('/admin/lojas')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!data.id) return
    if (!confirm(`Remover a loja "${data.name}"? Essa ação não pode ser desfeita.`)) return
    await fetch(`/api/admin/stores/${data.id}`, { method: 'DELETE' })
    router.push('/admin/lojas')
    router.refresh()
  }

  function renderPhotoRow(photo: StorePhoto, moveWithin?: StorePhoto[]) {
    const isHomeCover = photo.url === data.image
    const isStoreCover = photo.url === data.storeImage
    const positionLabel = POSITION_OPTIONS.find(o => o.value === photo.position)?.label
    const menuOpenHere = menuOpen === photo.url
    const moveIdx = moveWithin?.findIndex(p => p.url === photo.url) ?? -1

    return (
      <div key={photo.url} className="admin-entry">
        <div className="admin-gallery-item" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <RetryImage
            className="admin-thumb admin-thumb--clickable"
            src={photo.url}
            alt=""
            style={{ width: 120, height: 80, flexShrink: 0, objectPosition: photo.position }}
            onClick={() => setPreviewUrl(photo.url)}
          />
          {isHomeCover && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <RetryImage
                className="admin-thumb-square"
                src={photo.url}
                alt=""
                style={{ objectPosition: photo.position }}
              />
              <span style={{ fontSize: 11, color: 'var(--admin-text-muted, #888)', textAlign: 'center' }}>
                prévia no card da Home
              </span>
            </div>
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              value={photo.alt}
              onChange={e => setPhotoAlt(photo.url, e.target.value)}
              placeholder="Texto alternativo da foto"
            />
            <div className="admin-row-actions">
              {moveWithin && (
                <>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => moveGalleryPhoto(photo.url, -1, moveWithin)}
                    disabled={moveIdx <= 0}
                    aria-label="Mover para cima"
                  >
                    <IconArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    className="admin-icon-btn"
                    onClick={() => moveGalleryPhoto(photo.url, 1, moveWithin)}
                    disabled={moveIdx === -1 || moveIdx === moveWithin.length - 1}
                    aria-label="Mover para baixo"
                  >
                    <IconArrowDown size={13} />
                  </button>
                </>
              )}
              {isHomeCover && (
                <span className="admin-badge admin-badge--green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <IconHome size={12} /> Capa da Home
                </span>
              )}
              {isStoreCover && (
                <span className="admin-badge admin-badge--green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <IconStore size={12} /> Capa da loja
                </span>
              )}
              {photo.position !== 'center' && (
                <span className="admin-badge admin-badge--gray">Posição: {positionLabel}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="admin-kebab-btn"
            onClick={() => setMenuOpen(menuOpenHere ? null : photo.url)}
            aria-label="Mais ações da foto"
            aria-expanded={menuOpenHere}
          >
            <IconMoreVertical size={18} />
          </button>

          {menuOpenHere && (
            <>
              <div className="admin-dropdown-backdrop" onClick={() => setMenuOpen(null)} />
              <div className="admin-dropdown" role="menu">
              <div className="admin-dropdown__label">Posição da imagem no recorte</div>
              <div className="admin-segmented" role="group" aria-label="Posição da imagem no recorte" style={{ margin: '0 8px 4px' }}>
                {POSITION_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  const active = photo.position === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`admin-icon-btn${active ? ' admin-icon-btn--active' : ''}`}
                      aria-pressed={active}
                      onClick={() => setPhotoPosition(photo.url, opt.value)}
                      title={`Posição da imagem: ${opt.label}`}
                    >
                      <Icon size={13} /> {opt.label}
                    </button>
                  )
                })}
              </div>

              <div className="admin-dropdown__divider" />

              <button
                type="button"
                className={`admin-dropdown__item${isHomeCover ? ' admin-dropdown__item--active' : ''}`}
                onClick={() => setHomeCover(photo.url)}
              >
                <IconHome size={15} />
                {isHomeCover ? 'Capa da Home' : 'Definir como capa da Home'}
              </button>
              <button
                type="button"
                className={`admin-dropdown__item${isStoreCover ? ' admin-dropdown__item--active' : ''}`}
                onClick={() => setStoreCover(photo.url)}
              >
                <IconStore size={15} />
                {isStoreCover ? 'Remover capa da página de loja' : 'Definir como capa da página de loja'}
              </button>

              <div className="admin-dropdown__divider" />

              <button
                type="button"
                className="admin-dropdown__item admin-dropdown__item--danger"
                onClick={() => { removePhoto(photo.url); setMenuOpen(null) }}
              >
                <IconTrash size={15} /> Remover foto
              </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
    <div className="admin-page-header">
      <h1>{title}</h1>
      <nav className="admin-form-tabs__nav">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            type="button"
            className={`admin-form-tabs__btn${section === s.id ? ' admin-form-tabs__btn--active' : ''}`}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </div>

    <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 'none', gap: 20 }}>
        <div className="admin-form-tabs__content">
      {section === 'geral' && (
      <div className="admin-form-section">
        <div className="admin-form-section__title">Dados gerais</div>
        <div className="admin-form-grid">
          <label className="col-6">
            Nome
            <input type="text" value={data.name} onChange={e => set('name', e.target.value)} required />
          </label>

          <label className="col-6">
            Slug (identificador único, sem espaços)
            <input type="text" value={data.slug} onChange={e => set('slug', e.target.value)} required />
          </label>

          <label className="col-4">
            Região
            <select value={data.region} onChange={e => set('region', e.target.value)}>
              <option value="rio">Rio de Janeiro</option>
              <option value="niteroi">Niterói</option>
            </select>
          </label>

          <label className="col-8">
            Bairro/Cidade (ex: "Centro, Rio de Janeiro | RJ")
            <input type="text" value={data.bairroCity} onChange={e => set('bairroCity', e.target.value)} required />
          </label>

          <label className="col-12">
            Endereço (uma linha por item)
            <textarea value={data.address.join('\n')} onChange={e => setLines('address', e.target.value)} rows={2} />
          </label>

          <label className="col-6">
            Horário de funcionamento (uma linha por item)
            <textarea value={data.hours.join('\n')} onChange={e => setLines('hours', e.target.value)} rows={2} />
          </label>

          <label className="col-6">
            Telefone(s) fixo (uma linha por item)
            <textarea value={data.phones.join('\n')} onChange={e => setLines('phones', e.target.value)} rows={2} />
          </label>

          <label className="col-6">
            WhatsApp (apenas dígitos, com DDI+DDD, ex: 5521999999999)
            <input type="text" value={data.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
          </label>

          <label className="col-6">
            Link do Google Maps
            <input type="text" value={data.mapsUrl} onChange={e => set('mapsUrl', e.target.value)} required />
          </label>

          <label className="col-6">
            Link de delivery (iFood etc.)
            <input type="text" value={data.deliveryUrl} onChange={e => set('deliveryUrl', e.target.value)} />
          </label>

          <label className="col-6">
            Link do cardápio digital
            <input type="text" value={data.menuUrl} onChange={e => set('menuUrl', e.target.value)} />
          </label>
        </div>
      </div>
      )}

      {section === 'contato' && (
      <div className="admin-form-section">
        <div className="admin-form-section__title">Formulário de contato</div>
        <p className="admin-form-section__desc">
          Define para qual e-mail vão os avisos de Fale Conosco, Eventos Corporativos e Trabalhe Conosco quando esta loja é selecionada.
        </p>
        <div className="admin-form-grid">
          <label className="col-6">
            E-mail
            <input type="email" value={data.email} onChange={e => set('email', e.target.value)} required />
          </label>

          <label className="col-12">
            Destinatários extras (uma linha por e-mail)
            <textarea
              value={data.extraRecipients.join('\n')}
              onChange={e => setExtraRecipients(e.target.value)}
              rows={2}
              placeholder="fulano@delirio.com.br"
            />
            <span className="trabalhe-form__file-hint">
              Além do e-mail principal, essas pessoas também recebem os avisos.
            </span>
          </label>
        </div>
      </div>
      )}

      {section === 'galeria' && (
      <div className="admin-form-section">
        <div className="admin-form-section__title">Galeria de fotos</div>
        <div className="admin-form-grid">
          <label className="admin-upload col-12">
            <input
              ref={photosRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotosUpload}
              className="admin-upload__input"
            />
            <span className="admin-upload__icon"><IconUpload size={20} /></span>
            <span className="admin-upload__body">
              <span className="admin-upload__title">Adicionar fotos</span>
              <span className="admin-upload__hint">Selecione uma ou mais imagens (JPG, PNG ou WEBP)</span>
            </span>
          </label>

          <div className="admin-divider col-12" />

          {data.photos.length > 0 ? (
            <div className="col-12" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {(() => {
                const homeCover = data.photos.find(p => p.url === data.image)
                const storeCover = data.storeImage ? data.photos.find(p => p.url === data.storeImage) : undefined
                const gallery = data.photos.filter(p => p.url !== data.image && p.url !== data.storeImage)

                return (
                  <>
                    <div className="admin-gallery-group">
                      <div className="admin-gallery-group__title">Capa da Home</div>
                      {homeCover ? (
                        renderPhotoRow(homeCover)
                      ) : (
                        <p className="admin-empty">Nenhuma capa da Home definida ainda.</p>
                      )}
                    </div>

                    <div className="admin-gallery-group">
                      <div className="admin-gallery-group__title">Capa da página de loja</div>
                      {storeCover ? (
                        renderPhotoRow(storeCover)
                      ) : (
                        <p className="admin-empty">
                          Nenhuma capa de loja definida — a capa da Home é usada no lugar dela. Escolha uma foto na
                          Galeria abaixo para definir uma capa própria.
                        </p>
                      )}
                    </div>

                    <div className="admin-gallery-group">
                      <div className="admin-gallery-group__title">Galeria</div>
                      {gallery.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {gallery.map(photo => renderPhotoRow(photo, gallery))}
                        </div>
                      ) : (
                        <p className="admin-empty">Nenhuma outra foto na galeria.</p>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <p className="admin-empty col-12">Nenhuma foto na galeria ainda. Envie ao menos uma foto e marque como capa.</p>
          )}
        </div>
      </div>
      )}

      {section === 'visibilidade' && (
      <div className="admin-form-section">
        <div className="admin-form-section__title">Visibilidade</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={data.highlight} onChange={e => set('highlight', e.target.checked)} />
            Destacar no modal "veja o cardápio do dia"
          </label>

          <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={data.active} onChange={e => set('active', e.target.checked)} />
            Loja ativa (visível no site)
          </label>
        </div>
      </div>
      )}
        </div>

      {error && <p className="admin-error">{error}</p>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar loja'}
        </button>
        {data.id && (
          <button className="admin-btn admin-btn--danger" type="button" onClick={handleDelete}>
            <IconTrash size={15} />
            Excluir loja
          </button>
        )}
      </div>
    </form>

    {previewUrl && (
      <div className="admin-modal-overlay" onClick={() => setPreviewUrl(null)}>
        <div className="admin-image-preview" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            className="admin-image-preview__close"
            onClick={() => setPreviewUrl(null)}
            aria-label="Fechar"
          >
            ×
          </button>
          <RetryImage src={previewUrl} alt="" />
        </div>
      </div>
    )}
    </div>
  )
}
