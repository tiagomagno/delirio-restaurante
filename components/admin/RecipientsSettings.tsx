'use client'

import { useState } from 'react'

export default function RecipientsSettings({
  endpoint,
  title,
  description,
  initial,
}: {
  endpoint: string
  title: string
  description: string
  initial: string
}) {
  const [value, setValue] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setError('')
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      if (!res.ok) {
        const result = await res.json().catch(() => ({}))
        throw new Error(result.error ?? 'Erro ao salvar')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-form-section__title">{title}</div>
      <p className="admin-form-section__desc">{description}</p>
      <div className="admin-form-grid" style={{ marginTop: 16 }}>
        <label className="col-12">
          E-mails (um por linha)
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={5}
            placeholder="fulano@delirio.com.br"
          />
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <button className="admin-btn" type="button" onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
        {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar'}
      </button>
    </div>
  )
}
