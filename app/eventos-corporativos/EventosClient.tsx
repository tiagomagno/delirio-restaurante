'use client'

import { useMemo } from 'react'

const LOJAS: { nome: string; email: string }[] = [
  { nome: 'Plaza Niterói',          email: 'dtniteroi@delirio.com.br'      },
  { nome: 'Shopping Metropolitano', email: 'dtmetro@delirio.com.br'        },
  { nome: 'Barra Shopping',         email: 'dtbshop@delirio.com.br'        },
  { nome: 'Citta América',          email: 'dtcit@delirio.com.br'          },
  { nome: 'Ipanema',                email: 'secretaria.ipa@delirio.com.br' },
  { nome: 'Shopping Rio Sul',       email: 'dtriosul@delirio.com.br'       },
  { nome: 'Shopping Tijuca',        email: 'dttijuca@delirio.com.br'       },
  { nome: 'Assembléia',             email: 'dtass@delirio.com.br'          },
  { nome: 'Gávea',                  email: 'dtgav@delirio.com.br'          },
]

export default function EventosClient() {
  /* Data mínima = hoje + 2 dias */
  const minDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0] // YYYY-MM-DD
  }, [])

  return (
    <div className="eventos-layout">

      {/* ── Formulário ── */}
      <div className="eventos-layout__form">
        <div className="eventos-layout__form-inner">
        <h2 className="eventos-form__title">Faça o seu evento com o Delírio!</h2>
        <p className="eventos-form__desc">
          Preparamos um cardápio personalizado para o evento da sua empresa.
          O gerente da loja escolhida vai entrar em contato com um cardápio e
          sugestões personalizadas para o seu evento!
        </p>

        <form
          action="https://delirio.com.br/eventos-corporativos/"
          method="POST"
          target="_blank"
          className="eventos-form"
        >
          <label>
            Escolha a loja para fazer o pedido *
            <select name="loja-pedido" required>
              <option value="">Selecione uma loja</option>
              {LOJAS.map(l => (
                <option key={l.email} value={l.email}>{l.nome}</option>
              ))}
            </select>
          </label>

          <label>
            O pedido será para quantas pessoas? *
            <input
              type="number"
              name="qtd-pessoas"
              required
              min={1}
              placeholder="Ex: 50"
            />
          </label>

          <label>
            Para quando você quer fazer o seu pedido?
            <input
              type="date"
              name="data-pedido"
              min={minDate}
            />
          </label>

          <label>
            Nos conte um pouco mais sobre seu evento! Alguma restrição que deveríamos saber?
            <textarea
              name="descricao"
              rows={4}
              placeholder="Descreva seu evento, restrições alimentares, preferências..."
            />
          </label>

          <label>
            Nome completo *
            <input type="text" name="nome-pedido" required placeholder="Seu nome completo" />
          </label>

          <div className="eventos-form__row">
            <label>
              Telefone fixo
              <input type="tel" name="telefone" placeholder="(21) 2222-2222" />
            </label>
            <label>
              Celular / WhatsApp
              <input type="tel" name="celular" placeholder="(21) 99999-9999" />
            </label>
          </div>

          <label>
            E-mail para contato
            <input type="email" name="email" placeholder="seu@email.com" />
          </label>

          <button type="submit" className="eventos-form__btn">Fazer Cotação</button>
        </form>
        </div>
      </div>

      {/* ── Imagem lateral ── */}
      <div className="eventos-layout__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://delirio.com.br/wp-content/uploads/2023/06/Atheta-BAIXA.jpg"
          alt="Evento Delírio Tropical"
          loading="lazy"
        />
      </div>

    </div>
  )
}
