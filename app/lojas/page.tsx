import LojasClient from './LojasClient'

export const metadata = {
  title: 'Lojas',
  description: 'Encontre a loja Delírio Tropical mais próxima de você. Unidades em Assembléia, Tijuca, Rio Sul, Ipanema, Gávea, Citta América, Barra Shopping, Metropolitano (RJ) e Plaza Niterói.',
}

export default function Lojas() {
  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">Nossas Lojas</h1>
        <p className="page-hero__subtitle">Rio de Janeiro e Niterói — encontre a loja mais próxima de você</p>
      </div>

      <LojasClient />
    </main>
  )
}
