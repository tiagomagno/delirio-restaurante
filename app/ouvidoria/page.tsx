import Link from 'next/link'

export const metadata = {
  title: 'Ouvidoria',
  description: 'Canal anônimo de ouvidoria do Delírio Tropical. Compartilhe sua opinião de forma confidencial. Sua voz é importante para a melhoria contínua dos nossos serviços.',
}

export default function Ouvidoria() {
  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">Ouvidoria</h1>
        <p className="page-hero__subtitle">Sua voz é importante para nós</p>
      </div>

      <div className="ouvidoria-wrap">
        <div className="ouvidoria-notice">
          <svg viewBox="0 0 24 24" className="ouvidoria-notice__icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>
            As interações pela ouvidoria são <strong>anônimas</strong> e por essa razão não serão respondidas. Caso queira interagir com nossa equipe, comunique-se pela aba{' '}
            <Link href="/fale-conosco">&ldquo;Fale Conosco&rdquo;</Link>.
          </p>
        </div>

        <form
          className="ouvidoria-form"
          action="https://delirio.com.br/ouvidoria/"
          method="POST"
          target="_blank"
        >
          <label className="ouvidoria-form__label">
            Escreva sua mensagem *
            <textarea
              name="Ouvidoria"
              required
              className="ouvidoria-form__textarea"
              placeholder="Digite sua mensagem aqui..."
              rows={8}
            />
          </label>
          <button type="submit" className="ouvidoria-form__btn">Enviar</button>
        </form>
      </div>
    </main>
  )
}
