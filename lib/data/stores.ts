import { prisma } from '@/lib/prisma'

export interface StoreData {
  id: string
  slug: string
  name: string
  address: string[]
  bairroCity: string
  region: string
  image: string
  photos: string[]
  mapsUrl: string
  deliveryUrl: string
  menuUrl: string
  hours: string[]
  phones: string[]
  whatsapp: string
  email: string
  highlight: boolean
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
    photos: (s.photos as string[] | null) ?? [],
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
