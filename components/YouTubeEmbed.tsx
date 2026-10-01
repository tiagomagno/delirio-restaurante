'use client'

import { useState } from 'react'

interface Props {
  videoId: string
  title: string
}

// Carrega o iframe do YouTube só depois do clique (facade): a página não paga
// o custo do player nem envia dados ao YouTube até o visitante dar play.
export default function YouTubeEmbed({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    )
  }

  return (
    <button
      type="button"
      className="sobre-video-trigger"
      onClick={() => setPlaying(true)}
      aria-label={`Reproduzir vídeo: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt=""
        loading="lazy"
        onError={e => {
          // maxresdefault não existe pra vídeos antigos/baixa resolução.
          const img = e.currentTarget
          const fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
          if (img.src !== fallback) img.src = fallback
        }}
      />
      <span className="sobre-play-btn sobre-play-btn--lg" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="white" width={32} height={32}>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  )
}
