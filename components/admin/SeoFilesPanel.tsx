'use client'

import { useState } from 'react'
import { IconSearch } from './icons'

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

interface RobotsData {
  userAgent: string
  allow: string[]
  disallow: string[]
  sitemap: string
}

function parseSitemap(xml: string): SitemapEntry[] {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  return [...doc.querySelectorAll('url')].map(url => ({
    loc: url.querySelector('loc')?.textContent ?? '',
    lastmod: url.querySelector('lastmod')?.textContent ?? undefined,
    changefreq: url.querySelector('changefreq')?.textContent ?? undefined,
    priority: url.querySelector('priority')?.textContent ?? undefined,
  }))
}

function parseRobots(text: string): RobotsData {
  const data: RobotsData = { userAgent: '*', allow: [], disallow: [], sitemap: '' }
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    const sep = line.indexOf(':')
    if (sep === -1) continue
    const key = line.slice(0, sep).trim().toLowerCase()
    const value = line.slice(sep + 1).trim()
    if (key === 'user-agent') data.userAgent = value
    else if (key === 'allow') data.allow.push(value)
    else if (key === 'disallow') data.disallow.push(value)
    else if (key === 'sitemap') data.sitemap = value
  }
  return data
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

type ModalKind = 'sitemap' | 'robots' | null

export default function SeoFilesPanel() {
  const [open, setOpen] = useState<ModalKind>(null)
  const [loading, setLoading] = useState(false)
  const [rawText, setRawText] = useState('')
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([])
  const [robotsData, setRobotsData] = useState<RobotsData | null>(null)

  async function openModal(kind: 'sitemap' | 'robots') {
    setOpen(kind)
    setLoading(true)
    try {
      const res = await fetch(kind === 'sitemap' ? '/sitemap.xml' : '/robots.txt')
      const text = await res.text()
      setRawText(text)
      if (kind === 'sitemap') setSitemapEntries(parseSitemap(text))
      else setRobotsData(parseRobots(text))
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setOpen(null)
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 20 }}>
        <button type="button" className="admin-link-btn" onClick={() => openModal('sitemap')}>
          <IconSearch size={15} /> Ver sitemap.xml
        </button>
        <button type="button" className="admin-link-btn" onClick={() => openModal('robots')}>
          <IconSearch size={15} /> Ver robots.txt
        </button>
      </div>

      {open && (
        <div className="admin-modal-overlay" onClick={close}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="admin-modal__header">
              <h2>{open === 'sitemap' ? 'Sitemap.xml' : 'Robots.txt'}</h2>
              <button type="button" className="admin-modal__close" onClick={close} aria-label="Fechar">×</button>
            </div>

            <div className="admin-modal__body">
              {open === 'sitemap' && (
                <>
                  <p className="admin-modal__explain">
                    O sitemap é a lista de páginas do site que a gente entrega direto para o Google e outros
                    buscadores, para ajudar a encontrar e indexar tudo mais rápido — em vez de depender só dos links
                    internos. É gerado automaticamente a partir das páginas do site: <code>lastmod</code> mostra a
                    última vez que o conteúdo daquela página foi editado no admin, o que sinaliza pro Google que vale
                    a pena visitar de novo.
                  </p>
                  {loading ? (
                    <p className="admin-modal__loading">Carregando…</p>
                  ) : (
                    <div className="admin-modal__table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>URL</th>
                            <th>Última alteração</th>
                            <th>Frequência</th>
                            <th>Prioridade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sitemapEntries.map(e => (
                            <tr key={e.loc}>
                              <td>{e.loc.replace('https://delirio.com.br', '') || '/'}</td>
                              <td>{formatDate(e.lastmod)}</td>
                              <td>{e.changefreq}</td>
                              <td>{e.priority}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {open === 'robots' && (
                <>
                  <p className="admin-modal__explain">
                    O robots.txt diz aos buscadores o que eles podem ou não visitar. Aqui, tudo é liberado por padrão
                    — exceto o painel administrativo (<code>/admin</code>) e as rotas internas de API
                    (<code>/api</code>), que não têm por que aparecer em busca e ainda exporiam estrutura interna do
                    site.
                  </p>
                  {loading ? (
                    <p className="admin-modal__loading">Carregando…</p>
                  ) : robotsData && (
                    <div className="admin-modal__table-wrap">
                      <table className="admin-table">
                        <tbody>
                          <tr>
                            <td style={{ width: 160 }}>Vale para</td>
                            <td>{robotsData.userAgent === '*' ? 'Todos os buscadores' : robotsData.userAgent}</td>
                          </tr>
                          <tr>
                            <td>Liberado</td>
                            <td>
                              {robotsData.allow.map(a => (
                                <span key={a} className="admin-badge admin-badge--green" style={{ marginRight: 6 }}>{a}</span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <td>Bloqueado</td>
                            <td>
                              {robotsData.disallow.map(d => (
                                <span key={d} className="admin-badge admin-badge--amber" style={{ marginRight: 6 }}>{d}</span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <td>Sitemap</td>
                            <td style={{ wordBreak: 'break-all' }}>{robotsData.sitemap}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              <details className="admin-modal__raw-details">
                <summary>Ver arquivo bruto</summary>
                <pre className="admin-modal__raw">{rawText}</pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
