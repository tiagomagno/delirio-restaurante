'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconCheck, IconEdit, IconUpload } from './icons'
import { DragHandle, useDragSort } from './useDragSort'
import { checkSeoField, DESCRIPTION_LIMIT, TITLE_LIMIT } from '@/lib/seo/fieldCheck'
import {
  isSeoKey,
  LAYOUT_KEY,
  PAGE_SECTIONS,
  PAGE_TEXT_GROUPS,
  resolveSections,
  type SectionState,
} from '@/lib/sections'

export interface ContentItem {
  id: string
  page: string
  key: string
  label: string
  value: string
}

const GLOBAL_PAGE = { slug: 'global', label: 'Global', description: 'Header, footer, redes sociais e SEO padrão do site (valem em todas as páginas).' }

const PAGES = [
  { slug: 'home', label: 'Home', description: 'Banner, lojas, escolha da opção e história da página inicial (/).' },
  { slug: 'sobre-nos', label: 'Sobre Nós', description: 'História, 40 anos, sustentabilidade, rancho e livro (/sobre-nos).' },
  { slug: 'lojas', label: 'Lojas', description: 'SEO da listagem de lojas (/lojas). Os dados das lojas ficam em Lojas.' },
  { slug: 'encomendas', label: 'Encomendas', description: 'Topo, cards, informações, perguntas frequentes e SEO (/encomendas).' },
  { slug: 'trabalhe-conosco', label: 'Trabalhe com a Gente', description: 'Topo, formulário e SEO (/trabalhe-conosco).' },
  { slug: 'eventos-corporativos', label: 'Eventos Corporativos', description: 'Topo, formulário e SEO (/eventos-corporativos).' },
  { slug: 'fale-conosco', label: 'Fale Conosco', description: 'Topo, formulário, aviso por e-mail e SEO (/fale-conosco).' },
  { slug: 'ouvidoria', label: 'Ouvidoria', description: 'Topo e SEO (/ouvidoria).' },
  { slug: 'uso-e-privacidade', label: 'Uso e Privacidade', description: 'Texto da política de uso e privacidade (/uso-e-privacidade).' },
]

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

// Seção "40 anos" de Sobre Nós: campos com ordem e ajuda próprias.
const DOC_ORDER = ['doc.image', 'doc.video_url', 'doc.full_url', 'doc.cta', 'doc.title']
const DOC_IMAGE_DEFAULT = '/wp-content/uploads/2023/05/delirio-40-anos-documentario.webp'
const DOC_HELP: Record<string, string> = {
  'doc.video_url': 'Trailer que toca dentro do site. Melhor opção: enviar o arquivo de vídeo (MP4) pelo botão abaixo — toca limpo, em 16:9, sozinho e sem som, em loop. Também aceita link do YouTube (não listado) ou de post do Instagram (o Instagram mostra a interface dele).',
  'doc.full_url': 'Link do vídeo completo (ex: a live). O botão abre em nova aba. Deixe em branco para esconder o botão.',
  'doc.cta': 'Texto do botão abaixo do vídeo.',
  'doc.title': 'Nome da seção para leitores de tela e acessibilidade (não aparece na tela).',
}

type Tab = 'secoes' | 'textos' | 'seo'
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Media {
  uploadingId: string | null
  uploadError: string
  upload: (id: string, file: File, kind: 'image' | 'video') => void
}

