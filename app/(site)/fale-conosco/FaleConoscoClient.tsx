'use client'

import { useState } from 'react'

interface Props {
  stores: { name: string; email: string }[]
}

export default function FaleConoscoClient({ stores }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)
    const lojaEmail = String(data.get('loja') || '')
    const loja = stores.find(s => s.email === lojaEmail)
    if (!loja) {
      setError('Selecione uma loja')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/fale-conosco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lojaEmail: loja.email,
          lojaNome: loja.name,
          nome: data.get('nome'),
          email: data.get('email'),
          celular: data.get('celular'),
          mensagem: data.get('mensagem'),
        }),
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
    return (
      <p className="eventos-form__success">
        Recebemos sua mensagem! A loja escolhida vai entrar em contato em breve.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Escolha uma loja *
        <select name="loja" required>
          <option value="">Selecione uma loja</option>
          {stores.map(l => (
            <option key={l.email} value={l.email}>{l.name}</option>
          ))}
        </select>
      </label>

      <label>
        Nome completo *
        <input type="text" name="nome" required placeholder="Seu nome completo" />
      </label>

      <label>
        E-mail *
        <input type="email" name="email" required placeholder="seu@email.com" />
      </label>

      <label>
        Celular *
        <input type="tel" name="celular" required placeholder="(21) 99999-9999" />
      </label>

      <label>
        Mensagem *
        <textarea name="mensagem" required placeholder="Escreva sua mensagem aqui..." />
      </label>

      {error && <p className="eventos-form__error">{error}</p>}

      <button type="submit" className="fale-form__btn" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}
