'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconTrash } from './icons'

export interface StoreFormData {
  id?: string
  slug: string
  name: string
  address: string[]
  bairroCity: string
  region: string
  image: string
  photos: string[]
  mapsUrl: string
  deliveryUrl: string
  menuUrl: string
  hours: string[]
  phones: string[]
  whatsapp: string
  email: string
  highlight: boolean
  active: boolean
}

const EMPTY: StoreFormData = {
  slug: '', name: '', address: [''], bairroCity: '', region: 'rio', image: '', photos: [],
  mapsUrl: '', deliveryUrl: '', menuUrl: '', hours: [''], phones: [''], whatsapp: '', email: '',
  highlight: false, active: true,
}

async function uploadImage(file: File, folder: string) {
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Erro no upload')
  return data.url as string
}

export default function StoreForm({ initial }: { initial?: StoreFormData }) {
  const router = useRouter()
  const [data, setData] = useState<StoreFormData>(initial ?? EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const imageRef = useRef<HTMLInputElement>(null)
  const photosRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof StoreFormData>(key: K, value: StoreFormData[K]) {
    setData(d => ({ ...d, [key]: value }))
  }

  function setLines(key: 'address' | 'hours' | 'phones', text: string) {
    set(key, text.split('\n'))
  }

  async function handleImageUpload() {
    const file = imageRef.current?.files?.[0]
    if (!file) return
    setError('')
    try {
      const url = await uploadImage(file, 'lojas')
      set('image', url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload')
    }
  }

  async function handlePhotosUpload() {
    const files = photosRef.current?.files
    if (!files || files.length === 0) return
    setError('')
    try {
      const urls = await Promise.all(Array.from(files).map(f => uploadImage(f, 'lojas')))
      set('photos', [...data.photos, ...urls])
      if (photosRef.current) photosRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload')
    }
  }

  function removePhoto(url: string) {
    set('photos', data.photos.filter(p => p !== url))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      ...data,
      address: data.address.map(l => l.trim()).filter(Boolean),
      hours: data.hours.map(l => l.trim()).filter(Boolean),
      phones: data.phones.map(l => l.trim()).filter(Boolean),
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
    <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 'none' }}>
      <label>
        Nome
        <input type="text" value={data.name} onChange={e => set('name', e.target.value)} required />
      </label>

      <label>
        Slug (identificador único, sem espaços)
        <input type="text" value={data.slug} onChange={e => set('slug', e.target.value)} required />
      </label>

      <label>
        Região
        <select value={data.region} onChange={e => set('region', e.target.value)}>
          <option value="rio">Rio de Janeiro</option>
          <option value="niteroi">Niterói</option>
        </select>
      </label>

      <label>
        Endereço (uma linha por item)
        <textarea value={data.address.join('\n')} onChange={e => setLines('address', e.target.value)} rows={2} />
      </label>

      <label>
        Bairro/Cidade (ex: "Centro, Rio de Janeiro | RJ")
        <input type="text" value={data.bairroCity} onChange={e => set('bairroCity', e.target.value)} required />
      </label>

      <label>
        Horário de funcionamento (uma linha por item)
        <textarea value={data.hours.join('\n')} onChange={e => setLines('hours', e.target.value)} rows={2} />
      </label>

      <label>
        Telefone(s) fixo (uma linha por item)
        <textarea value={data.phones.join('\n')} onChange={e => setLines('phones', e.target.value)} rows={2} />
      </label>

      <label>
        WhatsApp (apenas dígitos, com DDI+DDD, ex: 5521999999999)
        <input type="text" value={data.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
      </label>

      <label>
        E-mail
        <input type="email" value={data.email} onChange={e => set('email', e.target.value)} required />
      </label>

      <label>
        Link do Google Maps
        <input type="text" value={data.mapsUrl} onChange={e => set('mapsUrl', e.target.value)} required />
      </label>

      <label>
        Link de delivery (iFood etc.)
        <input type="text" value={data.deliveryUrl} onChange={e => set('deliveryUrl', e.target.value)} />
      </label>

      <label>
        Link do cardápio digital
        <input type="text" value={data.menuUrl} onChange={e => set('menuUrl', e.target.value)} />
      </label>

      <label>
        Foto principal (carrossel da home)
        <input ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
      {data.image && <img className="admin-thumb" src={data.image} alt="" style={{ width: 160, height: 100 }} />}

      <label>
        Galeria de fotos (página de lojas)
        <input ref={photosRef} type="file" accept="image/*" multiple onChange={handlePhotosUpload} />
      </label>
      {data.photos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.photos.map(url => (
            <div key={url} style={{ position: 'relative' }}>
              <img className="admin-thumb" src={url} alt="" />
              <button type="button" className="admin-icon-btn" onClick={() => removePhoto(url)} style={{ marginTop: 4 }}>
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={data.highlight} onChange={e => set('highlight', e.target.checked)} />
        Destacar no modal "veja o cardápio do dia"
      </label>

      <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={data.active} onChange={e => set('active', e.target.checked)} />
        Loja ativa (visível no site)
      </label>

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
    </div>
  )
}
