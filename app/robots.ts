import type { MetadataRoute } from 'next'
import { IS_PRODUCTION, SITE_URL } from '@/lib/seo/pages'

// force-dynamic: sem isso o Next pre-renderiza este arquivo uma vez em
// build time, e o Dockerfile nao repassa as env vars de build-arg pro
// processo de build (so em runtime) -- SITE_ENV ficaria travado como
// "nao e producao" pra sempre, ignorando o valor real setado no deploy.
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/preview'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
