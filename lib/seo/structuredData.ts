import { SITE_LOGO, SITE_NAME, SITE_URL } from './pages'

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${SITE_LOGO}`,
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export interface StoreSchemaInput {
  name: string
  address: string[]
  bairroCity: string
  phones: string[]
  email: string
  mapsUrl: string
}

// Não inclui openingHoursSpecification: os horários hoje são texto livre
// (ex: "Segunda a Sexta de 8h às 16h"), não dados estruturados por dia/hora —
// gerar isso exigiria adivinhar, com risco de o dado estruturado divergir do
// texto real exibido na página.
export function buildStoreSchema(store: StoreSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: `${SITE_NAME} — ${store.name}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address.join(', '),
      addressLocality: store.bairroCity,
      addressCountry: 'BR',
    },
    telephone: store.phones[0],
    email: store.email,
    hasMap: store.mapsUrl,
  }
}
