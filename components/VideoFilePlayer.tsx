'use client'

import { useEffect, useRef } from 'react'

interface Props {
  src: string
  title: string
}

// Vídeo enviado pelo admin (MP4/WebM), tocando mudo e em loop como um
// "background" enquanto está visível na tela — pausa ao sair dela. Os controles
// continuam disponíveis pra tirar o mudo, pausar ou ir pra tela cheia.
// Quem prefere menos movimento (prefers-reduced-motion) não recebe autoplay.
export default function VideoFilePlayer({ src, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      title={title}
      aria-label={title}
      muted
      loop
      playsInline
      controls
      preload="metadata"
    />
  )
}
