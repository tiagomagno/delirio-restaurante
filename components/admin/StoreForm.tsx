'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconTrash, IconArrowUp, IconArrowDown, IconHome, IconStore } from './icons'
import type { StorePhoto } from '@/lib/data/stores'

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
  return { ...initial, photos: [{ url: initial.image, alt: initial.imageAlt }, ...initial.photos] }
}

export default function StoreForm({ initial }: { initial?: StoreFormData }) {
  const router = useRouter()
  const [data, setData] = useState<StoreFormData>(() => normalizeInitial(initial ?? EMPTY))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [section, setSection] = useState<Section>('geral')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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
      const newPhotos = urls.map(url => ({ url, alt: '' }))
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

  function movePhoto(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= data.photos.length) return
    const photos = [...data.photos]
    ;[photos[index], photos[target]] = [photos[target], photos[index]]
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

  return (
    <div className="admin-panel">
    <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 'none', gap: 20 }}>
      <div className="admin-form-tabs">
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
        <p className="admin-form-section__desc">
          Marque uma foto como capa da Home — ela aparece no carrossel de lojas da página inicial. Marque
          (a mesma ou outra) como capa da página de loja — ela é a primeira exibida no carrossel da loja em
          "Lojas". A ordem das fotos abaixo define a ordem de exibição das demais.
        </p>
        <div className="admin-form-grid">
          <label className="col-12">
            Adicionar fotos
            <input ref={photosRef} type="file" accept="image/*" multiple onChange={handlePhotosUpload} />
          </label>

          {data.photos.length > 0 ? (
            <div className="col-12" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.photos.map((photo, i) => {
                const isHomeCover = photo.url === data.image
                const isStoreCover = photo.url === data.storeImage
                return (
                  <div key={photo.url} className="admin-entry">
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <img
                        className="admin-thumb admin-thumb--clickable"
                        src={photo.url}
                        alt=""
                        style={{ width: 120, height: 80, flexShrink: 0 }}
                        onClick={() => setPreviewUrl(photo.url)}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                          type="text"
                          value={photo.alt}
                          onChange={e => setPhotoAlt(photo.url, e.target.value)}
                          placeholder="Texto alternativo da foto"
                        />
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-icon-btn"
                            onClick={() => movePhoto(i, -1)}
                            disabled={i === 0}
                            aria-label="Mover para cima"
                          >
                            <IconArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn"
                            onClick={() => movePhoto(i, 1)}
                            disabled={i === data.photos.length - 1}
                            aria-label="Mover para baixo"
                          >
                            <IconArrowDown size={13} />
                          </button>
                          {isHomeCover ? (
                            <span className="admin-badge admin-badge--green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <IconHome size={12} /> Capa da Home
                            </span>
                          ) : (
                            <button type="button" className="admin-icon-btn" onClick={() => setHomeCover(photo.url)}>
                              <IconHome size={13} /> Definir como capa da Home
                            </button>
                          )}
                          <button
                            type="button"
                            className={isStoreCover ? 'admin-badge admin-badge--green' : 'admin-icon-btn'}
                            style={isStoreCover ? { display: 'inline-flex', alignItems: 'center', gap: 4 } : undefined}
                            onClick={() => setStoreCover(photo.url)}
                          >
                            <IconStore size={isStoreCover ? 12 : 13} />
                            {isStoreCover ? 'Capa da página de loja' : 'Definir como capa da página de loja'}
                          </button>
                          <button type="button" className="admin-icon-btn" onClick={() => removePhoto(photo.url)}>
                            <IconTrash size={13} /> Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
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
          <img src={previewUrl} alt="" />
        </div>
      </div>
    )}
    </div>
  )
}
