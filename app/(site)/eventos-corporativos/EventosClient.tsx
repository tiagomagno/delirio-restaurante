'use client'

import { useMemo, useState } from 'react'
import Multiline from '@/components/Multiline'

interface Props {
  stores: { name: string; email: string }[]
  title: string
  description: string
}

export default function EventosClient({ stores, title, description }: Props) {
  /* Data mínima = hoje + 2 dias */
  const minDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0] // YYYY-MM-DD
  }, [])

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)
    const lojaEmail = String(data.get('loja-pedido') || '')
    const loja = stores.find(s => s.email === lojaEmail)
    if (!loja) {
      setError('Selecione uma loja')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/eventos-corporativos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lojaEmail: loja.email,
          lojaNome: loja.name,
          nome: data.get('nome-pedido'),
          pessoas: data.get('qtd-pessoas'),
          data: data.get('data-pedido') || null,
          telefone: data.get('telefone') || null,
          celular: data.get('celular') || null,
          email: data.get('email') || null,
          descricao: data.get('descricao') || null,
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

  return (
    <div className="eventos-layout">

      {/* ── Formulário ── */}
      <div className="eventos-layout__form">
        <div className="eventos-layout__form-inner">
        <h2 className="eventos-form__title">{title}</h2>
        <p className="eventos-form__desc">
          <Multiline text={description} />
        </p>

        {status === 'sent' ? (
          <p className="eventos-form__success">
            Recebemos seu pedido! A loja escolhida vai entrar em contato em breve.
          </p>
        ) : (
        <form className="eventos-form" onSubmit={handleSubmit}>
          <label>
            Escolha a loja para fazer o pedido *
            <select name="loja-pedido" required>
              <option value="">Selecione uma loja</option>
              {stores.map(l => (
                <option key={l.email} value={l.email}>{l.name}</option>
              ))}
            </select>
          </label>

          <label>
            O pedido será para quantas pessoas? *
            <input
              type="number"
              name="qtd-pessoas"
              required
              min={1}
              placeholder="Ex: 50"
            />
          </label>

          <label>
            Para quando você quer fazer o seu pedido?
            <input
              type="date"
              name="data-pedido"
              min={minDate}
            />
          </label>

          <label>
            Nos conte um pouco mais sobre seu evento! Alguma restrição que deveríamos saber?
            <textarea
              name="descricao"
              rows={4}
              placeholder="Descreva seu evento, restrições alimentares, preferências..."
            />
          </label>

          <label>
            Nome completo *
            <input type="text" name="nome-pedido" required placeholder="Seu nome completo" />
          </label>

          <div className="eventos-form__row">
            <label>
              Telefone fixo
              <input type="tel" name="telefone" placeholder="(21) 2222-2222" />
            </label>
            <label>
              Celular / WhatsApp
              <input type="tel" name="celular" placeholder="(21) 99999-9999" />
            </label>
          </div>

          <label>
            E-mail para contato
            <input type="email" name="email" placeholder="seu@email.com" />
          </label>

          {error && <p className="eventos-form__error">{error}</p>}

          <button type="submit" className="eventos-form__btn" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando...' : 'Fazer Cotação'}
          </button>
        </form>
        )}
        </div>
      </div>

      {/* ── Imagem lateral ── */}
      <div className="eventos-layout__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wp-content/uploads/2023/06/Atheta-BAIXA.jpg"
          alt="Evento Delírio Tropical"
          loading="lazy"
        />
      </div>

    </div>
  )
}
