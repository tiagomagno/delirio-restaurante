'use client'

import { useState } from 'react'

export default function OuvidoriaClient() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    try {
      const res = await fetch('/api/ouvidoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: data.get('mensagem') }),
      })
      if (!res.ok) {
        const result = await res.json().catch(() => ({}))
        throw new Error(result.error ?? 'Erro ao enviar')
      }
      setStatus('sent')
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p className="eventos-form__success">Sua mensagem foi enviada. Obrigado por contribuir.</p>
  }

  return (
    <form className="ouvidoria-form" onSubmit={handleSubmit}>
      <label className="ouvidoria-form__label">
        Escreva sua mensagem *
        <textarea
          name="mensagem"
          required
          className="ouvidoria-form__textarea"
          placeholder="Digite sua mensagem aqui..."
          rows={8}
        />
      </label>

      {error && <p className="eventos-form__error">{error}</p>}

      <button type="submit" className="ouvidoria-form__btn" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}
