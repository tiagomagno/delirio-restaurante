import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PUBLIC_PAGES, SITE_URL } from '@/lib/seo/pages'
import { scorePage } from '@/lib/seo/score'
import SeoFilesPanel from '@/components/admin/SeoFilesPanel'

const TRACKED_KEYS = [
  'meta.title', 'meta.description', 'meta.robots', 'meta.canonical',
  'og.title', 'og.description', 'og.image',
]

export default async function AdminSeo() {
  const rows = await prisma.pageContent.findMany({
    where: { key: { in: TRACKED_KEYS } },
  })

  const byPage = new Map<string, Record<string, string>>()
  for (const r of rows) {
    const entry = byPage.get(r.page) ?? {}
    entry[r.key] = r.value
    byPage.set(r.page, entry)
  }

  const pages = PUBLIC_PAGES.map(p => {
    const content = byPage.get(p.slug) ?? {}
    const result = scorePage({
      title: content['meta.title'] || p.fallbackTitle,
      description: content['meta.description'],
      robots: content['meta.robots'],
      ogTitle: content['og.title'],
      ogDescription: content['og.description'],
      ogImage: content['og.image'],
    })
    const canonical = content['meta.canonical']?.trim() || `${SITE_URL}${p.path}`
    return { ...p, ...result, canonical }
  })

  const overall = Math.round(pages.reduce((sum, p) => sum + p.score, 0) / pages.length)
  const badgeClass = (score: number) => (score >= 80 ? 'green' : score >= 50 ? 'amber' : 'gray')

  return (
    <div>
      <h1>SEO</h1>
      <p className="admin-lede">
        Score orientativo de indexação por página. Título, descrição, canonical, robots e Open Graph ficam em{' '}
        <Link href="/admin/paginas">Páginas → aba SEO</Link>.
      </p>

      <div className="admin-panel" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontWeight: 700 }}>SCORE GERAL DO SITE</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{overall}/100</div>
        </div>
        <SeoFilesPanel />
      </div>

      <div className="admin-panel">
        <table className="admin-table">
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '66%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Página</th>
              <th>Score</th>
              <th>Critérios avaliados</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(p => (
              <tr key={p.slug}>
                <td>
                  {p.label}
                  <br />
                  <span style={{ opacity: 0.6, fontSize: 12 }}>{p.canonical}</span>
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${badgeClass(p.score)}`}>{p.score}/100</span>
                </td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
                    {p.checks.map((c, i) => (
                      <li key={i} style={{ fontSize: 12.5, marginBottom: 3, color: c.passed ? '#3d4250' : '#b45309' }}>
                        <strong>{c.passed ? '✓' : '⚠'}</strong> {c.label}
                        {c.hint && <span style={{ opacity: 0.75 }}> — {c.hint}</span>}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
