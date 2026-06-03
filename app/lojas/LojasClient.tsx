'use client'

import { useState } from 'react'

const BASE = 'https://delirio.com.br/wp-content/uploads/'

/* ─── Tipos ─── */
interface Loja {
  id: string
  nome: string
  endereco: string
  bairro: string
  horario1: string
  horario2?: string
  whatsapp: string
  telefone: string
  email: string
  mapsUrl: string
  ifoodUrl: string
  cardapioUrl?: string
  fotos: string[]
  regiao: 'rio' | 'niteroi'
}

/* ─── Dados ─── */
const LOJAS: Loja[] = [
  {
    id: 'assembleia',
    nome: 'Assembléia',
    endereco: 'Rua da Assembléia, 36',
    bairro: 'Centro, Rio de Janeiro | RJ',
    horario1: 'Segunda a sexta de 8h às 16h',
    horario2: 'Sábados, domingos e feriados não abre',
    whatsapp: '5521997825789',
    telefone: '(21) 2242-6369',
    email: 'dtass@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Delirio+Tropical/@-22.9046963,-43.1783802,17z/data=!3m1!4b1!4m6!3m5!1s0x997f5f76fcfeab:0x54ffb316f4d0d495!8m2!3d-22.9047013!4d-43.1758053!16s%2Fg%2F1t_wql81?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---assembleia-centro/35dc2a84-b721-4027-a1dc-a03e57124633',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/965e1d05-efa4-48d5-a0f4-fc9fdba6afee',
    fotos: [
      BASE + '2023/06/Balcao-sanduiche-GALERIA-1.jpg',
      BASE + '2023/06/Fachada-Loja-01-GALERIA-1.jpg',
      BASE + '2023/06/Balcao-panoramica-GALERIA-1.jpg',
      BASE + '2023/06/Salao-Frente-GALERIA-1.jpg',
      BASE + '2023/06/Fachada-Cafe-02-GALERIA-1.jpg',
      BASE + '2023/06/Salao-fundos-2-piso-01-GALERIA-1.jpg',
    ],
    regiao: 'rio',
  },
  {
    id: 'tijuca',
    nome: 'Shopping Tijuca',
    endereco: 'Av. Maracanã, 987, Lojas 2 a 5',
    bairro: 'Tijuca, Rio de Janeiro | RJ',
    horario1: 'Segunda a sábado de 11h às 22h',
    horario2: 'Domingos e feriados de 12h às 21h',
    whatsapp: '5521997826115',
    telefone: '(21) 2230-5370',
    email: 'dttijuca@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9219506,-43.2381971,17z/data=!3m1!4b1!4m6!3m5!1s0x997f9e4574f7dd:0x4d1cbab29439f7fb!8m2!3d-22.9219556!4d-43.2356222!16s%2Fg%2F11fsk9sld8?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---shopping-tijuca-tijuca/b18046dd-e115-4522-a02e-9d80a680908a',
    fotos: [
      BASE + '2023/07/Salao-01-GALERIA-2.jpg',
      BASE + '2023/07/Fachada-lateral-GALERIA-2.jpg',
      BASE + '2023/07/Comodato-GALERIA-2.jpg',
      BASE + '2023/07/Ripado-GALERIA-2.jpg',
      BASE + '2023/07/Bancao-arvore-2-GALERIA-2.jpg',
      BASE + '2023/07/Grab-Go-GALERIA-2.jpg',
      BASE + '2023/07/Bancao-arvore-GALERIA-2.jpg',
    ],
    regiao: 'rio',
  },
  {
    id: 'riosul',
    nome: 'Shopping Rio Sul',
    endereco: 'Av. Lauro Sodré, 445',
    bairro: 'Botafogo, Rio de Janeiro | RJ',
    horario1: 'Segunda a sábado de 11h às 22h',
    horario2: 'Domingos e feriados de 12h às 21h',
    whatsapp: '5521997699746',
    telefone: '(21) 2275-9572',
    email: 'dtriosul@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9571974,-43.179219,17z/data=!3m2!4b1!5s0x9bd55dbdbbeaf1:0x5da51a53ce815e24!4m6!3m5!1s0x997ff8fde49319:0xaaff47049a289550!8m2!3d-22.9572024!4d-43.1766441!16s%2Fg%2F11bwkyz65d?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---rio-sul-botafogo/a3323936-9ad8-468c-b84d-75b455dca7d4',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/dce05ee3-4573-4a49-9433-a5d12305faad',
    fotos: [
      BASE + '2023/07/Mezanino-2-CROP-1.jpg',
      BASE + '2023/07/Fachada-2-CROP-1.jpg',
      BASE + '2023/07/Grab-Go-CROP-1.jpg',
      BASE + '2023/07/Balcao-CROP-1.jpg',
      BASE + '2023/07/Mezanino-1-CROP-1.jpg',
      BASE + '2023/07/Terreo-1-CROP-1.jpg',
    ],
    regiao: 'rio',
  },
  {
    id: 'ipanema',
    nome: 'Ipanema',
    endereco: 'Rua Garcia D\'Avila, 48',
    bairro: 'Ipanema, Rio de Janeiro | RJ',
    horario1: 'Todos os dias de 11h às 20h',
    whatsapp: '5521971538244',
    telefone: '(21) 3624-8164',
    email: 'secretaria.ipa@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical+Ipanema/@-22.9849715,-43.2117153,17z/data=!3m1!4b1!4m6!3m5!1s0x9bd50699c0b129:0x9bacde5344fcab4b!8m2!3d-22.9849765!4d-43.2091404!16s%2Fg%2F1tlbkt3m?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---ipanema-ipanema/8b8ba208-ced2-40fb-95bd-374b5846c376',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/7b9659ef-9dfc-4330-a828-cde89b0753eb',
    fotos: [
      BASE + '2023/07/loja_ipanema_noite-1-CROP-1.jpg',
      BASE + '2023/07/01-fachada-Ipanema-CO-1-CROP-1-1.jpg',
      BASE + '2023/07/02-fachada-Ipanema-CO-20-CROP-1.jpg',
      BASE + '2023/07/03-Delirio-para-Levar-Ipanema-CROP-03-1.jpg',
      BASE + '2023/07/Loja_ipanema_noite-3-CROP-1.jpg',
      BASE + '2023/07/03-Delirio-para-Levar-Ipanema-CROP-01-1.jpg',
    ],
    regiao: 'rio',
  },
  {
    id: 'gavea',
    nome: 'Gávea',
    endereco: 'Rua Marquês de São Vicente, 68',
    bairro: 'Gávea, Rio de Janeiro | RJ',
    horario1: 'Segunda a sábado de 11h às 20h',
    horario2: 'Domingos e feriados de 11h às 19h',
    whatsapp: '5521997720867',
    telefone: '(21) 3624-7055',
    email: 'dtgav@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical+G%C3%A1vea/@-22.9760903,-43.2304537,17.5z/data=!4m6!3m5!1s0x9bd5b74672a933:0x42d971772a771430!8m2!3d-22.9759302!4d-43.2287239!16s%2Fg%2F1tghqt95?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---gavea-gavea/96916ae9-f4c2-4315-b4a0-cb2cfb37cd5f',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/2f546851-9d64-4fc0-a2fc-1912df983ecf',
    fotos: [
      BASE + '2023/06/Salao-frente-CROP-1.jpg',
      BASE + '2023/06/Salao-de-cima-2-CROP-1.jpg',
      BASE + '2023/06/Salaozinho-CROP-1.jpg',
      BASE + '2023/06/Balcao-frente-2-CROP-1.jpg',
      BASE + '2023/06/Letreiro-CROP-1.jpg',
      BASE + '2023/06/Balcao-de-cima-CROP-1.jpg',
    ],
    regiao: 'rio',
  },
  {
    id: 'citta',
    nome: 'Citta América',
    endereco: 'Av. das Américas, 700 – Loja 114 B,C,D',
    bairro: 'Barra da Tijuca, Rio de Janeiro | RJ',
    horario1: 'Segunda a sábado de 11h às 17h',
    horario2: 'Domingos não abre',
    whatsapp: '5521997528683',
    telefone: '(21) 2132-8007',
    email: 'dtcit@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-23.0032836,-43.3232214,17z/data=!3m2!4b1!5s0x9bd9eb6e228109:0x6d6eb20c8c1d5d50!4m6!3m5!1s0x9bd0a519c2424b:0x24efb2ecd8424415!8m2!3d-23.0032886!4d-43.3206465!16s%2Fg%2F11bx1yr71w?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---citta-america-barra-da-tijuca/d06e794d-928e-4a69-9a8d-12c4671028bf',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/3965d1a1-8830-4cf6-b73f-db3485bd226a',
    fotos: [
      BASE + '2023/07/01-Cafeteria-externa-BAIXA-CROP-SAT.jpg',
      BASE + '2023/07/02-Fachada-BAIXA-CROP-SAT.jpg',
      BASE + '2023/07/03-Cafeteria-humanizada-BAIXA-CROP-SAT-1.jpg',
      BASE + '2023/07/04-Varanda-BAIXA-CROP-SAT.jpg',
      BASE + '2023/07/05-Externa-BAIXA-CROP-SAT.jpg',
      BASE + '2023/07/6-Balcao-BAIXA-CROP-SAT.jpg',
      BASE + '2023/07/07-Cafeteria-interna-BAIXA-CROP-SAT-1.jpg',
    ],
    regiao: 'rio',
  },
  {
    id: 'barrashopping',
    nome: 'Barra Shopping',
    endereco: 'Av. das Américas, 4666, Loja 150',
    bairro: 'Barra da Tijuca, Rio de Janeiro | RJ',
    horario1: 'Segunda a sábado de 11h às 22h',
    horario2: 'Domingos e feriados de 12h às 21h',
    whatsapp: '5521996091856',
    telefone: '(21) 3089-1170',
    email: 'dtbshop@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9977871,-43.3633218,17z/data=!3m2!4b1!5s0x9bda386cbb3325:0x1e314697b5c69e65!4m6!3m5!1s0x9bda4776586fe9:0xdc59dba649183dad!8m2!3d-22.9977921!4d-43.3607469!16s%2Fg%2F1vgqf9q3?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical-barra-shopping-barra-da-tijuca/55e7f39e-71f3-4021-abfe-f834f9739dcb',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/24f7ac5d-c0e0-41cc-b971-cffdfdbfcc84',
    fotos: [
      BASE + '2023/07/00-Externa-01-CROP-1.jpg',
      BASE + '2023/07/00-Ripado-01-CROP-2.jpg',
      BASE + '2023/07/00-Varanda-01-CROP-1.jpg',
      BASE + '2023/07/00-Externo-03-CROP-1.jpg',
      BASE + '2023/07/Cafetaria-01-BAIXA-CROP-SAT-BAIXA-2.jpg',
      BASE + '2023/07/Estante-01-BAIXA-2-SAT-BAIXA.jpg',
      BASE + '2023/07/Cafetaria-07-BAIXA-CROP-02-SAT-2.jpg',
    ],
    regiao: 'rio',
  },
  {
    id: 'metropolitano',
    nome: 'Shopping Metropolitano',
    endereco: 'Av. Embaixador Abelardo Bueno 1.300, Loja 2027',
    bairro: 'Barra da Tijuca, Rio de Janeiro | RJ',
    horario1: 'Segunda a sexta de 11h às 20h',
    horario2: 'Sábados, domingos e feriados de 12h às 20h',
    whatsapp: '5521999575839',
    telefone: '(21) 3500-5743',
    email: 'dtmetro@delirio.com.br',
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9710475,-43.3749233,17z/data=!3m1!4b1!4m6!3m5!1s0x9bd97e850594df:0xc631567eecfced2b!8m2!3d-22.9710525!4d-43.3723484!16s%2Fg%2F11cjp83hb3?entry=ttu',
    ifoodUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical-shopping-metropolitano-barra-da-tijuca/4213c6b1-f67f-489a-88b5-bf831cc0b2a1',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/9d7d132a-ca39-4c4e-90ac-7aaa891376d5',
    fotos: [
      BASE + '2023/07/Delirio-Tropical-Shopping-Metropolitano-38-Editar.webp',
      BASE + '2023/07/Delirio-Tropical-Shopping-Metropolitano-106-Editar.webp',
      BASE + '2023/07/Delirio-Tropical-Shopping-Metropolitano-120-Editar-2.webp',
      BASE + '2023/07/Delirio-Tropical-Shopping-Metropolitano-127-Editar.webp',
      BASE + '2023/07/Delirio-Tropical-Shopping-Metropolitano-147-Editar.webp',
      BASE + '2023/07/Delirio-Tropical-Shopping-Metropolitano-164-Editar.webp',
    ],
    regiao: 'rio',
  },
  {
    id: 'niteroi',
    nome: 'Plaza Niterói',
    endereco: 'Rua Quinze de Novembro, 8 – Loja 323A',
    bairro: 'Centro, Niterói | RJ',
    horario1: 'Segunda a sábado de 11h às 22h',
    horario2: 'Domingos e feriados de 12h às 21h',
    whatsapp: '5521997793453',
    telefone: '(21) 2391-7900',
    email: 'dtniteroi@delirio.com.br',
    mapsUrl: 'https://maps.app.goo.gl/ohds9roGK72xjBAp6',
    ifoodUrl: 'https://www.ifood.com.br/delivery/niteroi-rj/delirio-tropical---plaza-niteroi-centro/da55ee43-c11a-4914-b4c2-0e173a028871',
    cardapioUrl: 'https://cardapiodigital.delirio.com.br/delirio/40e7e5e6-e7ce-488c-98c4-afabf650e969',
    fotos: [
      BASE + '2024/02/Delirio-Tropical-Plaza-Niteroi-223-Editar.jpg',
      BASE + '2024/02/Capa-CROP.jpg',
      BASE + '2024/02/Cafeteria-01-CROP.jpg',
      BASE + '2024/02/Frente-letreiro-CROP-02.jpg',
      BASE + '2024/02/Frente-letreiro-lateral-CROP-01-1.jpg',
      BASE + '2024/02/Delirio-Tropical-Plaza-Niteroi-46-Editar.jpg',
      BASE + '2024/02/Delirio-Tropical-Plaza-Niteroi-55-Editar.jpg',
      BASE + '2024/02/Delirio-Tropical-Plaza-Niteroi-89-Editar.jpg',
    ],
    regiao: 'niteroi',
  },
]

