import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const HERO_SLIDES = [
  'https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_7.jpg',
  'https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_6.jpg',
  'https://delirio.com.br/wp-content/uploads/2023/09/banner_delirio_4.jpg',
  'https://delirio.com.br/wp-content/uploads/2023/05/Delirio_slide2.jpg',
]

const STORES = [
  {
    slug: 'assembleia', name: 'Assembléia',
    address: ['Rua da Assembléia, 36'], bairroCity: 'Centro, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/06/Assembleia-Baixa-5x5-591-px.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/06/Balcao-sanduiche-GALERIA-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Fachada-Loja-01-GALERIA-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Balcao-panoramica-GALERIA-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Salao-Frente-GALERIA-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Fachada-Cafe-02-GALERIA-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Salao-fundos-2-piso-01-GALERIA-1.jpg',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Delirio+Tropical/@-22.9046963,-43.1783802,17z/data=!3m1!4b1!4m6!3m5!1s0x997f5f76fcfeab:0x54ffb316f4d0d495!8m2!3d-22.9047013!4d-43.1758053!16s%2Fg%2F1t_wql81?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---assembleia-centro/35dc2a84-b721-4027-a1dc-a03e57124633?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/965e1d05-efa4-48d5-a0f4-fc9fdba6afee',
    hours: ['Segunda a Sexta de 8h às 16h', 'Sáb, Dom e Feriados: Fechado'],
    phones: ['(21) 2242-6369'], whatsapp: '5521997825789', email: 'dtass@delirio.com.br', highlight: true,
  },
  {
    slug: 'tijuca', name: 'Shopping Tijuca',
    address: ['Av. Maracanã, 987, lojas 2 a 5'], bairroCity: 'Tijuca, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/06/Tijuca-Baixa-5x5-591-px.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/07/Salao-01-GALERIA-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Fachada-lateral-GALERIA-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Comodato-GALERIA-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Ripado-GALERIA-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Bancao-arvore-2-GALERIA-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Grab-Go-GALERIA-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Bancao-arvore-GALERIA-2.jpg',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9219506,-43.2381971,17z/data=!3m1!4b1!4m6!3m5!1s0x997f9e4574f7dd:0x4d1cbab29439f7fb!8m2!3d-22.9219556!4d-43.2356222!16s%2Fg%2F11fsk9sld8?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---shopping-tijuca-tijuca/b18046dd-e115-4522-a02e-9d80a680908a?utm_medium=share',
    menuUrl: '',
    hours: ['Segunda a Sábado de 11h às 22h', 'Dom e Feriados de 12h às 21h'],
    phones: ['(21) 2230-5370'], whatsapp: '5521997826115', email: 'dttijuca@delirio.com.br', highlight: false,
  },
  {
    slug: 'rio-sul', name: 'Shopping Rio Sul',
    address: ['Av. Lauro Sodré, 445'], bairroCity: 'Botafogo, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/06/Rio-Sul-Baixa-5x5-591-px.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/07/Mezanino-2-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Fachada-2-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Grab-Go-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Balcao-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Mezanino-1-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Terreo-1-CROP-1.jpg',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9571974,-43.179219,17z/data=!3m2!4b1!5s0x9bd55dbdbbeaf1:0x5da51a53ce815e24!4m6!3m5!1s0x997ff8fde49319:0xaaff47049a289550!8m2!3d-22.9572024!4d-43.1766441!16s%2Fg%2F11bwkyz65d?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---rio-sul-botafogo/a3323936-9ad8-468c-b84d-75b455dca7d4?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/dce05ee3-4573-4a49-9433-a5d12305faad',
    hours: ['Segunda a Sábado de 11h às 22h', 'Dom e Feriados de 12h às 21h'],
    phones: ['(21) 2275-9572'], whatsapp: '5521997699746', email: 'dtriosul@delirio.com.br', highlight: false,
  },
  {
    slug: 'ipanema', name: 'Ipanema',
    address: ["Rua Garcia D'Avila, 48"], bairroCity: 'Ipanema, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/06/Ipanema-Baixa-5x5-591-px.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/07/loja_ipanema_noite-1-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/01-fachada-Ipanema-CO-1-CROP-1-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/02-fachada-Ipanema-CO-20-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/03-Delirio-para-Levar-Ipanema-CROP-03-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Loja_ipanema_noite-3-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/03-Delirio-para-Levar-Ipanema-CROP-01-1.jpg',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical+Ipanema/@-22.9849715,-43.2117153,17z/data=!3m1!4b1!4m6!3m5!1s0x9bd50699c0b129:0x9bacde5344fcab4b!8m2!3d-22.9849765!4d-43.2091404!16s%2Fg%2F1tlbkt3m?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---ipanema-ipanema/8b8ba208-ced2-40fb-95bd-374b5846c376?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/7b9659ef-9dfc-4330-a828-cde89b0753eb',
    hours: ['Todos os dias de 11h às 20h'],
    phones: ['(21) 3624-8164'], whatsapp: '5521971538244', email: 'secretaria.ipa@delirio.com.br', highlight: false,
  },
  {
    slug: 'gavea', name: 'Gávea',
    address: ['Rua Marquês de São Vicente, 68'], bairroCity: 'Gávea, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/06/Gavea-Baixa-5x5-591-px.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/06/Salao-frente-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Salao-de-cima-2-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Salaozinho-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Balcao-frente-2-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Letreiro-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/06/Balcao-de-cima-CROP-1.jpg',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical+G%C3%A1vea/@-22.9760903,-43.2304537,17.5z/data=!4m6!3m5!1s0x9bd5b74672a933:0x42d971772a771430!8m2!3d-22.9759302!4d-43.2287239!16s%2Fg%2F1tghqt95?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---gavea-gavea/96916ae9-f4c2-4315-b4a0-cb2cfb37cd5f?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/2f546851-9d64-4fc0-a2fc-1912df983ecf',
    hours: ['Segunda a Sábado de 11h às 20h', 'Dom e Feriados de 11h às 19h'],
    phones: ['(21) 3624-7055'], whatsapp: '5521997720867', email: 'dtgav@delirio.com.br', highlight: false,
  },
  {
    slug: 'citta-america', name: 'Citta América',
    address: ['Av. das Américas, 700 – Loja 114 B,C,D'], bairroCity: 'Barra da Tijuca, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/07/01-Cafeteria-externa-BAIXA-CROP-SAT.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/07/01-Cafeteria-externa-BAIXA-CROP-SAT.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/02-Fachada-BAIXA-CROP-SAT.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/03-Cafeteria-humanizada-BAIXA-CROP-SAT-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/04-Varanda-BAIXA-CROP-SAT.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/05-Externa-BAIXA-CROP-SAT.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/6-Balcao-BAIXA-CROP-SAT.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/07-Cafeteria-interna-BAIXA-CROP-SAT-1.jpg',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-23.0032836,-43.3232214,17z/data=!3m2!4b1!5s0x9bd9eb6e228109:0x6d6eb20c8c1d5d50!4m6!3m5!1s0x9bd0a519c2424b:0x24efb2ecd8424415!8m2!3d-23.0032886!4d-43.3206465!16s%2Fg%2F11bx1yr71w?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical---citta-america-barra-da-tijuca/d06e794d-928e-4a69-9a8d-12c4671028bf?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/3965d1a1-8830-4cf6-b73f-db3485bd226a',
    hours: ['Segunda a Sábado de 11h às 17h', 'Domingos: Fechado'],
    phones: ['(21) 2132-8007'], whatsapp: '5521997528683', email: 'dtcit@delirio.com.br', highlight: false,
  },
  {
    slug: 'barra-shopping', name: 'Barra Shopping',
    address: ['Av. das Américas, 4666, Loja 150'], bairroCity: 'Barra da Tijuca, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/06/Barra-Baixa-5x5-591-px.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/07/00-Externa-01-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/00-Ripado-01-CROP-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/00-Varanda-01-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/00-Externo-03-CROP-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Cafetaria-01-BAIXA-CROP-SAT-BAIXA-2.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Estante-01-BAIXA-2-SAT-BAIXA.jpg',
      'https://delirio.com.br/wp-content/uploads/2023/07/Cafetaria-07-BAIXA-CROP-02-SAT-2.jpg',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9977871,-43.3633218,17z/data=!3m2!4b1!5s0x9bda386cbb3325:0x1e314697b5c69e65!4m6!3m5!1s0x9bda4776586fe9:0xdc59dba649183dad!8m2!3d-22.9977921!4d-43.3607469!16s%2Fg%2F1vgqf9q3?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical-barra-shopping-barra-da-tijuca/55e7f39e-71f3-4021-abfe-f834f9739dcb?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/24f7ac5d-c0e0-41cc-b971-cffdfdbfcc84',
    hours: ['Segunda a Sábado de 11h às 22h', 'Dom e Feriados de 12h às 21h'],
    phones: ['(21) 3089-1170'], whatsapp: '5521996091856', email: 'dtbshop@delirio.com.br', highlight: false,
  },
  {
    slug: 'metropolitano', name: 'Metropolitano',
    address: ['Av. Embaixador Abelardo Bueno 1.300, Loja 2027'], bairroCity: 'Barra da Tijuca, Rio de Janeiro | RJ', region: 'rio',
    image: 'https://delirio.com.br/wp-content/uploads/2023/07/Metropolitano-Baixa-2-NOVA.webp',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-38-Editar.webp',
      'https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-106-Editar.webp',
      'https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-120-Editar-2.webp',
      'https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-127-Editar.webp',
      'https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-147-Editar.webp',
      'https://delirio.com.br/wp-content/uploads/2023/07/Delirio-Tropical-Shopping-Metropolitano-164-Editar.webp',
    ],
    mapsUrl: 'https://www.google.com.br/maps/place/Del%C3%ADrio+Tropical/@-22.9710475,-43.3749233,17z/data=!3m1!4b1!4m6!3m5!1s0x9bd97e850594df:0xc631567eecfced2b!8m2!3d-22.9710525!4d-43.3723484!16s%2Fg%2F11cjp83hb3?entry=ttu',
    deliveryUrl: 'https://www.ifood.com.br/delivery/rio-de-janeiro-rj/delirio-tropical-shopping-metropolitano-barra-da-tijuca/4213c6b1-f67f-489a-88b5-bf831cc0b2a1?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/9d7d132a-ca39-4c4e-90ac-7aaa891376d5',
    hours: ['Segunda a Sexta de 11h às 20h', 'Sáb, Dom e Feriados de 12h às 20h'],
    phones: ['(21) 3500-5743'], whatsapp: '5521999575839', email: 'dtmetro@delirio.com.br', highlight: false,
  },
  {
    slug: 'plaza-niteroi', name: 'Plaza Niterói',
    address: ['Rua Quinze de Novembro, 8 – Loja 323A'], bairroCity: 'Centro, Niterói | RJ', region: 'niteroi',
    image: 'https://delirio.com.br/wp-content/uploads/2023/06/Plaza-Niteroi-Baixa-5x5-591-px.jpg',
    photos: [
      'https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-223-Editar.jpg',
      'https://delirio.com.br/wp-content/uploads/2024/02/Capa-CROP.jpg',
      'https://delirio.com.br/wp-content/uploads/2024/02/Cafeteria-01-CROP.jpg',
      'https://delirio.com.br/wp-content/uploads/2024/02/Frente-letreiro-CROP-02.jpg',
      'https://delirio.com.br/wp-content/uploads/2024/02/Frente-letreiro-lateral-CROP-01-1.jpg',
      'https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-46-Editar.jpg',
      'https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-55-Editar.jpg',
      'https://delirio.com.br/wp-content/uploads/2024/02/Delirio-Tropical-Plaza-Niteroi-89-Editar.jpg',
    ],
    mapsUrl: 'https://maps.app.goo.gl/ohds9roGK72xjBAp6',
    deliveryUrl: 'https://www.ifood.com.br/delivery/niteroi-rj/delirio-tropical---plaza-niteroi-centro/da55ee43-c11a-4914-b4c2-0e173a028871?utm_medium=share',
    menuUrl: 'https://cardapiodigital.delirio.com.br/delirio/40e7e5e6-e7ce-488c-98c4-afabf650e969',
    hours: ['Segunda a Sábado de 11h às 22h', 'Dom e Feriados de 12h às 21h'],
    phones: ['(21) 2391-7900'], whatsapp: '5521997793453', email: 'dtniteroi@delirio.com.br', highlight: false,
  },
]

