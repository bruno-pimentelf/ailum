"use client"

import { useEffect, useRef } from "react"

interface PandaPlayerProps {
  videoId: string
  title?: string
}

declare global {
  interface Window {
    PandaPlayer?: {
      init: (params: { container: HTMLElement }) => void
    }
  }
}

export function PandaPlayer({ videoId, title }: PandaPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carrega o script do PandaVideo se ainda não estiver carregado
    if (!document.querySelector('script[src*="player.pandavideo.com.br"]')) {
      const script = document.createElement('script')
      script.src = 'https://player.pandavideo.com.br/panda-player.js'
      script.async = true
      document.body.appendChild(script)
    }

    // Inicializa o player quando o script estiver carregado
    const initPlayer = () => {
      if (playerRef.current && window.PandaPlayer) {
        window.PandaPlayer.init({ container: playerRef.current })
      }
    }

    // Tenta inicializar o player ou aguarda o script carregar
    if (window.PandaPlayer) {
      initPlayer()
    } else {
      document.addEventListener('pandaplayer:ready', initPlayer)
    }

    // Cleanup
    return () => {
      document.removeEventListener('pandaplayer:ready', initPlayer)
    }
  }, [videoId])

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden">
      <div
        ref={playerRef}
        className="w-full h-full"
        data-video={videoId}
        data-title={title}
      />
    </div>
  )
} 