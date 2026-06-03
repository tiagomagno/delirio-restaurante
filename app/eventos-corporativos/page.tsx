import EventosClient from './EventosClient'

export const metadata = {
  title: 'Eventos Corporativos',
  description: 'Planeje seu evento corporativo ou familiar com o Delírio Tropical. Cardápio personalizado, atendimento exclusivo e sugestões feitas pelo gerente da loja escolhida.',
}

export default function EventosCorporativos() {
  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">Eventos Corporativos</h1>
        <p className="page-hero__subtitle">Cardápio personalizado para o evento da sua empresa</p>
      </div>

      <EventosClient />
    </main>
  )
}
