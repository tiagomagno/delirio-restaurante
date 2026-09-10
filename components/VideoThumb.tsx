'use client'

import { useState } from 'react'

interface Props {
  poster: string
  videoSrc: string
  alt: string
  playBtnSize?: number
}

export default function VideoThumb({ poster, videoSrc, alt, playBtnSize = 28 }: Props) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <video
        src={videoSrc}
        controls
        autoPlay
        playsInline
        onPlay={e => {
          // Só um vídeo toca por vez — pausa qualquer outro que já esteja rodando.
          const current = e.currentTarget
          document.querySelectorAll('video').forEach(v => {
            if (v !== current && !v.paused) v.pause()
          })
        }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    )
  }

  return (
    <button
      type="button"
      className="sobre-video-trigger"
      onClick={() => setPlaying(true)}
      aria-label={`Reproduzir vídeo: ${alt}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={alt} loading="lazy" />
      <span className="sobre-play-btn" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="white" width={playBtnSize} height={playBtnSize}>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  )
}
