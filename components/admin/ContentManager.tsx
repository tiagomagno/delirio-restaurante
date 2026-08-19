'use client'

import { useMemo, useState } from 'react'
import { IconCheck } from './icons'

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

type Group = 'texto' | 'botao' | 'seo'

const GROUP_LABELS: Record<Group, string> = {
  texto: 'Textos',
  botao: 'Botões',
  seo: 'SEO',
}

const GROUP_ORDER: Group[] = ['texto', 'botao', 'seo']

function groupOf(item: ContentItem): Group {
  if (item.page === 'global' || item.key.startsWith('meta.')) return 'seo'
  if (item.key.endsWith('.cta')) return 'botao'
  return 'texto'
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
    const groups: Record<Group, ContentItem[]> = { texto: [], botao: [], seo: [] }
    for (const item of activeItems) groups[groupOf(item)].push(item)
    return groups
  }, [activeItems])

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map(i => [i.id, i.value])),
  )
  const [saved, setSaved] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map(i => [i.id, i.value])),
  )
  const [saveState, setSaveState] = useState<SaveState>('idle')

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
      if (results.some(r => !r.ok)) throw new Error('save failed')
      setSaved(s => ({ ...s, ...Object.fromEntries(dirtyIds.map(id => [id, values[id]])) }))
      setSaveState('saved')
      setTimeout(() => setSaveState(s => (s === 'saved' ? 'idle' : s)), 2500)
    } catch {
      setSaveState('error')
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
              ? 'Erro ao salvar — tente novamente.'
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
              {groupedActiveItems[group].map(item => (
                <div key={item.id} className="admin-content-field">
                  <label>{item.label}</label>
                  <textarea
                    value={values[item.id]}
                    onChange={e => setValue(item.id, e.target.value)}
                    rows={values[item.id].length > 120 ? 4 : 2}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
