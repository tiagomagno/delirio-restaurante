'use client'

import { useState } from 'react'

interface RetryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  maxRetries?: number
}

// Fotos enviadas pelo admin às vezes demoram alguns instantes pra ficar
// disponíveis (propagação no storage), fazendo a miniatura falhar no
// primeiro carregamento mesmo o arquivo já tendo sido salvo. Tenta de novo
// algumas vezes com um parâmetro que força o navegador a ignorar qualquer
// resposta de erro em cache, em vez de repetir a mesma falha.
export default function RetryImage({ src, maxRetries = 3, ...rest }: RetryImageProps) {
  const [attempt, setAttempt] = useState(0)

  function handleError() {
    if (attempt < maxRetries) {
      setTimeout(() => setAttempt(a => a + 1), 1000 * (attempt + 1))
    }
  }

  const url = attempt === 0 ? src : `${src}${src.includes('?') ? '&' : '?'}retry=${attempt}`

  return <img key={attempt} src={url} onError={handleError} {...rest} />
}
