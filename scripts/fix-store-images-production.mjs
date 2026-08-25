/**
 * Corrige, em producao, os caminhos de imagem das lojas (que ainda apontam
 * para URLs absolutas em delirio.com.br, hoje instaveis) e aplica a mesma
 * ordem/selecao de fotos definida localmente (fachada como capa, remocao
 * da foto de vitrine do Plaza Niteroi).
 *
 * Idempotente: pode ser rodado mais de uma vez sem efeito colateral.
 * Roda contra o DATABASE_URL do ambiente onde for executado (produção).
 *
 * Uso: node scripts/fix-store-images-production.mjs
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const IMAGES = {
  'Assembléia': '/wp-content/uploads/2023/06/Assembleia-Baixa-5x5-591-px.webp',
  'Barra Shopping': '/wp-content/uploads/2023/06/Barra-Baixa-5x5-591-px.webp',
  'Citta América': '/wp-content/uploads/2023/07/01-Cafeteria-externa-BAIXA-CROP-SAT.webp',
  'Gávea': '/wp-content/uploads/2023/06/Gavea-Baixa-5x5-591-px.webp',
  'Ipanema': '/wp-content/uploads/2023/06/Ipanema-Baixa-5x5-591-px.webp',
  'Metropolitano': '/wp-content/uploads/2023/07/Metropolitano-Baixa-2-NOVA.webp',
  'Plaza Niterói': '/wp-content/uploads/2023/06/Plaza-Niteroi-Baixa-5x5-591-px.webp',
  'Shopping Rio Sul': '/wp-content/uploads/2023/06/Rio-Sul-Baixa-5x5-591-px.webp',
  'Shopping Tijuca': '/wp-content/uploads/2023/06/Tijuca-Baixa-5x5-591-px.webp',
}

const PHOTOS = {
  'Assembléia': [
    '/wp-content/uploads/2023/06/Fachada-Loja-01-GALERIA-1.jpg',
    '/wp-content/uploads/2023/06/Balcao-sanduiche-GALERIA-1.jpg',
    '/wp-content/uploads/2023/06/Balcao-panoramica-GALERIA-1.jpg',
    '/wp-content/uploads/2023/06/Salao-Frente-GALERIA-1.jpg',
    '/wp-content/uploads/2023/06/Fachada-Cafe-02-GALERIA-1.jpg',
    '/wp-content/uploads/2023/06/Salao-fundos-2-piso-01-GALERIA-1.jpg',
  ],
  'Barra Shopping': [
    '/wp-content/uploads/2023/07/00-Ripado-01-CROP-2.webp',
    '/wp-content/uploads/2023/07/00-Varanda-01-CROP-1.webp',
    '/wp-content/uploads/2023/07/00-Externa-01-CROP-1.webp',
    '/wp-content/uploads/2023/07/00-Externo-03-CROP-1.webp',
    '/wp-content/uploads/2023/07/Cafetaria-01-BAIXA-CROP-SAT-BAIXA-2.webp',
    '/wp-content/uploads/2023/07/Estante-01-BAIXA-2-SAT-BAIXA.webp',
    '/wp-content/uploads/2023/07/Cafetaria-07-BAIXA-CROP-02-SAT-2.webp',
  ],
  'Citta América': [
    '/wp-content/uploads/2023/07/02-Fachada-BAIXA-CROP-SAT.webp',
    '/wp-content/uploads/2023/07/01-Cafeteria-externa-BAIXA-CROP-SAT.webp',
    '/wp-content/uploads/2023/07/03-Cafeteria-humanizada-BAIXA-CROP-SAT-1.webp',
    '/wp-content/uploads/2023/07/04-Varanda-BAIXA-CROP-SAT.webp',
    '/wp-content/uploads/2023/07/05-Externa-BAIXA-CROP-SAT.webp',
    '/wp-content/uploads/2023/07/6-Balcao-BAIXA-CROP-SAT.webp',
    '/wp-content/uploads/2023/07/07-Cafeteria-interna-BAIXA-CROP-SAT-1.webp',
  ],
  'Gávea': [
    '/wp-content/uploads/2023/06/Salao-de-cima-2-CROP-1.webp',
    '/wp-content/uploads/2023/06/Letreiro-CROP-1.webp',
    '/wp-content/uploads/2023/06/Salao-frente-CROP-1.webp',
    '/wp-content/uploads/2023/06/Salaozinho-CROP-1.webp',
    '/wp-content/uploads/2023/06/Balcao-frente-2-CROP-1.webp',
    '/wp-content/uploads/2023/06/Balcao-de-cima-CROP-1.webp',
  ],
  'Ipanema': [
    '/wp-content/uploads/2023/07/01-fachada-Ipanema-CO-1-CROP-1-1.webp',
    '/wp-content/uploads/2023/07/loja_ipanema_noite-1-CROP-1.webp',
    '/wp-content/uploads/2023/07/02-fachada-Ipanema-CO-20-CROP-1.webp',
    '/wp-content/uploads/2023/07/03-Delirio-para-Levar-Ipanema-CROP-03-1.webp',
    '/wp-content/uploads/2023/07/Loja_ipanema_noite-3-CROP-1.webp',
    '/wp-content/uploads/2023/07/03-Delirio-para-Levar-Ipanema-CROP-01-1.webp',
  ],
  'Metropolitano': [
    '/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-164-Editar.webp',
    '/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-38-Editar.webp',
    '/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-106-Editar.webp',
    '/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-120-Editar-2.webp',
    '/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-127-Editar.webp',
    '/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-147-Editar.webp',
  ],
  'Plaza Niterói': [
    '/wp-content/uploads/2024/02/Capa-CROP.webp',
    '/wp-content/uploads/2024/02/Cafeteria-01-CROP.webp',
    '/wp-content/uploads/2024/02/Frente-letreiro-CROP-02.webp',
    '/wp-content/uploads/2024/02/Frente-letreiro-lateral-CROP-01-1.webp',
    '/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-46-Editar.webp',
    '/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-55-Editar.webp',
    '/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-89-Editar.webp',
  ],
  'Shopping Rio Sul': [
    '/wp-content/uploads/2023/07/Fachada-2-CROP-1.webp',
    '/wp-content/uploads/2023/07/Mezanino-2-CROP-1.webp',
    '/wp-content/uploads/2023/07/Grab-Go-CROP-1.webp',
    '/wp-content/uploads/2023/07/Balcao-CROP-1.webp',
    '/wp-content/uploads/2023/07/Mezanino-1-CROP-1.webp',
    '/wp-content/uploads/2023/07/Terreo-1-CROP-1.webp',
  ],
  'Shopping Tijuca': [
    '/wp-content/uploads/2023/07/Fachada-lateral-GALERIA-2.jpg',
    '/wp-content/uploads/2023/07/Salao-01-GALERIA-2.jpg',
    '/wp-content/uploads/2023/07/Comodato-GALERIA-2.jpg',
    '/wp-content/uploads/2023/07/Ripado-GALERIA-2.jpg',
    '/wp-content/uploads/2023/07/Bancao-arvore-2-GALERIA-2.jpg',
    '/wp-content/uploads/2023/07/Grab-Go-GALERIA-2.jpg',
    '/wp-content/uploads/2023/07/Bancao-arvore-GALERIA-2.jpg',
  ],
}

const stores = await prisma.store.findMany({ select: { id: true, name: true, photos: true } })
let updated = 0

for (const s of stores) {
  const image = IMAGES[s.name]
  const urls = PHOTOS[s.name]
  if (!image || !urls) {
    console.log(`[SKIP] "${s.name}" nao esta no mapeamento deste script`)
    continue
  }

  // preserva o alt existente de cada foto quando a URL bate; senao usa alt vazio
  const existingByUrl = new Map((Array.isArray(s.photos) ? s.photos : []).map(p => [p.url, p.alt ?? '']))
  const photos = urls.map(url => ({ url, alt: existingByUrl.get(url) ?? '' }))

  await prisma.store.update({ where: { id: s.id }, data: { image, photos } })
  updated++
  console.log(`[OK] ${s.name}: image + ${photos.length} foto(s) atualizadas`)
}

console.log(`\nTotal de lojas atualizadas: ${updated}/${stores.length}`)
await prisma.$disconnect()
