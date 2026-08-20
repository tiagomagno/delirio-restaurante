'use client'

import { useState } from 'react'

const INSTITUTOS = [
  {
    title: 'Instituto\nCompartilhar',
    text: 'Motivados pelo amor ao esporte e pela certeza de seu poder transformador, o Instituto Compartilhar foi fundado em 2003 pelo técnico Bernardinho e se trata de uma instituição sem fins lucrativos que oportuniza crianças e adolescentes, prioritariamente estudantes de escolas públicas, a praticarem esporte de forma divertida ao mesmo tempo em que aprendem valores essenciais para a sua formação.',
    link: 'http://compartilhar.org.br/',
    img: '/wp-content/uploads/2023/05/delirio-back-institutocompartilhar.jpg',
  },
  {
    title: 'Instituto\nda Criança',
    text: 'O Instituto da Criança – IC é uma solução para promover o desenvolvimento humano. Por meio do investimento social privado e da gestão de projetos, a organização inspira a prática da solidariedade. Com 25 anos de história, o IC funciona como uma via de aproximação entre pessoas físicas e jurídicas que têm condições e vontade de contribuir, contudo não sabem como fazer este investimento chegar a quem realmente precisa. Anualmente, investe em projetos e campanhas de educação, cidadania, geração de renda e desenvolvimento comunitário. A organização está sediada no Rio de Janeiro e também atua em São Paulo, Paraná e Bahia.',
    link: '#',
    img: '/wp-content/uploads/2023/05/delirio-back-institutocrianca.jpg',
  },
  {
    title: 'F.A.V',
    text: 'A F.A.V. é uma entidade civil, sem fins lucrativos, com sede no Rio de Janeiro que desenvolve um trabalho sócio assistencial junto às famílias de moradores das comunidades carentes no entorno do bairro do Rio Comprido, procurando despertar à auto iniciativa e criando, consequentemente, uma convivência de auto–ajuda para a solução de problemas sócio comunitários.',
    link: '#',
    img: '/wp-content/uploads/2023/05/delirio-back-fav.jpg',
  },
]

export default function InstitutoCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + INSTITUTOS.length) % INSTITUTOS.length)
  const next = () => setCurrent(i => (i + 1) % INSTITUTOS.length)

  const item = INSTITUTOS[current]

  return (
    <section id="social" className="sobre-instituto" aria-label="Projetos Sociais">
      {/* Painel esquerdo — ocupa 50% do viewport */}
      <div className="sobre-instituto__left">
        <div className="sobre-instituto__decor" aria-hidden="true" />
        <div className="sobre-instituto__content">
          <h2 className="sobre-instituto__title">
            {item.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
          </h2>
          <p className="sobre-instituto__desc">{item.text}</p>
          <a href={item.link} target="_blank" rel="noopener" className="sobre-instituto__btn">
            Saiba mais
          </a>
        </div>
      </div>

      {/* Foto — preenche o restante do viewport */}
      <div
        className="sobre-instituto__img"
        style={{ backgroundImage: `url(${item.img})` }}
        role="img"
        aria-label={item.title.replace('\n', ' ')}
      />

      {/* Setas nas bordas da seção */}
      <button className="sobre-instituto__arrow sobre-instituto__arrow--prev" onClick={prev} aria-label="Instituto anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="sobre-instituto__arrow sobre-instituto__arrow--next" onClick={next} aria-label="Próximo instituto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  )
}
