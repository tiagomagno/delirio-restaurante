import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getPageContent } from '@/lib/data/content'

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
          url: 'https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_7.jpg',
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
      icon: 'https://delirio.com.br/wp-content/uploads/2023/05/logo-delirio.webp',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
