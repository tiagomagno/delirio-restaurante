export const metadata = {
  title: 'Fale Conosco',
  description: 'Entre em contato com a loja Delírio Tropical de sua preferência. Envie sua mensagem e nossa equipe retornará em breve.',
}

const LOJAS: { nome: string; email: string }[] = [
  { nome: 'Plaza Niterói',          email: 'dtniteroi@delirio.com.br'       },
  { nome: 'Shopping Metropolitano', email: 'dtmetro@delirio.com.br'         },
  { nome: 'Barra Shopping',         email: 'dtbshop@delirio.com.br'         },
  { nome: 'Citta América',          email: 'dtcit@delirio.com.br'           },
  { nome: 'Ipanema',                email: 'secretaria.ipa@delirio.com.br'  },
  { nome: 'Shopping Rio Sul',       email: 'dtriosul@delirio.com.br'        },
  { nome: 'Shopping Tijuca',        email: 'dttijuca@delirio.com.br'        },
  { nome: 'Assembléia',             email: 'dtass@delirio.com.br'           },
  { nome: 'Gávea',                  email: 'dtgav@delirio.com.br'           },
]

export default function FaleConosco() {
  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">Fale Conosco</h1>
        <p className="page-hero__subtitle">
          Assim poderemos servir ainda melhor
        </p>
      </div>

      <div className="fale-form">
        <h2 className="fale-form__title">Envie sua mensagem</h2>
        <p className="fale-form__sub">
          Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
        </p>

        <form
          action="https://delirio.com.br/fale-conosco/"
          method="POST"
          target="_blank"
        >
          <label>
            Escolha uma loja *
            <select name="loja" required>
              <option value="">Selecione uma loja</option>
              {LOJAS.map(l => (
                <option key={l.email} value={l.email}>{l.nome}</option>
              ))}
            </select>
          </label>

          <label>
            Nome completo *
            <input type="text" name="nome" required placeholder="Seu nome completo" />
          </label>

          <label>
            E-mail *
            <input type="email" name="email" required placeholder="seu@email.com" />
          </label>

          <label>
            Celular *
            <input type="tel" name="celular" required placeholder="(21) 99999-9999" />
          </label>

          <label>
            Mensagem *
            <textarea name="mensagem" required placeholder="Escreva sua mensagem aqui..." />
          </label>

          <button type="submit" className="fale-form__btn">Enviar</button>
        </form>
      </div>
    </main>
  )
}
