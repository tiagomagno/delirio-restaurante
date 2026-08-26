'use client'

import { useMemo, useState } from 'react'
import type { EventRequest } from '@prisma/client'
import DeleteRowButton from '@/components/admin/DeleteRowButton'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

function formatEventDate(d: Date | null) {
  if (!d) return null
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export default function PedidosList({ requests }: { requests: EventRequest[] }) {
  const [loja, setLoja] = useState('todas')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [busca, setBusca] = useState('')

  const lojas = useMemo(
    () => Array.from(new Set(requests.map(r => r.lojaNome))).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [requests],
  )

  const filtersActive = loja !== 'todas' || de !== '' || ate !== '' || busca.trim() !== ''

  const filtered = useMemo(() => {
    const term = busca.trim().toLowerCase()
    const deDate = de ? new Date(`${de}T00:00:00`) : null
    const ateDate = ate ? new Date(`${ate}T23:59:59.999`) : null
    return requests.filter(r => {
      if (loja !== 'todas' && r.lojaNome !== loja) return false
      if (deDate && r.createdAt < deDate) return false
      if (ateDate && r.createdAt > ateDate) return false
      if (term) {
        const haystack = `${r.nome} ${r.email ?? ''} ${r.descricao ?? ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [requests, loja, de, ate, busca])

  function limparFiltros() {
    setLoja('todas')
    setDe('')
    setAte('')
    setBusca('')
  }

  if (requests.length === 0) {
    return <p className="admin-empty">Nenhum pedido recebido ainda.</p>
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
            placeholder="Nome, e-mail ou descrição..."
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
          {filtered.map(r => (
            <div key={r.id} className="admin-entry">
              <div className="admin-entry__top">
                <div>
                  <div className="admin-entry__name">{r.nome}</div>
                  <div className="admin-entry__meta">
                    {r.lojaNome} · {r.pessoas} pessoas
                    {formatEventDate(r.data) && ` · evento em ${formatEventDate(r.data)}`}
                  </div>
                </div>
                <div className="admin-entry__actions">
                  <span className="admin-entry__date">{formatDate(r.createdAt)}</span>
                  <DeleteRowButton
                    endpoint={`/api/admin/event-requests/${r.id}`}
                    confirmMessage={`Excluir o pedido de "${r.nome}"?`}
                  />
                </div>
              </div>
              <div className="admin-entry__contacts">
                {r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}
                {r.celular && <a href={`tel:${r.celular.replace(/\D/g, '')}`}>{r.celular}</a>}
                {r.telefone && <a href={`tel:${r.telefone.replace(/\D/g, '')}`}>{r.telefone}</a>}
              </div>
              {r.descricao && <p className="admin-entry__desc">{r.descricao}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
