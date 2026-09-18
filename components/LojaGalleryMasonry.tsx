import RetryImage from '@/components/RetryImage'
import type { StorePhoto } from '@/lib/data/stores'

export default function LojaGalleryMasonry({ fotos, nome }: { fotos: StorePhoto[]; nome: string }) {
  if (fotos.length === 0) return null

  return (
    <div className="loja-gallery">
      {fotos.map((foto, i) => (
        <div className="loja-gallery__item" key={foto.url}>
          <RetryImage
            src={foto.url}
            alt={foto.alt || `${nome} — foto ${i + 1} de ${fotos.length}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  )
}
