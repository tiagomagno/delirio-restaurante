import type { Metadata } from 'next'
import { Aleo } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { getPageContent } from '@/lib/data/content'
import { buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo/structuredData'
import { SITE_FAVICON } from '@/lib/seo/pages'
import AsyncTypekitFont from '@/components/AsyncTypekitFont'

const aleo = Aleo({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-aleo',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPageContent('global')
  const title = c['title.default'] ?? 'Delírio Tropical — Restaurante Saudável desde 1983'
  const description = c['description'] ??
    'Culinária natural, fresca e saborosa desde 1983. Lojas no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos.'

  return {
    metadataBase: new URL('https://delirio.com.br'),
    title: {
      default: title,
      template: '%s | Delírio Tropical',
    },
    description,
    openGraph: {
      siteName: 'Delírio Tropical',
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: '/wp-content/uploads/2023/09/banner_delirio_7.webp',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@deliriotropical',
    },
    icons: {
      icon: SITE_FAVICON,
      shortcut: SITE_FAVICON,
      apple: '/wp-content/uploads/2024/08/cropped-icon-delirio-tropical-1-180x180.jpg',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await getPageContent('global')

  return (
    <html lang="pt-BR" className={aleo.variable}>
      <head>
        <noscript>
          <link rel="stylesheet" href="https://use.typekit.net/wef2css.css" />
        </noscript>
      </head>
      <body>
        <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
        <AsyncTypekitFont />
        <StructuredData data={[buildOrganizationSchema(), buildWebsiteSchema()]} />
        <Header whatsappUrl={c['header.whatsapp_url']} />
        {children}
        <Footer
          instagramUrl={c['social.instagram_url']}
          facebookUrl={c['social.facebook_url']}
          whatsappUrl={c['footer.whatsapp_url']}
          tiktokUrl={c['social.tiktok_url']}
          encomendasUrl={c['footer.encomendas_url']}
        />
      </body>
    </html>
  )
}
