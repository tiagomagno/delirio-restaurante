import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { IconImage, IconStore, IconPages, IconClipboard, IconMail } from '@/components/admin/icons'

export default async function AdminDashboard() {
  const [
    slideCount, activeSlideCount, storeCount, activeStoreCount, contentCount, pageCount,
    requestCount, messageCount,
  ] = await Promise.all([
    prisma.heroSlide.count(),
    prisma.heroSlide.count({ where: { active: true } }),
    prisma.store.count(),
    prisma.store.count({ where: { active: true } }),
    prisma.pageContent.count(),
    prisma.pageContent.findMany({ distinct: ['page'], select: { page: true } }).then(r => r.length),
    prisma.eventRequest.count(),
    prisma.contactMessage.count(),
  ])

  return (
    <div>
      <h1>Painel Delírio Tropical</h1>
      <p className="admin-lede">Gerencie o conteúdo do site sem precisar de deploy.</p>

      <div className="admin-card-grid">
        <Link className="admin-card" href="/admin/banner">
          <div className="admin-card__icon"><IconImage /></div>
          <div className="admin-card__count">{activeSlideCount}/{slideCount}</div>
          <div className="admin-card__title">Banner</div>
          <div className="admin-card__desc">Slides ativos no carrossel da home</div>
        </Link>

        <Link className="admin-card" href="/admin/lojas">
          <div className="admin-card__icon"><IconStore /></div>
          <div className="admin-card__count">{activeStoreCount}/{storeCount}</div>
          <div className="admin-card__title">Lojas</div>
          <div className="admin-card__desc">Lojas ativas cadastradas</div>
        </Link>

        <Link className="admin-card" href="/admin/paginas">
          <div className="admin-card__icon"><IconPages /></div>
          <div className="admin-card__count">{contentCount}</div>
          <div className="admin-card__title">Páginas</div>
          <div className="admin-card__desc">Textos editáveis em {pageCount} páginas</div>
        </Link>

        <Link className="admin-card" href="/admin/pedidos">
          <div className="admin-card__icon"><IconClipboard /></div>
          <div className="admin-card__count">{requestCount}</div>
          <div className="admin-card__title">Pedidos</div>
          <div className="admin-card__desc">Orçamentos de eventos corporativos</div>
        </Link>

        <Link className="admin-card" href="/admin/contatos">
          <div className="admin-card__icon"><IconMail /></div>
          <div className="admin-card__count">{messageCount}</div>
          <div className="admin-card__title">Contatos</div>
          <div className="admin-card__desc">Mensagens do formulário Fale Conosco</div>
        </Link>
      </div>
    </div>
  )
}
