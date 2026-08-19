import type { Metadata } from 'next'
import { getPageContent } from '@/lib/data/content'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('uso-e-privacidade')
  return {
    title: content['meta.title'] ?? 'Uso e Privacidade',
    description: content['meta.description'] ??
      'Política de privacidade e termos de uso do Delírio Tropical. Saiba como coletamos, usamos e protegemos suas informações pessoais.',
  }
}

export default async function UsoEPrivacidade() {
  const c = await getPageContent('uso-e-privacidade')

  return (
    <main>
      <div className="page-hero">
        <h1 className="page-hero__title">{c['hero.title'] ?? 'Uso e Privacidade'}</h1>
        <p className="page-hero__subtitle">{c['hero.subtitle'] ?? 'Política de privacidade do Delírio Tropical'}</p>
      </div>

      <div className="privacidade">
        <div className="privacidade__content">

          <h2>{c['intro.title'] ?? 'Política de privacidade para Delírio Tropical'}</h2>
          <p>{c['intro.p1'] ?? 'Todas as suas informações pessoais recolhidas, serão usadas para o ajudar a tornar a sua visita no nosso site o mais produtiva e agradável possível.'}</p>
          <p>{c['intro.p2'] ?? 'A garantia da confidencialidade dos dados pessoais dos utilizadores do nosso site é importante para o Delírio Tropical.'}</p>
          <p>{c['intro.p3'] ?? 'Todas as informações pessoais relativas a membros, assinantes, clientes ou visitantes que usem o Delírio Tropical serão tratadas em concordância com a Lei da Proteção de Dados Pessoais de 26 de outubro de 1998 (Lei n.º 67/98).'}</p>
          <p>{c['intro.p4'] ?? 'A informação pessoal recolhida pode incluir o seu nome, e-mail, número de telefone e/ou telemóvel, morada, data de nascimento e/ou outros.'}</p>
          <p>{c['intro.p5'] ?? 'O uso do Delírio Tropical pressupõe a aceitação deste Acordo de privacidade. A equipa do Delírio Tropical reserva-se ao direito de alterar este acordo sem aviso prévio. Deste modo, recomendamos que consulte a nossa política de privacidade com regularidade de forma a estar sempre atualizado.'}</p>

          <h3>{c['anuncios.title'] ?? 'Os anúncios'}</h3>
          <p>{c['anuncios.p1'] ?? 'Tal como outros websites, coletamos e utilizamos informação contida nos anúncios. A informação contida nos anúncios inclui o seu endereço IP (Internet Protocol), o seu ISP (Internet Service Provider), o browser que utilizou ao visitar o nosso website, o tempo da sua visita e que páginas visitou dentro do nosso website.'}</p>

          <h3>{c['dart.title'] ?? 'Cookie DoubleClick Dart'}</h3>
          <p>{c['dart.p1'] ?? 'O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios no nosso website. Com o cookie DART, o Google pode exibir anúncios com base nas visitas que o leitor fez a outros websites na Internet. Os utilizadores podem desativar o cookie DART visitando a Política de privacidade da rede de conteúdo e dos anúncios do Google.'}</p>

          <h3>{c['cookies.title'] ?? 'Os Cookies e Web Beacons'}</h3>
          <p>{c['cookies.p1'] ?? 'Utilizamos cookies para armazenar informação, tais como as suas preferências pessoais quando visita o nosso website. Isto poderá incluir um simples popup, ou uma ligação em vários serviços que providenciamos, tais como fóruns.'}</p>
          <p>{c['cookies.p2'] ?? 'Em adição também utilizamos publicidade de terceiros no nosso website para suportar os custos de manutenção. Alguns destes publicitários, poderão utilizar tecnologias como os cookies e/ou web beacons quando publicitam no nosso website, o que fará com que esses publicitários (como o Google através do Google AdSense) também recebam o seu endereço IP pessoal.'}</p>

          <h3>{c['terceiros.title'] ?? 'Ligações a Sites de Terceiros'}</h3>
          <p>{c['terceiros.p1'] ?? 'O Delírio Tropical possui ligações para outros sites, os quais, a nosso ver, podem conter informações úteis para os nossos visitantes. A nossa política de privacidade não é aplicada a sites de terceiros, pelo que, caso visite outro site a partir do nosso deverá ler a politica de privacidade do mesmo.'}</p>
          <p>{c['terceiros.p2'] ?? 'Não nos responsabilizamos pela política de privacidade ou conteúdo presente nesses mesmos sites.'}</p>

        </div>
      </div>
    </main>
  )
}
