'use client'

import { useState, type ReactNode } from 'react'

export default function FormPreviewPanel({
  previewUrl,
  previewLabel = 'Pré-visualização do formulário',
  children,
}: {
  previewUrl: string
  previewLabel?: string
  children: ReactNode
}) {
  const [tab, setTab] = useState<'recebidos' | 'preview'>('recebidos')

  return (
    <div>
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab${tab === 'recebidos' ? ' admin-tab--active' : ''}`}
          onClick={() => setTab('recebidos')}
        >
          Recebidos
        </button>
        <button
          type="button"
          className={`admin-tab${tab === 'preview' ? ' admin-tab--active' : ''}`}
          onClick={() => setTab('preview')}
        >
          {previewLabel}
        </button>
      </div>

      <div style={{ display: tab === 'recebidos' ? 'block' : 'none' }}>{children}</div>

      {tab === 'preview' && (
        <div className="admin-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <p className="admin-lede" style={{ padding: '16px 20px 0' }}>
            Só o formulário, com os campos reais — evite enviar por aqui.
          </p>
          <iframe
            src={previewUrl}
            title={previewLabel}
            style={{ width: '100%', height: 640, border: 'none', display: 'block', marginTop: 16 }}
          />
        </div>
      )}
    </div>
  )
}
