'use client'

import { useMemo, useState } from 'react'
import type { OuvidoriaMessage } from '@prisma/client'
import DeleteRowButton from '@/components/admin/DeleteRowButton'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export default function OuvidoriaList({ messages }: { messages: OuvidoriaMessage[] }) {
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [busca, setBusca] = useState('')

  const filtersActive = de !== '' || ate !== '' || busca.trim() !== ''

  const filtered = useMemo(() => {
    const term = busca.trim().toLowerCase()
    const deDate = de ? new Date(`${de}T00:00:00`) : null
    const ateDate = ate ? new Date(`${ate}T23:59:59.999`) : null
    return messages.filter(m => {
      if (deDate && m.createdAt < deDate) return false
      if (ateDate && m.createdAt > ateDate) return false
      if (term && !m.mensagem.toLowerCase().includes(term)) return false
      return true
    })
  }, [messages, de, ate, busca])

  function limparFiltros() {
    setDe('')
    setAte('')
    setBusca('')
  }

  if (messages.length === 0) {
    return <p className="admin-empty">Nenhuma mensagem recebida ainda.</p>
  }

  return (
    <>
      <div className="admin-filter-bar">
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
            placeholder="Buscar na mensagem..."
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
                <div className="admin-entry__meta">Mensagem anônima</div>
                <div className="admin-entry__actions">
                  <span className="admin-entry__date">{formatDate(m.createdAt)}</span>
                  <DeleteRowButton
                    endpoint={`/api/admin/ouvidoria-messages/${m.id}`}
                    confirmMessage="Excluir esta mensagem da ouvidoria?"
                  />
                </div>
              </div>
              <p className="admin-entry__desc">{m.mensagem}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
