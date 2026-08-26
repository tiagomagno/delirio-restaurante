'use client'

import { useMemo, useState } from 'react'
import type { ContactMessage } from '@prisma/client'
import DeleteRowButton from '@/components/admin/DeleteRowButton'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export default function ContatosList({ messages }: { messages: ContactMessage[] }) {
  const [loja, setLoja] = useState('todas')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [busca, setBusca] = useState('')

  const lojas = useMemo(
    () => Array.from(new Set(messages.map(m => m.lojaNome))).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [messages],
  )

  const filtersActive = loja !== 'todas' || de !== '' || ate !== '' || busca.trim() !== ''

  const filtered = useMemo(() => {
    const term = busca.trim().toLowerCase()
    const deDate = de ? new Date(`${de}T00:00:00`) : null
    const ateDate = ate ? new Date(`${ate}T23:59:59.999`) : null
    return messages.filter(m => {
      if (loja !== 'todas' && m.lojaNome !== loja) return false
      if (deDate && m.createdAt < deDate) return false
      if (ateDate && m.createdAt > ateDate) return false
      if (term) {
        const haystack = `${m.nome} ${m.email} ${m.mensagem}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [messages, loja, de, ate, busca])

  function limparFiltros() {
    setLoja('todas')
    setDe('')
    setAte('')
    setBusca('')
  }

  if (messages.length === 0) {
    return <p className="admin-empty">Nenhum contato recebido ainda.</p>
  }

  return (
    <>
      <div className="admin-filter-bar">
        <label className="admin-filter-bar__field">
          Loja
          <select value={loja} onChange={e => setLoja(e.target.value)}>
            <option value="todas">Todas</option>
            {lojas.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>

        <div className="admin-filter-bar__dates">
          <label className="admin-filter-bar__field">
            De
            <input type="date" value={de} onChange={e => setDe(e.target.value)} />
          </label>
          <label className="admin-filter-bar__field">
            Até
            <input type="date" value={ate} onChange={e => setAte(e.target.value)} />
          </label>
        </div>

        <label className="admin-filter-bar__field admin-filter-bar__search">
          Busca
          <input
            type="search"
            placeholder="Nome, e-mail ou mensagem..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </label>

        {filtersActive && (
          <button type="button" className="admin-filter-bar__clear" onClick={limparFiltros}>
            Limpar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="admin-empty">Nenhum resultado para os filtros selecionados.</p>
      ) : (
        <div className="admin-entry-list">
          {filtered.map(m => (
            <div key={m.id} className="admin-entry">
              <div className="admin-entry__top">
                <div>
                  <div className="admin-entry__name">{m.nome}</div>
                  <div className="admin-entry__meta">{m.lojaNome}</div>
                </div>
                <div className="admin-entry__actions">
                  <span className="admin-entry__date">{formatDate(m.createdAt)}</span>
                  <DeleteRowButton
                    endpoint={`/api/admin/contact-messages/${m.id}`}
                    confirmMessage={`Excluir a mensagem de "${m.nome}"?`}
                  />
                </div>
              </div>
              <div className="admin-entry__contacts">
                <a href={`mailto:${m.email}`}>{m.email}</a>
                {m.celular && <a href={`tel:${m.celular.replace(/\D/g, '')}`}>{m.celular}</a>}
              </div>
              <p className="admin-entry__desc">{m.mensagem}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
