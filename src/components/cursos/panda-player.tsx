"use client"

interface PandaPlayerProps {
  videoId: string
  title?: string
}

export function PandaPlayer({ videoId, title }: PandaPlayerProps) {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden relative">
      <iframe 
        src={`https://player-vz-523530f8-5b5.tv.pandavideo.com.br/embed/?v=${videoId}`}
        className="absolute top-0 left-0 w-full h-full border-none"
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
        allowFullScreen
        loading="eager"
      />
    </div>
  )
}