import type { Metadata } from 'next'
import { getPageContent } from '@/lib/data/content'

export const dynamic = 'force-dynamic'

const VAGAS = [
  'Atendente de Caixa',
  'Atendente de Balcão',
  'Auxiliar de Cozinha',
  'Saladeiro',
  'Cozinheiro',
]

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('trabalhe-conosco')
  return {
    title: content['meta.title'] ?? 'Trabalhe com a Gente',
    description: content['meta.description'] ??
      'Faça parte da equipe Delírio Tropical. Confira as vagas disponíveis para atendente, auxiliar de cozinha, saladeiro, cozinheiro e mais. Candidate-se agora.',
  }
}

export default async function TrabalheConosco() {
  const content = await getPageContent('trabalhe-conosco')

  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">{content['hero.title'] ?? 'Trabalhe com a Gente'}</h1>
        <p className="page-hero__subtitle">{content['hero.subtitle'] ?? 'Faça parte da nossa equipe'}</p>
      </div>

      <div className="trabalhe-layout">

        {/* ── Formulário ── */}
        <div className="trabalhe-layout__form">
          <h2 className="trabalhe-form__title">{content['form.title'] ?? 'Trabalhe com a Gente'}</h2>
          <p className="trabalhe-form__desc">
            {content['form.description'] ??
              'Nossa missão é servir nossos clientes diariamente com muito amor. Trabalhando no Delírio Tropical você poderá exercer esse lindo ofício e perceber da importância do cuidado com as pessoas. Nossos primeiros clientes são nossos colaboradores, e damos oportunidade de crescimento para todas as pessoas da nossa equipe.'}
          </p>

          <form
            action="https://delirio.com.br/trabalhe-conosco/"
            method="POST"
            encType="multipart/form-data"
            target="_blank"
            className="trabalhe-form"
          >
            <label>
              Nome Completo *
              <input type="text" name="form_fields[nomecompleto]" required placeholder="Seu nome completo" />
            </label>

            <label>
              E-mail *
              <input type="email" name="form_fields[email]" required placeholder="seu@email.com" />
            </label>

            <label>
              Celular / WhatsApp *
              <input type="tel" name="form_fields[telefone]" required placeholder="(21) 99999-9999" />
            </label>

            <label>
              Vagas *
              <select name="form_fields[vagas]" required>
                <option value="">Selecione uma vaga</option>
                {VAGAS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </label>

            <label>
              Envie seu currículo *
              <input type="file" name="form_fields[curriculo][]" accept=".pdf,.doc,.docx" />
              <span className="trabalhe-form__file-hint">PDF, DOC ou DOCX — máx. 256 MB</span>
            </label>

            <label>
              Mensagem
              <textarea name="form_fields[mensagem]" placeholder="Conte um pouco sobre você..." rows={5} />
            </label>

            <button type="submit" className="trabalhe-form__btn">Enviar candidatura</button>
          </form>
        </div>

        {/* ── Imagem lateral ── */}
        <div className="trabalhe-layout__img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://delirio.com.br/wp-content/uploads/2023/07/back-trabalhe-conosco.jpg"
            alt="Cozinha Delírio Tropical"
            loading="lazy"
          />
        </div>

      </div>
    </main>
  )
}
