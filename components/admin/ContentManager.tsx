'use client'

import { useMemo, useState } from 'react'
import { IconCheck, IconUpload } from './icons'
import Switch from './Switch'
import { checkSeoField, DESCRIPTION_LIMIT, TITLE_LIMIT } from '@/lib/seo/fieldCheck'

export interface ContentItem {
  id: string
  page: string
  key: string
  label: string
  value: string
}

const PAGE_LABELS: Record<string, string> = {
  global: 'Global',
  home: 'Home',
  'sobre-nos': 'Sobre Nós',
  lojas: 'Lojas',
  encomendas: 'Encomendas',
  'trabalhe-conosco': 'Trabalhe com a Gente',
  'eventos-corporativos': 'Eventos Corporativos',
  'fale-conosco': 'Fale Conosco',
  ouvidoria: 'Ouvidoria',
  'uso-e-privacidade': 'Uso e Privacidade',
}

const PAGE_ORDER = [
  'home', 'sobre-nos', 'lojas', 'encomendas', 'trabalhe-conosco',
  'eventos-corporativos', 'fale-conosco', 'ouvidoria', 'uso-e-privacidade', 'global',
]

type Group = 'secao' | 'texto' | 'botao' | 'links' | 'seo'

const GROUP_LABELS: Record<Group, string> = {
  secao: 'Seção 40 anos (documentário)',
  texto: 'Textos',
  botao: 'Botões',
  links: 'Links',
  seo: 'SEO',
}

const GROUP_ORDER: Group[] = ['secao', 'texto', 'botao', 'links', 'seo']

// Ordem dos campos da seção "40 anos" no painel (o resto cai no fim).
const DOC_ORDER = ['doc.enabled', 'doc.image', 'doc.video_url', 'doc.full_url', 'doc.cta', 'doc.title']
const DOC_IMAGE_DEFAULT = '/wp-content/uploads/2023/05/delirio-40-anos-documentario.webp'

const DOC_HELP: Record<string, string> = {
  'doc.video_url': 'Trailer que toca dentro do site. Melhor opção: enviar o arquivo de vídeo (MP4) pelo botão abaixo — toca limpo, em 16:9, sozinho e sem som, em loop. Também aceita link do YouTube ou de post do Instagram (o Instagram mostra a interface dele).',
  'doc.full_url': 'Link do vídeo completo (ex: a live). O botão abre em nova aba. Deixe em branco para esconder o botão.',
  'doc.cta': 'Texto do botão abaixo do vídeo.',
  'doc.title': 'Nome da seção para leitores de tela e acessibilidade (não aparece na tela).',
}

function groupOf(item: ContentItem): Group {
  if (item.page === 'sobre-nos' && item.key.startsWith('doc.')) return 'secao'
  if (item.key.startsWith('meta.') || item.key.startsWith('og.')) return 'seo'
  if (item.key.startsWith('social.') || item.key.startsWith('header.') || item.key.startsWith('footer.')) return 'links'
  if (item.page === 'global') return 'seo'
  if (item.key.endsWith('_url')) return 'links'
  if (item.key.endsWith('.cta')) return 'botao'
  return 'texto'
}

const CHAR_LIMITS: Record<string, number> = {
  'meta.title': TITLE_LIMIT,
  'og.title': TITLE_LIMIT,
  'meta.description': DESCRIPTION_LIMIT,
  'og.description': DESCRIPTION_LIMIT,
}

