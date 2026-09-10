'use client'

import { useEffect } from 'react'

const TYPEKIT_URL = 'https://use.typekit.net/wef2css.css'

// A fonte 'futura-pt' vem do Adobe Fonts (TypeKit) e não pode ser
// self-hosted via next/font. Carregamos via <link media="print">, que o
// navegador busca em segundo plano sem bloquear a renderização inicial, e
// só trocamos pra media="all" quando o CSS termina de baixar.
export default function AsyncTypekitFont() {
  useEffect(() => {
    if (document.querySelector(`link[href="${TYPEKIT_URL}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = TYPEKIT_URL
    link.media = 'print'
    link.onload = () => {
      link.media = 'all'
    }
    document.head.appendChild(link)
  }, [])

  return null
}
