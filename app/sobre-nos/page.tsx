import Link from 'next/link'

export const metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a história do Delírio Tropical, nascido em 1983 no centro do Rio de Janeiro. Nossos valores, projetos sociais e o compromisso com sustentabilidade e alimentação saudável.',
}

export default function SobreNos() {
  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">Sobre Nós</h1>
        <p className="page-hero__subtitle">Uma história de amor desde 1983</p>
      </div>

      {/* ── Anchor Nav ── */}
      <nav className="sobre-nav" aria-label="Seções da página">
        <a href="#nossahistoria" className="sobre-nav__link">Nossa História</a>
        <a href="#sustentabilidade" className="sobre-nav__link">Sustentabilidade</a>
        <a href="#social" className="sobre-nav__link">Projetos Sociais</a>
        <a href="#rancho" className="sobre-nav__link">Rancho</a>
      </nav>

      {/* ── Nossa História ── */}
      <section id="nossahistoria" className="sobre-historia" aria-label="Nossa história">
        <div className="sobre-historia__img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://delirio.com.br/wp-content/uploads/2023/05/delirio-assembleia-1985.webp"
            alt="Equipe Delírio Tropical em 1985"
          />
        </div>
        <div className="sobre-historia__text">
          <p className="sobre-historia__label">Nossa História</p>
          <h2 className="sobre-historia__title">
            Em 1983 nasce uma<br />história de amor
          </h2>
          <div className="sobre-historia__body">
            <p>
              Em pleno centro do Rio de Janeiro, a primeira loja da Rua da Assembleia surpreende com uma comida leve, saudável e em harmonia com o clima tropical.
            </p>
            <p>
              Desde então, o Delírio Tropical tornou-se querido dos cariocas e ícone para os visitantes da cidade maravilhosa. O &ldquo;Delírio&rdquo; não parou de crescer e inovar, sendo sempre fiel aos seus valores, crenças e princípios.
            </p>
          </div>
        </div>
      </section>

      {/* ── Nossos Valores ── */}
      <section className="sobre-valores" aria-label="Nossos valores">
        <h2 className="sobre-valores__title">Nossos Valores</h2>
        <div className="sobre-valores__grid">
          <div className="sobre-valor">
            <div className="sobre-valor__icon">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            </div>
            <h3 className="sobre-valor__name">Verdade</h3>
            <p className="sobre-valor__desc">Somos verdadeiros em tudo que fazemos. Acreditamos no potencial das gerações futuras.</p>
          </div>
          <div className="sobre-valor">
            <div className="sobre-valor__icon">
              <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <h3 className="sobre-valor__name">Amor</h3>
            <p className="sobre-valor__desc">O resto é fruto de muito amor, trabalho e dedicação. Graças a uma equipe feliz e ingredientes selecionados.</p>
          </div>
          <div className="sobre-valor">
            <div className="sobre-valor__icon">
              <svg viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
            </div>
            <h3 className="sobre-valor__name">Tradição</h3>
            <p className="sobre-valor__desc">Servimos uma comida fresca e saudável com a informalidade e rapidez que nosso mundo exige.</p>
          </div>
        </div>
      </section>

      {/* ── Um Estilo de Vida ── */}
      <section className="sobre-estilo" aria-label="Um estilo de vida">
        <div className="sobre-estilo__inner">
          <div className="sobre-estilo__text">
            <p className="sobre-historia__label">Um Estilo de Vida</p>
            <h2 className="sobre-historia__title">Os seres brasileiros<br />nos inspiram</h2>
            <p className="sobre-historia__body">
              Somos urbanos, praianos, trabalhadores conectados com a natureza. Sempre procuramos estar à frente, não temos medo de mudanças. Servimos para todos uma comida feita com amor.
            </p>
          </div>
          <div className="sobre-estilo__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://delirio.com.br/wp-content/uploads/2023/05/Livro-Balcao-02-CROP-1024x830.jpg" alt="Livro Delírio Tropical 40 anos" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── Sustentabilidade ── */}
      <section id="sustentabilidade" className="sobre-sustentabilidade" aria-label="Sustentabilidade">
        <h2 className="sobre-valores__title">Nosso jeitinho Delírio<br />de ser mais sustentável!</h2>
        <p className="sobre-section-intro">
          Acreditamos em um futuro melhor, com alimentação segura e saudável para todos. Por isso, investimos em ações que caminham juntos na mesma direção.
        </p>
        <div className="sobre-parceiros">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-rancho-francisco.jpg" alt="Rancho São Francisco" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-eureciclo.jpg" alt="Eureciclo" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-eva-energia.jpg" alt="EVA Energia" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-teiares.jpg" alt="Teiares" loading="lazy" />
        </div>
        <a href="https://www.instagram.com/deliriotropical" target="_blank" rel="noopener" className="sobre-cta__btn sobre-cta__btn--outline">
          Acompanhe em nossas redes
        </a>
      </section>

      {/* ── Projetos Sociais ── */}
      <section id="social" className="sobre-valores" aria-label="Projetos sociais">
        <h2 className="sobre-valores__title">Projetos Sociais</h2>
        <div className="sobre-valores__grid">
          <div className="sobre-valor">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://delirio.com.br/wp-content/uploads/2023/05/delirio-instituto-compartilhar.png" alt="Instituto Compartilhar" className="sobre-valor__logo" loading="lazy" />
            <h3 className="sobre-valor__name">Instituto Compartilhar</h3>
            <p className="sobre-valor__desc">
              Fundado em 2003 pelo técnico Bernardinho, o Instituto Compartilhar oportuniza crianças e adolescentes a praticarem esporte ao mesmo tempo em que aprendem valores essenciais para a sua formação.
            </p>
            <a href="http://compartilhar.org.br/" target="_blank" rel="noopener" className="sobre-valor__link">Saiba mais →</a>
          </div>
          <div className="sobre-valor">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://delirio.com.br/wp-content/uploads/2023/05/delirio-instituto-crianca.png" alt="Instituto da Criança" className="sobre-valor__logo" loading="lazy" />
            <h3 className="sobre-valor__name">Instituto da Criança</h3>
            <p className="sobre-valor__desc">
              Com 25 anos de história, o IC inspira a prática da solidariedade conectando pessoas que desejam contribuir com projetos de educação, cidadania e desenvolvimento comunitário no Rio de Janeiro.
            </p>
          </div>
          <div className="sobre-valor">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://delirio.com.br/wp-content/uploads/2023/05/delirio-fav.png" alt="F.A.V" className="sobre-valor__logo" loading="lazy" />
            <h3 className="sobre-valor__name">F.A.V</h3>
            <p className="sobre-valor__desc">
              Entidade civil sem fins lucrativos que desenvolve trabalho socioassistencial junto às famílias de comunidades no entorno do Rio Comprido, criando convivência de auto-ajuda para solução de problemas comunitários.
            </p>
          </div>
        </div>
      </section>

      {/* ── Rancho ── */}
      <section id="rancho" className="sobre-rancho" aria-label="Rancho São Francisco">
        <div className="sobre-rancho__inner">
          <div className="sobre-rancho__text">
            <p className="sobre-historia__label">Do campo à mesa</p>
            <h2 className="sobre-historia__title">Conheça<br />o rancho</h2>
            <p className="sobre-rancho__desc">
              Valorizamos a proveniência dos alimentos. Nossa relação com o Rancho São Francisco é uma parceria de longa data onde cultivamos nossos alimentos orgânicos.
            </p>
            <ul className="sobre-rancho__list">
              <li>Com o passar dos anos, aprendemos a plantar, cultivar e colher — muitos dos nossos alimentos provêm de nossa horta orgânica.</li>
              <li>Os resíduos orgânicos de nossas lojas viram adubo por meio da compostagem.</li>
              <li>Grande parte do segredo da nossa comida estar tão gostosa está nos cuidados com os alimentos desde o plantio até a sua mesa.</li>
            </ul>
          </div>
          <div className="sobre-rancho__logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://delirio.com.br/wp-content/uploads/2023/07/logo-rancho-francisco.jpg" alt="Rancho São Francisco" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── Livro ── */}
      <section className="sobre-livro" aria-label="Livro Delírio Tropical 40 anos">
        <div className="sobre-livro__inner">
          <div className="sobre-livro__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://delirio.com.br/wp-content/uploads/2023/05/Livro-Balcao-02-CROP-1024x830.jpg" alt="Livro Delírio Tropical 40 anos" loading="lazy" />
          </div>
          <div className="sobre-livro__text">
            <p className="sobre-historia__label">40 anos de história</p>
            <h2 className="sobre-historia__title">Livro<br />Delírio Tropical</h2>
            <p className="sobre-livro__desc">
              Há 4 décadas, nascia o Delírio Tropical com um sonho simples: levar comida leve, saudável e cheia de sabor para os cariocas. Esse sonho cresceu, atravessou gerações e se tornou parte da história da Cidade Maravilhosa. Essa jornada está registrada em nosso livro especial de 40 anos, uma coleção de receitas e sabores que contam histórias.
            </p>
            <a href="https://delirio.com.br" target="_blank" rel="noopener" className="sobre-cta__btn">
              Acesse e leve o Delírio para sua casa
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sobre-cta" aria-label="Venha nos visitar">
        <h2 className="sobre-cta__title">Venha nos visitar</h2>
        <p className="sobre-cta__text">Temos lojas no Rio de Janeiro e em Niterói. Encontre a mais perto de você.</p>
        <Link href="/lojas" className="sobre-cta__btn">Ver nossas lojas</Link>
      </section>
    </main>
  )
}