const SEO_HELP: Record<string, string> = {
  'meta.canonical': 'Deixe em branco para usar a URL padrão da página. Só preencha para apontar para outra URL.',
  'meta.robots': 'Ex: "index,follow" (padrão), "noindex,follow" ou "noindex,nofollow" para tirar a página de busca.',
  'og.image': 'Caminho ou URL da imagem usada ao compartilhar esta página (WhatsApp, Facebook, etc). Deixe em branco para usar a imagem padrão do site.',
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ContentManager({ items }: { items: ContentItem[] }) {
  const byPage = useMemo(() => {
    return items.reduce<Record<string, ContentItem[]>>((acc, item) => {
      ;(acc[item.page] ??= []).push(item)
      return acc
    }, {})
  }, [items])

  const pages = useMemo(() => {
    const present = Object.keys(byPage)
    return PAGE_ORDER.filter(p => present.includes(p)).concat(present.filter(p => !PAGE_ORDER.includes(p)))
  }, [byPage])

  const [active, setActive] = useState(pages[0])
  const activePage = pages.includes(active) ? active : pages[0]
  const activeItems = byPage[activePage] ?? []

  const groupedActiveItems = useMemo(() => {
    const groups: Record<Group, ContentItem[]> = { secao: [], texto: [], botao: [], links: [], seo: [] }
    for (const item of activeItems) groups[groupOf(item)].push(item)
    groups.secao.sort((a, b) => {
      const ia = DOC_ORDER.indexOf(a.key)
      const ib = DOC_ORDER.indexOf(b.key)
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
    })
    return groups
  }, [activeItems])

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map(i => [i.id, i.value])),
  )

  // valor atual (ainda não salvo) de cada campo da página ativa, por key —
  // usado pra resolver fallback ao vivo (ex: og.title vazio mostrando o
  // meta.title que está sendo digitado no momento)
  const activeValuesByKey = useMemo(
    () => Object.fromEntries(activeItems.map(i => [i.key, values[i.id] ?? ''])),
    [activeItems, values],
  )
  const [saved, setSaved] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map(i => [i.id, i.value])),
  )
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState('')

  const dirtyIds = activeItems.filter(i => values[i.id] !== saved[i.id]).map(i => i.id)
  const dirtyCount = dirtyIds.length

  function setValue(id: string, value: string) {
    setValues(v => ({ ...v, [id]: value }))
    if (saveState !== 'idle') setSaveState('idle')
  }

  async function saveAll() {
    if (dirtyCount === 0) return
    setSaveState('saving')
    try {
      const results = await Promise.all(
        dirtyIds.map(id =>
          fetch(`/api/admin/content/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: values[id] }),
          }),
        ),
      )
      const failed = results.find(r => !r.ok)
      if (failed) {
        const data = await failed.json().catch(() => null)
        throw new Error(data?.error ?? 'save failed')
      }
      setSaveError('')
      setSaved(s => ({ ...s, ...Object.fromEntries(dirtyIds.map(id => [id, values[id]])) }))
      setSaveState('saved')
      setTimeout(() => setSaveState(s => (s === 'saved' ? 'idle' : s)), 2500)
    } catch (err) {
      setSaveError(err instanceof Error && err.message !== 'save failed' ? err.message : '')
      setSaveState('error')
    }
  }

  async function uploadVideo(id: string, file: File) {
    setUploadError('')
    setUploadingId(id)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'sobre')
      const res = await fetch('/api/admin/upload-video', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro no upload')
      setValue(id, data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploadingId(null)
    }
  }

  async function uploadImage(id: string, file: File) {
    setUploadError('')
    setUploadingId(id)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'sobre')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro no upload')
      setValue(id, data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploadingId(null)
    }
  }

  return (
    <div>
      <div className="admin-tabs">
        {pages.map(page => (
          <button
            key={page}
            className={`admin-tab${page === activePage ? ' admin-tab--active' : ''}`}
            onClick={() => setActive(page)}
          >
            {PAGE_LABELS[page] ?? page}
            <span style={{ opacity: 0.7, fontWeight: 600 }}> · {byPage[page]?.length ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-paginas-toolbar">
          <p className="admin-paginas-toolbar__status">
            {saveState === 'error'
              ? `Erro ao salvar — ${saveError || 'tente novamente.'}`
              : dirtyCount > 0
                ? `${dirtyCount} ${dirtyCount === 1 ? 'alteração não salva' : 'alterações não salvas'}`
                : 'Tudo salvo'}
          </p>
          <button
            type="button"
            className="admin-btn"
            onClick={saveAll}
            disabled={dirtyCount === 0 || saveState === 'saving'}
          >
            {saveState === 'saving' ? 'Salvando...' : saveState === 'saved' ? <><IconCheck size={15} /> Salvo</> : 'Salvar alterações'}
          </button>
        </div>

        <div className="admin-content-columns">
          {GROUP_ORDER.filter(g => groupedActiveItems[g].length > 0).map(group => (
            <div key={group} className="admin-content-column">
              <h2 className="admin-content-column__title">{GROUP_LABELS[group]}</h2>
              {groupedActiveItems[group].map(item => {
                const limit = CHAR_LIMITS[item.key]
                const help = SEO_HELP[item.key]
                const length = values[item.id]?.length ?? 0

                if (item.key === 'doc.enabled') {
                  return (
                    <div key={item.id} className="admin-content-field">
                      <Switch
                        checked={values[item.id] === 'true'}
                        onChange={on => setValue(item.id, on ? 'true' : 'false')}
                        label="Exibir esta seção no site"
                      />
                      <p className="admin-field-help">Desligada, a seção some de Sobre Nós (os dados abaixo ficam guardados).</p>
                    </div>
                  )
                }

                if (item.key === 'doc.video_url') {
                  const isFile = values[item.id].startsWith('/uploads/')
                  return (
                    <div key={item.id} className="admin-content-field">
                      <label>Trailer (vídeo ou link)</label>
                      <p className="admin-field-help">{DOC_HELP[item.key]}</p>
                      <textarea
                        value={values[item.id]}
                        onChange={e => setValue(item.id, e.target.value)}
                        rows={2}
                        placeholder="Cole um link ou envie o arquivo MP4"
                      />
                      {isFile && <span className="admin-badge admin-badge--green" style={{ width: 'fit-content' }}>Vídeo enviado</span>}
                      <div className="admin-doc-actions">
                        <label className="admin-btn admin-btn--secondary admin-doc-upload">
                          <IconUpload size={15} /> {uploadingId === item.id ? 'Enviando...' : 'Enviar vídeo (MP4)'}
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            hidden
                            disabled={uploadingId === item.id}
                            onChange={e => {
                              const f = e.target.files?.[0]
                              if (f) uploadVideo(item.id, f)
                              e.target.value = ''
                            }}
                          />
                        </label>
                        {values[item.id] && (
                          <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setValue(item.id, '')}>
                            Remover
                          </button>
                        )}
                      </div>
                      {uploadError && <p className="admin-field-help" style={{ color: 'var(--admin-red)' }}>{uploadError}</p>}
                    </div>
                  )
                }

                if (item.key === 'doc.image') {
                  const current = values[item.id]
                  return (
                    <div key={item.id} className="admin-content-field">
                      <label>Banner (imagem)</label>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="admin-doc-preview" src={current || DOC_IMAGE_DEFAULT} alt="Pré-visualização do banner" />
                      <p className="admin-field-help">
                        Use a arte inteira em 16:9 (ex: 1600×900). O site mostra só a faixa central, com a logo e o título; no celular as laterais são cortadas.
                      </p>
                      <div className="admin-doc-actions">
                        <label className="admin-btn admin-btn--secondary admin-doc-upload">
                          <IconUpload size={15} /> {uploadingId === item.id ? 'Enviando...' : 'Trocar imagem'}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            hidden
                            disabled={uploadingId === item.id}
                            onChange={e => {
                              const f = e.target.files?.[0]
                              if (f) uploadImage(item.id, f)
                              e.target.value = ''
                            }}
                          />
                        </label>
                        {current && (
                          <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setValue(item.id, '')}>
                            Voltar ao padrão
                          </button>
                        )}
                      </div>
                      {uploadError && <p className="admin-field-help" style={{ color: 'var(--admin-red)' }}>{uploadError}</p>}
                    </div>
                  )
                }
                const check = group === 'seo' ? checkSeoField(item.key, values[item.id] ?? '', activeValuesByKey) : null
                return (
                  <div key={item.id} className="admin-content-field">
                    <label>
                      {item.label}
                      {limit && (
                        <span style={{ opacity: 0.6, fontWeight: 400 }}> · {length}/{limit} caracteres</span>
                      )}
                    </label>
                    {check && (
                      <span className={`admin-field-check admin-field-check--${check.status}`}>
                        {check.status === 'ok' ? '✓' : check.status === 'warn' ? '⚠' : '–'} {check.message}
                      </span>
                    )}
                    {(help ?? DOC_HELP[item.key]) && <p className="admin-field-help">{help ?? DOC_HELP[item.key]}</p>}
                    <textarea
                      value={values[item.id]}
                      onChange={e => setValue(item.id, e.target.value)}
                      rows={values[item.id].length > 120 ? 4 : 2}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
