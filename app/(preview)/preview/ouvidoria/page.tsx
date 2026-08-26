import OuvidoriaClient from '@/app/(site)/ouvidoria/OuvidoriaClient'

export const dynamic = 'force-dynamic'

export default function PreviewOuvidoria() {
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <OuvidoriaClient />
    </div>
  )
}