/* ─── Ícones ─── */
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}
function IconDelivery() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  )
}
function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
    </svg>
  )
}
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  )
}
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  )
}

/* ─── Carrossel de fotos ─── */
function FotoCarousel({ fotos, nome }: { fotos: string[]; nome: string }) {
  const [idx, setIdx] = useState(0)
  const total = fotos.length
  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  return (
    <div className="loja-carousel">
      <div className="loja-carousel__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={fotos[idx]}
          src={fotos[idx]}
          alt={`${nome} — foto ${idx + 1} de ${total}`}
          loading="lazy"
        />
        {total > 1 && (
          <>
            <button className="loja-carousel__arrow loja-carousel__arrow--prev" onClick={prev} aria-label="Foto anterior">‹</button>
            <button className="loja-carousel__arrow loja-carousel__arrow--next" onClick={next} aria-label="Próxima foto">›</button>
          </>
        )}
      </div>

      {/* Bolinhas */}
      {total > 1 && (
        <div className="loja-carousel__dots">
          {fotos.map((_, i) => (
            <button
              key={i}
              className={`loja-carousel__dot${i === idx ? ' loja-carousel__dot--active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Card de loja ─── */
function LojaCard({ loja }: { loja: Loja }) {
  return (
    <article className="loja-card">

      {/* ── Topo: nome+endereço esquerda / botões direita ── */}
      <div className="loja-card__top">
        <div className="loja-card__identity">
          <h2 className="loja-card__nome">{loja.nome}</h2>
          <p className="loja-card__endereco">{loja.endereco}</p>
          <p className="loja-card__bairro">{loja.bairro}</p>
        </div>

        <div className="loja-card__actions">
          <a href={loja.mapsUrl} target="_blank" rel="noopener" className="loja-action" aria-label="Como chegar">
            <span className="loja-action__circle"><IconPin /></span>
            <span className="loja-action__label">COMO CHEGAR</span>
          </a>
          <a href={loja.ifoodUrl} target="_blank" rel="noopener" className="loja-action" aria-label="Delivery">
            <span className="loja-action__circle"><IconDelivery /></span>
            <span className="loja-action__label">DELIVERY</span>
          </a>
          {loja.cardapioUrl ? (
            <a href={loja.cardapioUrl} target="_blank" rel="noopener" className="loja-action" aria-label="Ver cardápio">
              <span className="loja-action__circle"><IconMenu /></span>
              <span className="loja-action__label">VER CARDÁPIO</span>
            </a>
          ) : (
            <span className="loja-action loja-action--disabled" aria-hidden="true">
              <span className="loja-action__circle"><IconMenu /></span>
              <span className="loja-action__label">VER CARDÁPIO</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Carrossel full-width ── */}
      <FotoCarousel fotos={loja.fotos} nome={loja.nome} />

      {/* ── Horários e contatos ── */}
      <div className="loja-card__details">
        <div className="loja-card__horario">
          <h3 className="loja-card__section-title">Horário de Funcionamento</h3>
          <p>{loja.horario1}</p>
          {loja.horario2 && <p>{loja.horario2}</p>}
        </div>

        <div className="loja-card__contatos">
          <h3 className="loja-card__section-title">Contatos</h3>
          <ul className="loja-card__contact-list">
            <li>
              <a
                href={`https://api.whatsapp.com/send?phone=${loja.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="loja-card__contact-link loja-card__contact-link--wa"
              >
                <IconWhatsApp />
                <span>{loja.whatsapp.replace('55', '(').replace(/^\((\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${loja.telefone.replace(/\D/g, '')}`} className="loja-card__contact-link">
                <IconPhone />
                <span>{loja.telefone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${loja.email}`} className="loja-card__contact-link">
                <IconEmail />
                <span>{loja.email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

    </article>
  )
}

/* ─── Componente principal ─── */
export default function LojasClient() {
  const [regiao, setRegiao] = useState<'rio' | 'niteroi'>('rio')
  const lojasFiltradas = LOJAS.filter(l => l.regiao === regiao)

  return (
    <div className="lojas-page">
      <nav className="lojas-tabs" aria-label="Filtrar por cidade">
        <button
          className={`lojas-tabs__btn${regiao === 'rio' ? ' lojas-tabs__btn--active' : ''}`}
          onClick={() => setRegiao('rio')}
        >
          Rio de Janeiro
        </button>
        <button
          className={`lojas-tabs__btn${regiao === 'niteroi' ? ' lojas-tabs__btn--active' : ''}`}
          onClick={() => setRegiao('niteroi')}
        >
          Niterói
        </button>
      </nav>

      <div className="lojas-list">
        {lojasFiltradas.map(loja => (
          <LojaCard key={loja.id} loja={loja} />
        ))}
      </div>
    </div>
  )
}
