'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconTrash, IconPlus, IconEye, IconEyeOff } from './icons'

export interface AdminUserRow {
  id: string
  email: string
  createdAt: string
}

function ResetPasswordRow({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Erro ao redefinir senha')
      setDone(true)
      setPassword('')
      setTimeout(() => { setOpen(false); setDone(false) }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button type="button" className="admin-icon-btn" onClick={() => setOpen(true)}>
        Redefinir senha
      </button>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="admin-login-box__password-row">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nova senha"
          minLength={8}
          required
          autoFocus
        />
        <button
          type="button"
          className="admin-login-box__toggle"
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
        </button>
      </div>
      <button className="admin-icon-btn" type="submit" disabled={saving}>
        {done ? 'Senha alterada!' : saving ? 'Salvando...' : 'Salvar'}
      </button>
      <button type="button" className="admin-icon-btn" onClick={() => { setOpen(false); setError('') }}>
        Cancelar
      </button>
      {error && <p className="admin-error" style={{ margin: 0 }}>{error}</p>}
    </form>
  )
}

export default function UserManager({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Erro ao criar usuário')
      setEmail('')
      setPassword('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(user: AdminUserRow) {
    if (!confirm(`Remover o acesso de "${user.email}"? Essa ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const result = await res.json().catch(() => ({}))
      alert(result.error ?? 'Erro ao excluir usuário')
      return
    }
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="admin-panel">
        <form className="admin-form" onSubmit={handleCreate} style={{ maxWidth: 'none' }}>
          <div className="admin-form-grid">
            <label className="col-6">
              E-mail
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label className="col-6">
              Senha (mínimo 8 caracteres)
              <div className="admin-login-box__password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="admin-login-box__toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                </button>
              </div>
            </label>
          </div>
          <button className="admin-btn" type="submit" disabled={creating} style={{ marginTop: 16 }}>
            <IconPlus size={16} />
            {creating ? 'Criando...' : 'Criar usuário'}
          </button>
          {error && <p className="admin-error">{error}</p>}
        </form>
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  {user.email}
                  {user.id === currentUserId && <span className="admin-badge admin-badge--gray" style={{ marginLeft: 8 }}>Você</span>}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div className="admin-row-actions">
                    <ResetPasswordRow userId={user.id} />
                    {user.id !== currentUserId && (
                      <button className="admin-icon-btn" onClick={() => handleDelete(user)} aria-label="Excluir">
                        <IconTrash size={13} />
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={3}>Nenhum usuário cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