function ContentField({
  item, value, onChange, valuesByKey, media,
}: {
  item: ContentItem
  value: string
  onChange: (id: string, value: string) => void
  valuesByKey: Record<string, string>
  media: Media
}) {
  const uploading = media.uploadingId === item.id

  if (item.key === 'doc.image') {
    return (
      <div className="admin-content-field">
        <label>Banner (imagem)</label>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="admin-doc-preview" src={value || DOC_IMAGE_DEFAULT} alt="Pré-visualização do banner" />
        <p className="admin-field-help">
          Use a arte inteira em 16:9 (ex: 1600×900). O site mostra só a faixa central, com a logo e o título; no celular as laterais são cortadas.
        </p>
        <div className="admin-doc-actions">
          <label className="admin-btn admin-btn--secondary admin-doc-upload">
            <IconUpload size={15} /> {uploading ? 'Enviando...' : 'Trocar imagem'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              disabled={uploading}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) media.upload(item.id, f, 'image')
                e.target.value = ''
              }}
            />
          </label>
          {value && (
            <button type="button" className="admin-btn admin-btn--secondary" onClick={() => onChange(item.id, '')}>
              Voltar ao padrão
            </button>
          )}
        </div>
        {uploading ? null : media.uploadError && <p className="admin-field-help admin-field-help--error">{media.uploadError}</p>}
      </div>
    )
  }

  if (item.key === 'doc.video_url') {
    return (
      <div className="admin-content-field">
        <label>Trailer (vídeo ou link)</label>
        <p className="admin-field-help">{DOC_HELP[item.key]}</p>
        <textarea
          value={value}
          onChange={e => onChange(item.id, e.target.value)}
          rows={2}
          placeholder="Cole um link ou envie o arquivo MP4"
        />
        {value.startsWith('/uploads/') && <span className="admin-badge admin-badge--green" style={{ width: 'fit-content' }}>Vídeo enviado</span>}
        <div className="admin-doc-actions">
          <label className="admin-btn admin-btn--secondary admin-doc-upload">
            <IconUpload size={15} /> {uploading ? 'Enviando...' : 'Enviar vídeo (MP4)'}
            <input
              type="file"
              accept="video/mp4,video/webm"
              hidden
              disabled={uploading}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) media.upload(item.id, f, 'video')
                e.target.value = ''
              }}
            />
          </label>
          {value && (
            <button type="button" className="admin-btn admin-btn--secondary" onClick={() => onChange(item.id, '')}>
              Remover
            </button>
          )}
        </div>
        {uploading ? null : media.uploadError && <p className="admin-field-help admin-field-help--error">{media.uploadError}</p>}
      </div>
    )
  }

  const limit = CHAR_LIMITS[item.key]
  const help = SEO_HELP[item.key] ?? DOC_HELP[item.key]
  const check = isSeoKey(item.key) ? checkSeoField(item.key, value, valuesByKey) : null

  return (
    <div className="admin-content-field">
      <label>
        {item.label}
        {limit && <span style={{ opacity: 0.6, fontWeight: 400 }}> · {value.length}/{limit} caracteres</span>}
      </label>
      {check && (
        <span className={`admin-field-check admin-field-check--${check.status}`}>
          {check.status === 'ok' ? '✓' : check.status === 'warn' ? '⚠' : '–'} {check.message}
        </span>
      )}
      {help && <p className="admin-field-help">{help}</p>}
      <textarea
        value={value}
        onChange={e => onChange(item.id, e.target.value)}
        rows={value.length > 120 ? 4 : 2}
      />
    </div>
  )
}

