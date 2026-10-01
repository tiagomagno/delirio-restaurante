interface Props {
  kind: 'reel' | 'p'
  code: string
  title: string
}

// O Instagram não expõe a capa do vídeo sem login, então não dá pra fazer
// facade como no YouTube — o embed oficial (iframe) carrega direto.
export default function InstagramEmbed({ kind, code, title }: Props) {
  return (
    <iframe
      src={`https://www.instagram.com/${kind}/${code}/embed/`}
      title={title}
      loading="lazy"
      scrolling="no"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}
