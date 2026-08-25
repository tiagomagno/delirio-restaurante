'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StoreActiveSwitch({ id, active }: { id: string; active: boolean }) {
  const router = useRouter()
  const [checked, setChecked] = useState(active)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    const next = !checked
    setChecked(next)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      setChecked(!next)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-switch-field">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={checked ? 'Loja ativa — clique para desativar' : 'Loja inativa — clique para ativar'}
        className={`admin-switch${checked ? ' admin-switch--on' : ''}`}
        onClick={toggle}
        disabled={saving}
      >
        <span className="admin-switch__thumb" />
      </button>
      <span className={`admin-badge admin-badge--${checked ? 'green' : 'gray'}`}>
        {checked ? 'Ativa' : 'Inativa'}
      </span>
    </div>
  )
}
