'use client'

import { useState } from 'react'

const VAGAS = [
  'Atendente de Caixa',
  'Atendente de Balcão',
  'Auxiliar de Cozinha',
  'Saladeiro',
  'Cozinheiro',
]

interface Props {
  stores: { id: string; name: string }[]
}

export default function TrabalheConoscoClient({ stores }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const formData = new FormData(form)

    if (!formData.get('storeId')) {
      setError('Selecione uma loja')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/trabalhe-conosco', { method: 'POST', body: formData })
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
        Recebemos sua candidatura! A loja escolhida vai entrar em contato em breve.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="trabalhe-form">
      <label>
        Loja de interesse *
        <select name="storeId" required>
          <option value="">Selecione uma loja</option>
          {stores.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </label>

      <label>
        Nome Completo *
        <input type="text" name="nome" required placeholder="Seu nome completo" />
      </label>

      <label>
        E-mail *
        <input type="email" name="email" required placeholder="seu@email.com" />
      </label>

      <label>
        Celular / WhatsApp *
        <input type="tel" name="telefone" required placeholder="(21) 99999-9999" />
      </label>

      <label>
        Vaga *
        <select name="vaga" required>
          <option value="">Selecione uma vaga</option>
          {VAGAS.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>

      <label>
        Envie seu currículo *
        <input type="file" name="curriculo" accept=".pdf,.doc,.docx" required />
        <span className="trabalhe-form__file-hint">PDF, DOC ou DOCX — máx. 10 MB</span>
      </label>

      <label>
        Mensagem
        <textarea name="mensagem" placeholder="Conte um pouco sobre você..." rows={5} />
      </label>

      {error && <p className="eventos-form__error">{error}</p>}

      <button type="submit" className="trabalhe-form__btn" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando...' : 'Enviar candidatura'}
      </button>
    </form>
  )
}
