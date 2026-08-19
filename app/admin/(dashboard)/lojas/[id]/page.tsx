import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StoreForm from '@/components/admin/StoreForm'

export default async function EditarLoja({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = await prisma.store.findUnique({ where: { id } })
  if (!store) notFound()

  return (
    <div>
      <h1>Editar loja</h1>
      <StoreForm
        initial={{
          id: store.id,
          slug: store.slug,
          name: store.name,
          address: (store.address as string[]) ?? [''],
          bairroCity: store.bairroCity,
          region: store.region,
          image: store.image,
          photos: (store.photos as string[] | null) ?? [],
          mapsUrl: store.mapsUrl,
          deliveryUrl: store.deliveryUrl ?? '',
          menuUrl: store.menuUrl ?? '',
          hours: (store.hours as string[]) ?? [''],
          phones: (store.phones as string[]) ?? [''],
          whatsapp: store.whatsapp ?? '',
          email: store.email,
          highlight: store.highlight,
          active: store.active,
        }}
      />
    </div>
  )
}
