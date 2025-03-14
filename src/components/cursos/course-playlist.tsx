"use client"

import { BookOpen, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCourse } from "./course-context"

// Dados simulados de playlists
export const playlists = [
  {
    id: "marketing",
    title: "Marketing para Clínicas",
    lessons: [
      { 
        id: "m1", 
        title: "Introdução ao Marketing Médico", 
        duration: "12:45", 
        active: false,
        videoId: "seu-video-id-1"
      },
      { 
        id: "m2", 
        title: "Criando sua Persona", 
        duration: "18:30", 
        active: false,
        videoId: "seu-video-id-2"
      },
      { 
        id: "m3", 
        title: "Estratégias de Conteúdo", 
        duration: "15:20", 
        active: false,
        videoId: "seu-video-id-3"
      },
      { 
        id: "m4", 
        title: "Anúncios para Clínicas", 
        duration: "20:15", 
        active: false,
        videoId: "seu-video-id-4"
      },
    ]
  },
  {
    id: "vendas",
    title: "Vendas e Conversão",
    lessons: [
      { 
        id: "v1", 
        title: "Funil de Vendas para Médicos", 
        duration: "14:30", 
        active: false,
        videoId: "seu-video-id-5"
      },
      { 
        id: "v2", 
        title: "Atendimento Consultivo", 
        duration: "16:45", 
        active: false,
        videoId: "seu-video-id-6"
      },
      { 
        id: "v3", 
        title: "Objeções Comuns", 
        duration: "13:20", 
        active: false,
        videoId: "seu-video-id-7"
      },
      { 
        id: "v4", 
        title: "Fechamento de Vendas", 
        duration: "19:10", 
        active: false,
        videoId: "seu-video-id-8"
      },
    ]
  },
  {
    id: "plataforma",
    title: "Usando a Ailum",
    lessons: [
      { 
        id: "p1", 
        title: "Primeiros Passos", 
        duration: "10:15", 
        active: false,
        videoId: "seu-video-id-9"
      },
      { 
        id: "p2", 
        title: "Configurando Funis", 
        duration: "12:30", 
        active: false,
        videoId: "seu-video-id-10"
      },
      { 
        id: "p3", 
        title: "Automação de Mensagens", 
        duration: "15:45", 
        active: false,
        videoId: "seu-video-id-11"
      },
      { 
        id: "p4", 
        title: "Relatórios e Métricas", 
        duration: "11:20", 
        active: false,
        videoId: "seu-video-id-12"
      },
    ]
  },
  {
    id: "ideias",
    title: "Ideias e Inspiração",
    lessons: [
      { 
        id: "i1", 
        title: "Cases de Sucesso", 
        duration: "18:30", 
        active: false,
        videoId: "seu-video-id-13"
      },
      { 
        id: "i2", 
        title: "Tendências em Saúde", 
        duration: "14:45", 
        active: false,
        videoId: "seu-video-id-14"
      },
      { 
        id: "i3", 
        title: "Experiência do Paciente", 
        duration: "16:20", 
        active: false,
        videoId: "seu-video-id-15"
      },
      { 
        id: "i4", 
        title: "Inovação em Clínicas", 
        duration: "13:10", 
        active: false,
        videoId: "seu-video-id-16"
      },
    ]
  },
]

export function CoursePlaylist() {
  const { currentLesson, setCurrentLesson } = useCourse()

  return (
    <div className="bg-card rounded-lg border p-4 h-full">
      <h3 className="text-lg font-semibold mb-4">Aulas Disponíveis</h3>
      
      <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{playlist.title}</h4>
              
              <div className="space-y-1">
                {playlist.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={cn(
                      "flex items-center justify-between w-full rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50",
                      currentLesson?.id === lesson.id ? "bg-muted font-medium" : "transparent"
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <BookOpen className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span className="truncate text-left">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 