function SectionsTab({
  page, sections, savedSections, onChange, onSaved,
}: {
  page: string
  sections: SectionState[]
  savedSections: SectionState[]
  onChange: (next: SectionState[]) => void
  onSaved: (next: SectionState[]) => void
}) {
  const router = useRouter()
  const [state, setState] = useState<SaveState>('idle')
  const [error, setError] = useState('')

  const movable = sections.filter(s => !s.pinned)
  const sort = useDragSort(movable.map(s => s.id), orderedIds => {
    const byId = new Map(sections.map(s => [s.id, s]))
    onChange([...sections.filter(s => s.pinned), ...orderedIds.map(id => byId.get(id)!)])
    setState('idle')
  })

  const dirty = JSON.stringify(sections.map(s => [s.id, s.visible])) !== JSON.stringify(savedSections.map(s => [s.id, s.visible]))

  function toggle(id: string) {
    onChange(sections.map(s => (s.id === id ? { ...s, visible: !s.visible } : s)))
    setState('idle')
  }

  async function save() {
    setState('saving')
    setError('')
    try {
      const res = await fetch('/api/admin/page-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, sections: sections.map(s => ({ id: s.id, visible: s.visible })) }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'Erro ao salvar')
      onSaved(sections)
      setState('saved')
      router.refresh()
      setTimeout(() => setState(s => (s === 'saved' ? 'idle' : s)), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
      setState('error')
    }
  }

  return (
    <div>
      <p className="admin-field-help" style={{ marginBottom: 12 }}>
        Arraste pela alça para mudar a ordem em que as seções aparecem no site, ou oculte as que não quiser mostrar.
        As seções ocultas continuam guardadas e podem voltar quando quiser.
      </p>
      <div className="admin-section-list">
        {sections.map((s, i) => {
          const itemProps = s.pinned ? { className: 'admin-section-row' } : sort.itemProps(s.id, 'admin-section-row')
          return (
            <div key={s.id} {...itemProps}>
              {s.pinned ? <span className="admin-section-row__lock" title="Fixa no topo">🔒</span> : <DragHandle props={sort.handleProps(s.id)} label={`Reordenar ${s.label}`} />}
              <span className="admin-section-row__index">{i + 1}º</span>
              <span className="admin-section-row__name">
                {s.label}
                {s.description && <small>{s.description}</small>}
              </span>
              {s.pinned ? (
                <span className="admin-badge admin-badge--gray">Fixa no topo</span>
              ) : (
                <>
                  <span className={`admin-badge admin-badge--${s.visible ? 'green' : 'gray'}`}>{s.visible ? 'Visível' : 'Oculta'}</span>
                  <button type="button" className="admin-icon-btn" onClick={() => toggle(s.id)}>
                    {s.visible ? 'Ocultar' : 'Exibir'}
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
      <div className="admin-drawer__actions">
        <button type="button" className="admin-btn" onClick={save} disabled={!dirty || state === 'saving'}>
          {state === 'saving' ? 'Salvando...' : state === 'saved' ? <><IconCheck size={15} /> Salvo</> : 'Salvar'}
        </button>
        {state === 'error' && <span className="admin-field-help admin-field-help--error">{error}</span>}
        {dirty && state !== 'saving' && <span className="admin-field-help">Alterações não salvas</span>}
      </div>
    </div>
  )
}

export default function PagesManager({ items }: { items: ContentItem[] }) {
  const [openPage, setOpenPage] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('textos')
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  // os campos de texto; a configuração de layout tem editor próprio
  // ('doc.enabled' é um campo antigo, substituído pela visibilidade da seção)
  const textItems = useMemo(() => items.filter(i => i.key !== LAYOUT_KEY && i.key !== 'doc.enabled'), [items])
  const byPage = useMemo(() => {
    const m: Record<string, ContentItem[]> = {}
    for (const i of textItems) (m[i.page] ??= []).push(i)
    return m
  }, [textItems])

  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(items.map(i => [i.id, i.value])))
  const [saved, setSaved] = useState<Record<string, string>>(() => Object.fromEntries(items.map(i => [i.id, i.value])))
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState('')

  const layoutRaw = (page: string) => items.find(i => i.page === page && i.key === LAYOUT_KEY)?.value
  const [layouts, setLayouts] = useState<Record<string, SectionState[]>>(() =>
    Object.fromEntries(Object.keys(PAGE_SECTIONS).map(p => [p, resolveSections(p, layoutRaw(p))])),
  )
  const [savedLayouts, setSavedLayouts] = useState<Record<string, SectionState[]>>(() =>
    Object.fromEntries(Object.keys(PAGE_SECTIONS).map(p => [p, resolveSections(p, layoutRaw(p))])),
  )

  const pageItems = openPage ? byPage[openPage] ?? [] : []
  const hasSections = openPage ? !!PAGE_SECTIONS[openPage] : false
  const dirtyIds = pageItems.filter(i => values[i.id] !== saved[i.id]).map(i => i.id)

  const valuesByKey = useMemo(
    () => Object.fromEntries(pageItems.map(i => [i.key, values[i.id] ?? ''])),
    [pageItems, values],
  )

  useEffect(() => {
    if (!openPage) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPage, dirtyIds.length])

  function layoutDirty(page: string) {
    const a = (layouts[page] ?? []).map(s => [s.id, s.visible])
    const b = (savedLayouts[page] ?? []).map(s => [s.id, s.visible])
    return JSON.stringify(a) !== JSON.stringify(b)
  }

  function open(page: string) {
    setOpenPage(page)
    setTab(PAGE_SECTIONS[page] ? 'secoes' : 'textos')
    setOpenGroup(null)
    setSaveState('idle')
    setUploadError('')
  }

  function requestClose() {
    if (openPage && (dirtyIds.length > 0 || layoutDirty(openPage)) && !confirm('Há alterações não salvas. Fechar mesmo assim?')) return
    setOpenPage(null)
  }

  function setValue(id: string, value: string) {
    setValues(v => ({ ...v, [id]: value }))
    if (saveState !== 'idle') setSaveState('idle')
  }

  async function saveTexts() {
    if (dirtyIds.length === 0) return
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

  async function upload(id: string, file: File, kind: 'image' | 'video') {
    setUploadError('')
    setUploadingId(id)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'sobre')
      const res = await fetch(kind === 'video' ? '/api/admin/upload-video' : '/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro no upload')
      setValue(id, data.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setUploadingId(null)
    }
  }

  const media: Media = { uploadingId, uploadError, upload }

  // Grupos da aba "Textos por seção": os grupos conhecidos da página, mais
  // "Outros" pro que não casar com nenhum prefixo.
  const textGroups = useMemo(() => {
    if (!openPage) return []
    const defs = PAGE_TEXT_GROUPS[openPage] ?? []
    const content = pageItems.filter(i => !isSeoKey(i.key))
    const used = new Set<string>()
    const groups = defs
      .map(def => {
        let list = content.filter(i => def.prefixes.some(p => i.key.startsWith(p)))
        list.forEach(i => used.add(i.id))
        if (def.id === 'doc') {
          list = [...list].sort((a, b) => {
            const ia = DOC_ORDER.indexOf(a.key)
            const ib = DOC_ORDER.indexOf(b.key)
            return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
          })
        }
        return { id: def.id, label: def.label, items: list }
      })
      .filter(g => g.items.length > 0)
    const rest = content.filter(i => !used.has(i.id))
    if (rest.length > 0) groups.push({ id: 'outros', label: 'Outros', items: rest })
    return groups
  }, [openPage, pageItems])

  const seoItems = pageItems.filter(i => isSeoKey(i.key))
  const showSeoTab = openPage !== 'global' && seoItems.length > 0
  const activePageInfo = openPage === 'global' ? GLOBAL_PAGE : PAGES.find(p => p.slug === openPage)

  const saveBar = (
    <div className="admin-drawer__actions">
      <button type="button" className="admin-btn" onClick={saveTexts} disabled={dirtyIds.length === 0 || saveState === 'saving'}>
        {saveState === 'saving' ? 'Salvando...' : saveState === 'saved' ? <><IconCheck size={15} /> Salvo</> : 'Salvar alterações'}
      </button>
      <span className={`admin-field-help${saveState === 'error' ? ' admin-field-help--error' : ''}`}>
        {saveState === 'error'
          ? `Erro ao salvar — ${saveError || 'tente novamente.'}`
          : dirtyIds.length > 0
            ? `${dirtyIds.length} ${dirtyIds.length === 1 ? 'alteração não salva' : 'alterações não salvas'}`
            : 'Tudo salvo'}
      </span>
    </div>
  )

  function renderRows(list: { slug: string; label: string; description: string }[]) {
    return (
      <table className="admin-table">
        <colgroup>
          <col style={{ width: '24%' }} />
          <col />
          <col style={{ width: 80 }} />
        </colgroup>
        <thead>
          <tr><th>Nome</th><th>Descrição</th><th /></tr>
        </thead>
        <tbody>
          {list.map(p => (
            <tr key={p.slug}>
              <td><strong>{p.label}</strong></td>
              <td>{p.description}</td>
              <td>
                <button type="button" className="admin-icon-btn" onClick={() => open(p.slug)} aria-label={`Editar ${p.label}`}>
                  <IconEdit size={13} /> Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <h2 className="admin-content-column__title">Global</h2>
      <div className="admin-panel" style={{ marginBottom: 28 }}>{renderRows([GLOBAL_PAGE])}</div>

      <h2 className="admin-content-column__title">Páginas</h2>
      <div className="admin-panel">{renderRows(PAGES)}</div>

      {openPage && activePageInfo && (
        <div className="admin-drawer-overlay" onClick={requestClose}>
          <aside className="admin-drawer" role="dialog" aria-label={`Editar ${activePageInfo.label}`} onClick={e => e.stopPropagation()}>
            <div className="admin-drawer__head">
              <h2>{activePageInfo.label}</h2>
              <button type="button" className="admin-drawer__close" onClick={requestClose} aria-label="Fechar">×</button>
            </div>

            <div className="admin-pill-tabs" role="tablist">
              {hasSections && (
                <button role="tab" aria-selected={tab === 'secoes'} className={tab === 'secoes' ? 'is-active' : ''} onClick={() => setTab('secoes')}>Seções</button>
              )}
              <button role="tab" aria-selected={tab === 'textos'} className={tab === 'textos' ? 'is-active' : ''} onClick={() => setTab('textos')}>Textos por seção</button>
              {showSeoTab && (
                <button role="tab" aria-selected={tab === 'seo'} className={tab === 'seo' ? 'is-active' : ''} onClick={() => setTab('seo')}>SEO</button>
              )}
            </div>

            <div className="admin-drawer__body">
              {tab === 'secoes' && hasSections && (
                <SectionsTab
                  page={openPage}
                  sections={layouts[openPage]}
                  savedSections={savedLayouts[openPage]}
                  onChange={next => setLayouts(l => ({ ...l, [openPage]: next }))}
                  onSaved={next => setSavedLayouts(l => ({ ...l, [openPage]: next }))}
                />
              )}

              {tab === 'textos' && (
                <>
                  {textGroups.length === 0 && <p className="admin-empty">Esta página não tem textos editáveis além do SEO.</p>}
                  <div className="admin-accordion">
                    {textGroups.map(g => {
                      const isOpen = openGroup === g.id
                      const dirty = g.items.filter(i => values[i.id] !== saved[i.id]).length
                      return (
                        <div key={g.id} className={`admin-accordion__item${isOpen ? ' is-open' : ''}`}>
                          <button type="button" className="admin-accordion__head" aria-expanded={isOpen} onClick={() => setOpenGroup(isOpen ? null : g.id)}>
                            <span>{g.label}</span>
                            <span className="admin-accordion__count">
                              {dirty > 0 && <span className="admin-badge admin-badge--amber" style={{ marginRight: 8 }}>editado</span>}
                              {g.items.length} {g.items.length === 1 ? 'texto' : 'textos'}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="admin-accordion__body">
                              {g.items.map(item => (
                                <ContentField key={item.id} item={item} value={values[item.id] ?? ''} onChange={setValue} valuesByKey={valuesByKey} media={media} />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {textGroups.length > 0 && saveBar}
                </>
              )}

              {tab === 'seo' && showSeoTab && (
                <>
                  <div className="admin-accordion__body" style={{ padding: 0 }}>
                    {seoItems.map(item => (
                      <ContentField key={item.id} item={item} value={values[item.id] ?? ''} onChange={setValue} valuesByKey={valuesByKey} media={media} />
                    ))}
                  </div>
                  {saveBar}
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
