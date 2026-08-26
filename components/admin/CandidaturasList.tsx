'use client'

import { useMemo, useState } from 'react'
import type { JobApplication } from '@prisma/client'
import DeleteRowButton from '@/components/admin/DeleteRowButton'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export default function CandidaturasList({ applications }: { applications: JobApplication[] }) {
  const [loja, setLoja] = useState('todas')
  const [vaga, setVaga] = useState('todas')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [busca, setBusca] = useState('')

  const lojas = useMemo(
    () => Array.from(new Set(applications.map(a => a.lojaNome))).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [applications],
  )

  const vagas = useMemo(
    () => Array.from(new Set(applications.map(a => a.vaga))).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [applications],
  )

  const filtersActive = loja !== 'todas' || vaga !== 'todas' || de !== '' || ate !== '' || busca.trim() !== ''

  const filtered = useMemo(() => {
    const term = busca.trim().toLowerCase()
    const deDate = de ? new Date(`${de}T00:00:00`) : null
    const ateDate = ate ? new Date(`${ate}T23:59:59.999`) : null
    return applications.filter(a => {
      if (loja !== 'todas' && a.lojaNome !== loja) return false
      if (vaga !== 'todas' && a.vaga !== vaga) return false
      if (deDate && a.createdAt < deDate) return false
      if (ateDate && a.createdAt > ateDate) return false
      if (term) {
        const haystack = `${a.nome} ${a.email} ${a.mensagem ?? ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [applications, loja, vaga, de, ate, busca])

  function limparFiltros() {
    setLoja('todas')
    setVaga('todas')
    setDe('')
    setAte('')
    setBusca('')
  }

  if (applications.length === 0) {
    return <p className="admin-empty">Nenhuma candidatura recebida ainda.</p>
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

        <label className="admin-filter-bar__field">
          Vaga
          <select value={vaga} onChange={e => setVaga(e.target.value)}>
            <option value="todas">Todas</option>
            {vagas.map(v => (
              <option key={v} value={v}>{v}</option>
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
          {filtered.map(a => (
            <div key={a.id} className="admin-entry">
              <div className="admin-entry__top">
                <div>
                  <div className="admin-entry__name">{a.nome}</div>
                  <div className="admin-entry__meta">{a.lojaNome} · {a.vaga}</div>
                </div>
                <div className="admin-entry__actions">
                  <span className="admin-entry__date">{formatDate(a.createdAt)}</span>
                  <DeleteRowButton
                    endpoint={`/api/admin/job-applications/${a.id}`}
                    confirmMessage={`Excluir a candidatura de "${a.nome}"?`}
                  />
                </div>
              </div>
              <div className="admin-entry__contacts">
                <a href={`mailto:${a.email}`}>{a.email}</a>
                <a href={`tel:${a.telefone.replace(/\D/g, '')}`}>{a.telefone}</a>
                <a href={a.curriculoUrl} target="_blank" rel="noopener">{a.curriculoNome}</a>
              </div>
              {a.mensagem && <p className="admin-entry__desc">{a.mensagem}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
