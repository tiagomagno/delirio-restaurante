import { prisma } from '@/lib/prisma'

export interface StorePhoto {
  url: string
  alt: string
}

export interface StoreData {
  id: string
  slug: string
  name: string
  address: string[]
  bairroCity: string
  region: string
  image: string
  imageAlt: string
  photos: StorePhoto[]
  mapsUrl: string
  deliveryUrl: string
  menuUrl: string
  hours: string[]
  phones: string[]
  whatsapp: string
  email: string
  highlight: boolean
}

// `photos` é uma coluna Json que guardava só string[] de URLs. Registros
// antigos continuam nesse formato; normalizamos pra {url, alt} pra não quebrar
// dado existente ao introduzir o campo de texto alternativo.
export function normalizePhotos(raw: unknown): StorePhoto[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item): StorePhoto | null => {
      if (typeof item === 'string') return { url: item, alt: '' }
      if (item && typeof item === 'object' && typeof (item as { url?: unknown }).url === 'string') {
        const obj = item as { url: string; alt?: unknown }
        return { url: obj.url, alt: typeof obj.alt === 'string' ? obj.alt : '' }
      }
      return null
    })
    .filter((p): p is StorePhoto => p !== null)
}

export async function getStores(): Promise<StoreData[]> {
  const stores = await prisma.store.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })

  return stores.map(s => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    address: (s.address as string[]) ?? [],
    bairroCity: s.bairroCity,
    region: s.region,
    image: s.image,
    imageAlt: s.imageAlt,
    photos: normalizePhotos(s.photos),
    mapsUrl: s.mapsUrl,
    deliveryUrl: s.deliveryUrl ?? '',
    menuUrl: s.menuUrl ?? '',
    hours: (s.hours as string[]) ?? [],
    phones: (s.phones as string[]) ?? [],
    whatsapp: s.whatsapp ?? '',
    email: s.email,
    highlight: s.highlight,
  }))
}
