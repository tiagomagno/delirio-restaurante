'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowUp, IconArrowDown, IconTrash, IconUpload } from './icons'

export interface Slide {
  id: string
  imageUrl: string
  order: number
  active: boolean
}

export default function BannerManager({ slides }: { slides: Slide[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setError('')
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
        body: JSON.stringify({ imageUrl: uploadData.url }),
      })
      if (!createRes.ok) throw new Error('Erro ao salvar slide')

      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setUploading(false)
    }
  }

  async function toggleActive(slide: Slide) {
    await fetch(`/api/admin/hero-slides/${slide.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !slide.active }),
    })
    router.refresh()
  }

  async function move(slide: Slide, direction: -1 | 1) {
    const index = slides.findIndex(s => s.id === slide.id)
    const swapWith = slides[index + direction]
    if (!swapWith) return
    await Promise.all([
      fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: swapWith.order }),
      }),
      fetch(`/api/admin/hero-slides/${swapWith.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: slide.order }),
      }),
    ])
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
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            <label style={{ flex: 1, minWidth: 240 }}>
              Nova imagem do banner
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" required />
            </label>
            <button className="admin-btn" type="submit" disabled={uploading}>
              <IconUpload size={16} />
              {uploading ? 'Enviando...' : 'Adicionar slide'}
            </button>
          </div>
          {error && <p className="admin-error">{error}</p>}
        </form>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <colgroup>
            <col style={{ width: '32%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '36%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Status</th>
              <th>Ordem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide, i) => (
              <tr key={slide.id}>
                <td><img className="admin-thumb" src={slide.imageUrl} alt="" /></td>
                <td>
                  <span className={`admin-badge admin-badge--${slide.active ? 'green' : 'gray'}`}>
                    {slide.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>{i + 1}</td>
                <td>
                  <div className="admin-row-actions">
                    <button className="admin-icon-btn" onClick={() => move(slide, -1)} disabled={i === 0} aria-label="Mover para cima">
                      <IconArrowUp size={14} />
                    </button>
                    <button className="admin-icon-btn" onClick={() => move(slide, 1)} disabled={i === slides.length - 1} aria-label="Mover para baixo">
                      <IconArrowDown size={14} />
                    </button>
                    <button className="admin-icon-btn" onClick={() => toggleActive(slide)}>
                      {slide.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button className="admin-icon-btn" onClick={() => remove(slide)} aria-label="Excluir">
                      <IconTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr><td colSpan={4}>Nenhum slide cadastrado ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