const CONTENT = [
  // ── Global (layout) ──
  { page: 'global', key: 'title.default', label: 'Título padrão do site', value: 'Delírio Tropical — Restaurante Saudável desde 1983' },
  { page: 'global', key: 'description', label: 'Descrição padrão (SEO)', value: 'Culinária natural, fresca e saborosa desde 1983. Lojas no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos.' },

  // ── Home ──
  { page: 'home', key: 'meta.title', label: 'Título (SEO)', value: 'Delírio Tropical — Restaurante Saudável desde 1983' },
  { page: 'home', key: 'meta.description', label: 'Descrição (SEO)', value: 'Culinária natural, fresca e saborosa no Rio de Janeiro e Niterói. Encomendas online, delivery e eventos corporativos personalizados.' },
  { page: 'home', key: 'hero.cta', label: 'Botão do banner principal', value: 'veja o cardápio do dia' },
  { page: 'home', key: 'escolha.title', label: 'Título da seção "Escolha a opção"', value: 'Escolha a opção que melhor lhe atende' },
  { page: 'home', key: 'escolha.encomendas.desc', label: 'Texto do card Encomendas', value: 'Faça seu pedido por aqui, receba em casa\nou agende a retirada na loja mais próxima' },
  { page: 'home', key: 'escolha.encomendas.cta', label: 'Botão do card Encomendas', value: 'Faça seu pedido' },
  { page: 'home', key: 'escolha.eventos.label', label: 'Rótulo do card Eventos', value: 'Eventos\nCorporativos\ne Familiares' },
  { page: 'home', key: 'escolha.eventos.desc', label: 'Texto do card Eventos', value: 'Contate nossa equipe para\nauxiliá-lo na criação de seu evento' },
  { page: 'home', key: 'escolha.eventos.cta', label: 'Botão do card Eventos', value: 'Solicite um orçamento' },
  { page: 'home', key: 'historia.title', label: 'Título "Desde 1983"', value: 'Desde\n1983' },
  { page: 'home', key: 'historia.text', label: 'Parágrafo "Desde 1983"', value: 'Todos os dias, preparamos uma comida fresca, leve e muito saborosa com amor e carinho.' },
  { page: 'home', key: 'historia.cta', label: 'Botão "Saiba Mais"', value: 'Saiba Mais' },

  // ── Sobre Nós ──
  { page: 'sobre-nos', key: 'meta.title', label: 'Título (SEO)', value: 'Sobre Nós' },
  { page: 'sobre-nos', key: 'meta.description', label: 'Descrição (SEO)', value: 'Conheça a história do Delírio Tropical, nascido em 1983 no centro do Rio de Janeiro.' },
  { page: 'sobre-nos', key: 'sust.title', label: 'Título Sustentabilidade', value: 'Nosso jeitinho\nDelírio de ser...\nmais sustentável!' },
  { page: 'sobre-nos', key: 'sust.intro', label: 'Texto Sustentabilidade', value: 'Acreditamos em um futuro melhor, com alimentação segura e saudável para todos. Por isso, investimos em ações que caminham juntos na mesma direção. Venha conhecer alguns dos selos e parceiros que garantem a qualidade de nosso trabalho.' },
  { page: 'sobre-nos', key: 'sust.cta', label: 'Botão Sustentabilidade', value: 'Acompanhe em nossas redes' },
  { page: 'sobre-nos', key: 'rancho.card1.text', label: 'Texto card Rancho 1 (plantação)', value: 'Com o passar dos anos, aprendemos a plantar, cultivar e colher, por isso muitos dos nossos alimentos provém de nossa horta orgânica.' },
  { page: 'sobre-nos', key: 'rancho.card2.text', label: 'Texto card Rancho 2 (compostagem)', value: 'Os resíduos orgânicos de nossas lojas viram adubo por meio da compostagem. Venha conhecer por trás desse processo!' },
  { page: 'sobre-nos', key: 'rancho.card3.text', label: 'Texto card Rancho 3 (alimentos)', value: 'Grande parte do segredo de nossas comida ser tão gostosa está aqui, nos cuidados com os alimentos desde o plantio, até a sua mesa.' },
  { page: 'sobre-nos', key: 'rancho.title', label: 'Título "Conheça o rancho"', value: 'Conheça\no rancho' },
  { page: 'sobre-nos', key: 'rancho.desc', label: 'Texto "Conheça o rancho"', value: 'Valorizamos a proveniência dos alimentos. Nossa relação com o Rancho São Francisco é uma parceria de longa data onde cultivamos nossos alimentos orgânicos.' },
  { page: 'sobre-nos', key: 'livro.title', label: 'Título Livro', value: 'Livro\nDelírio Tropical' },
  { page: 'sobre-nos', key: 'livro.desc', label: 'Texto Livro', value: 'Há 4 décadas, nascia o Delírio Tropical com um sonho simples: levar comida leve, saudável e cheia de sabor para os cariocas. Esse sonho cresceu, atravessou gerações e se tornou parte da história da Cidade Maravilhosa. Essa jornada esta registrada em nosso livro especial de 40 anos, uma coleção receitas e sabores que contam histórias.' },
  { page: 'sobre-nos', key: 'livro.cta', label: 'Botão Livro', value: 'Acesse e leve o Delírio para sua casa' },

  // ── Lojas ──
  { page: 'lojas', key: 'meta.title', label: 'Título (SEO)', value: 'Lojas' },
  { page: 'lojas', key: 'meta.description', label: 'Descrição (SEO)', value: 'Encontre a loja Delírio Tropical mais próxima de você. Unidades em Assembléia, Tijuca, Rio Sul, Ipanema, Gávea, Citta América, Barra Shopping, Metropolitano (RJ) e Plaza Niterói.' },
  { page: 'lojas', key: 'hero.title', label: 'Título do topo', value: 'Nossas Lojas' },
  { page: 'lojas', key: 'hero.subtitle', label: 'Subtítulo do topo', value: 'Rio de Janeiro e Niterói — encontre a loja mais próxima de você' },

  // ── Encomendas ──
  { page: 'encomendas', key: 'meta.title', label: 'Título (SEO)', value: 'Encomendas' },
  { page: 'encomendas', key: 'hero.title', label: 'Título do topo', value: 'Encomendas' },
  { page: 'encomendas', key: 'hero.subtitle', label: 'Subtítulo do topo', value: 'Peça nossos pratos favoritos para entregar onde você quiser' },
  { page: 'encomendas', key: 'opcoes.title', label: 'Título "Escolha como prefere"', value: 'Escolha como prefere' },
  { page: 'encomendas', key: 'opcoes.subtitle', label: 'Subtítulo "Escolha como prefere"', value: 'Encomende para receber em casa ou para seu evento corporativo e familiar' },
  { page: 'encomendas', key: 'card1.title', label: 'Título card Delivery', value: 'Peça pelo delivery' },
  { page: 'encomendas', key: 'card1.desc', label: 'Texto card Delivery', value: 'Faça seu pedido por aqui, receba em casa ou agende a retirada na loja mais próxima de você.' },
  { page: 'encomendas', key: 'card1.cta', label: 'Botão card Delivery', value: 'Fazer meu pedido' },
  { page: 'encomendas', key: 'card2.title', label: 'Título card Eventos', value: 'Eventos e confraternizações' },
  { page: 'encomendas', key: 'card2.desc', label: 'Texto card Eventos', value: 'Nossa equipe está pronta para auxiliá-lo na criação do menu perfeito para o seu evento.' },
  { page: 'encomendas', key: 'card2.cta', label: 'Botão card Eventos', value: 'Solicitar orçamento' },
  { page: 'encomendas', key: 'info.title', label: 'Título "Por que encomendar"', value: 'Por que encomendar com a gente?' },
  { page: 'encomendas', key: 'info.stat1.num', label: 'Estatística 1 — número', value: '+40' },
  { page: 'encomendas', key: 'info.stat1.label', label: 'Estatística 1 — legenda', value: 'Anos servindo\no Rio de Janeiro' },
  { page: 'encomendas', key: 'info.stat2.num', label: 'Estatística 2 — número', value: '9' },
  { page: 'encomendas', key: 'info.stat2.label', label: 'Estatística 2 — legenda', value: 'Lojas para\nretirada rápida' },
  { page: 'encomendas', key: 'info.stat3.num', label: 'Estatística 3 — número', value: '100%' },
  { page: 'encomendas', key: 'info.stat3.label', label: 'Estatística 3 — legenda', value: 'Ingredientes frescos\npreparados no dia' },

  // ── Trabalhe Conosco ──
  { page: 'trabalhe-conosco', key: 'meta.title', label: 'Título (SEO)', value: 'Trabalhe com a Gente' },
  { page: 'trabalhe-conosco', key: 'meta.description', label: 'Descrição (SEO)', value: 'Faça parte da equipe Delírio Tropical. Confira as vagas disponíveis para atendente, auxiliar de cozinha, saladeiro, cozinheiro e mais. Candidate-se agora.' },
  { page: 'trabalhe-conosco', key: 'hero.title', label: 'Título do topo', value: 'Trabalhe com a Gente' },
  { page: 'trabalhe-conosco', key: 'hero.subtitle', label: 'Subtítulo do topo', value: 'Faça parte da nossa equipe' },
  { page: 'trabalhe-conosco', key: 'form.title', label: 'Título do formulário', value: 'Trabalhe com a Gente' },
  { page: 'trabalhe-conosco', key: 'form.description', label: 'Texto introdutório do formulário', value: 'Nossa missão é servir nossos clientes diariamente com muito amor. Trabalhando no Delírio Tropical você poderá exercer esse lindo ofício e perceber da importância do cuidado com as pessoas. Nossos primeiros clientes são nossos colaboradores, e damos oportunidade de crescimento para todas as pessoas da nossa equipe.' },

  // ── Eventos Corporativos ──
  { page: 'eventos-corporativos', key: 'meta.title', label: 'Título (SEO)', value: 'Eventos Corporativos' },
  { page: 'eventos-corporativos', key: 'meta.description', label: 'Descrição (SEO)', value: 'Planeje seu evento corporativo ou familiar com o Delírio Tropical. Cardápio personalizado, atendimento exclusivo e sugestões feitas pelo gerente da loja escolhida.' },
  { page: 'eventos-corporativos', key: 'hero.title', label: 'Título do topo', value: 'Eventos Corporativos' },
  { page: 'eventos-corporativos', key: 'hero.subtitle', label: 'Subtítulo do topo', value: 'Cardápio personalizado para o evento da sua empresa' },
  { page: 'eventos-corporativos', key: 'form.title', label: 'Título do formulário', value: 'Faça o seu evento com o Delírio!' },
  { page: 'eventos-corporativos', key: 'form.description', label: 'Texto introdutório do formulário', value: 'Preparamos um cardápio personalizado para o evento da sua empresa.\nO gerente da loja escolhida vai entrar em contato com um cardápio e\nsugestões personalizadas para o seu evento!' },

  // ── Fale Conosco ──
  { page: 'fale-conosco', key: 'meta.title', label: 'Título (SEO)', value: 'Fale Conosco' },
  { page: 'fale-conosco', key: 'meta.description', label: 'Descrição (SEO)', value: 'Entre em contato com a loja Delírio Tropical de sua preferência. Envie sua mensagem e nossa equipe retornará em breve.' },
  { page: 'fale-conosco', key: 'hero.title', label: 'Título do topo', value: 'Fale Conosco' },
  { page: 'fale-conosco', key: 'hero.subtitle', label: 'Subtítulo do topo', value: 'Assim poderemos servir ainda melhor' },
  { page: 'fale-conosco', key: 'form.title', label: 'Título do formulário', value: 'Envie sua mensagem' },
  { page: 'fale-conosco', key: 'form.description', label: 'Texto introdutório do formulário', value: 'Preencha o formulário abaixo e nossa equipe entrará em contato em breve.' },

  // ── Ouvidoria ──
  { page: 'ouvidoria', key: 'meta.title', label: 'Título (SEO)', value: 'Ouvidoria' },
  { page: 'ouvidoria', key: 'meta.description', label: 'Descrição (SEO)', value: 'Canal anônimo de ouvidoria do Delírio Tropical. Compartilhe sua opinião de forma confidencial. Sua voz é importante para a melhoria contínua dos nossos serviços.' },
  { page: 'ouvidoria', key: 'hero.title', label: 'Título do topo', value: 'Ouvidoria' },
  { page: 'ouvidoria', key: 'hero.subtitle', label: 'Subtítulo do topo', value: 'Sua voz é importante para nós' },

  // ── Uso e Privacidade ──
  { page: 'uso-e-privacidade', key: 'meta.title', label: 'Título (SEO)', value: 'Uso e Privacidade' },
  { page: 'uso-e-privacidade', key: 'meta.description', label: 'Descrição (SEO)', value: 'Política de privacidade e termos de uso do Delírio Tropical. Saiba como coletamos, usamos e protegemos suas informações pessoais.' },
  { page: 'uso-e-privacidade', key: 'hero.title', label: 'Título do topo', value: 'Uso e Privacidade' },
  { page: 'uso-e-privacidade', key: 'hero.subtitle', label: 'Subtítulo do topo', value: 'Política de privacidade do Delírio Tropical' },
  { page: 'uso-e-privacidade', key: 'intro.title', label: 'Título introdução', value: 'Política de privacidade para Delírio Tropical' },
  { page: 'uso-e-privacidade', key: 'intro.p1', label: 'Introdução — parágrafo 1', value: 'Todas as suas informações pessoais recolhidas, serão usadas para o ajudar a tornar a sua visita no nosso site o mais produtiva e agradável possível.' },
  { page: 'uso-e-privacidade', key: 'intro.p2', label: 'Introdução — parágrafo 2', value: 'A garantia da confidencialidade dos dados pessoais dos utilizadores do nosso site é importante para o Delírio Tropical.' },
  { page: 'uso-e-privacidade', key: 'intro.p3', label: 'Introdução — parágrafo 3', value: 'Todas as informações pessoais relativas a membros, assinantes, clientes ou visitantes que usem o Delírio Tropical serão tratadas em concordância com a Lei da Proteção de Dados Pessoais de 26 de outubro de 1998 (Lei n.º 67/98).' },
  { page: 'uso-e-privacidade', key: 'intro.p4', label: 'Introdução — parágrafo 4', value: 'A informação pessoal recolhida pode incluir o seu nome, e-mail, número de telefone e/ou telemóvel, morada, data de nascimento e/ou outros.' },
  { page: 'uso-e-privacidade', key: 'intro.p5', label: 'Introdução — parágrafo 5', value: 'O uso do Delírio Tropical pressupõe a aceitação deste Acordo de privacidade. A equipa do Delírio Tropical reserva-se ao direito de alterar este acordo sem aviso prévio. Deste modo, recomendamos que consulte a nossa política de privacidade com regularidade de forma a estar sempre atualizado.' },
  { page: 'uso-e-privacidade', key: 'anuncios.title', label: 'Título "Os anúncios"', value: 'Os anúncios' },
  { page: 'uso-e-privacidade', key: 'anuncios.p1', label: 'Texto "Os anúncios"', value: 'Tal como outros websites, coletamos e utilizamos informação contida nos anúncios. A informação contida nos anúncios inclui o seu endereço IP (Internet Protocol), o seu ISP (Internet Service Provider), o browser que utilizou ao visitar o nosso website, o tempo da sua visita e que páginas visitou dentro do nosso website.' },
  { page: 'uso-e-privacidade', key: 'dart.title', label: 'Título "Cookie DoubleClick Dart"', value: 'Cookie DoubleClick Dart' },
  { page: 'uso-e-privacidade', key: 'dart.p1', label: 'Texto "Cookie DoubleClick Dart"', value: 'O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso website. Com o cookie DART, o Google pode exibir anúncios com base nas visitas que o leitor fez a outros websites na Internet. Os utilizadores podem desativar o cookie DART visitando a Política de privacidade da rede de conteúdo e dos anúncios do Google.' },
  { page: 'uso-e-privacidade', key: 'cookies.title', label: 'Título "Os Cookies e Web Beacons"', value: 'Os Cookies e Web Beacons' },
  { page: 'uso-e-privacidade', key: 'cookies.p1', label: 'Cookies — parágrafo 1', value: 'Utilizamos cookies para armazenar informação, tais como as suas preferências pessoais quando visita o nosso website. Isto poderá incluir um simples popup, ou uma ligação em vários serviços que providenciamos, tais como fóruns.' },
  { page: 'uso-e-privacidade', key: 'cookies.p2', label: 'Cookies — parágrafo 2', value: 'Em adição também utilizamos publicidade de terceiros no nosso website para suportar os custos de manutenção. Alguns destes publicitários, poderão utilizar tecnologias como os cookies e/ou web beacons quando publicitam no nosso website, o que fará com que esses publicitários (como o Google através do Google AdSense) também recebam o seu endereço IP pessoal.' },
  { page: 'uso-e-privacidade', key: 'terceiros.title', label: 'Título "Ligações a Sites de Terceiros"', value: 'Ligações a Sites de Terceiros' },
  { page: 'uso-e-privacidade', key: 'terceiros.p1', label: 'Terceiros — parágrafo 1', value: 'O Delírio Tropical possui ligações para outros sites, os quais, a nosso ver, podem conter informações úteis para os nossos visitantes. A nossa política de privacidade não é aplicada a sites de terceiros, pelo que, caso visite outro site a partir do nosso deverá ler a politica de privacidade do mesmo.' },
  { page: 'uso-e-privacidade', key: 'terceiros.p2', label: 'Terceiros — parágrafo 2', value: 'Não nos responsabilizamos pela política de privacidade ou conteúdo presente nesses mesmos sites.' },
]

async function main() {
  // Admin user
  const email = (process.env.ADMIN_SEED_EMAIL || 'admin@delirio.com.br').toLowerCase().trim()
  const password = process.env.ADMIN_SEED_PASSWORD || 'troque-esta-senha'
  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.adminUser.create({ data: { email, passwordHash } })
    console.log(`Admin criado: ${email}`)
  } else {
    console.log(`Admin já existe: ${email}`)
  }

  // Hero slides
  const slideCount = await prisma.heroSlide.count()
  if (slideCount === 0) {
    for (let i = 0; i < HERO_SLIDES.length; i++) {
      await prisma.heroSlide.create({ data: { imageUrl: HERO_SLIDES[i], order: i } })
    }
    console.log(`${HERO_SLIDES.length} slides do banner criados`)
  }

  // Stores
  for (let i = 0; i < STORES.length; i++) {
    const s = STORES[i]
    await prisma.store.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, order: i },
    })
  }
  console.log(`${STORES.length} lojas seedadas`)

  // Page content
  for (const c of CONTENT) {
    await prisma.pageContent.upsert({
      where: { page_key: { page: c.page, key: c.key } },
      update: {},
      create: c,
    })
  }
  console.log(`${CONTENT.length} textos seedados`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
