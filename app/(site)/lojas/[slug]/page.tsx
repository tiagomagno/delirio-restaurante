import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStoreBySlug } from '@/lib/data/stores'
import { LojaIdentityActions, LojaDetails } from '@/components/LojaInfo'
import LojaGalleryMasonry from '@/components/LojaGalleryMasonry'
import StructuredData from '@/components/StructuredData'
import { buildStoreSchema } from '@/lib/seo/structuredData'
import { SITE_NAME, SITE_URL } from '@/lib/seo/pages'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

// Página individual por loja — protótipo local ainda não aprovado pelo
// cliente. Fica de fora do sitemap.xml e com noindex até a aprovação; nada
// no site público linka pra cá ainda (ver PUBLIC_PAGES em lib/seo/pages.ts).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const store = await getStoreBySlug(slug)
  if (!store) return {}

  const title = `${store.name} — ${SITE_NAME}`
  const description = `Endereço, horário de funcionamento, delivery e cardápio da loja ${store.name} do Delírio Tropical em ${store.bairroCity}.`
  const canonical = `${SITE_URL}/lojas/${store.slug}`
  const image = store.storeImage || store.image

  return {
    // Sem `absolute`, o template do layout raiz ("%s | Delírio Tropical")
    // duplicaria a marca no <title> final (o título já a inclui).
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630, alt: store.name }] : undefined,
    },
  }
}

export default async function LojaPage({ params }: Props) {
  const { slug } = await params
  const store = await getStoreBySlug(slug)
  if (!store) notFound()

  return (
    <main id="main-content" tabIndex={-1}>
      <StructuredData data={buildStoreSchema(store)} />
      <div className="loja-page-single">
        <article className="loja-card">
          <LojaIdentityActions loja={store} />
          <LojaGalleryMasonry fotos={store.photos} nome={store.name} />
          <LojaDetails loja={store} />
        </article>
      </div>
    </main>
  )
}
