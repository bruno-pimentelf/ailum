"use client"

import { BookOpen, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PandaPlayer } from "./panda-player"
import { useCourse } from "./course-context"

export function CourseVideo() {
  const { currentLesson } = useCourse()

  return (
    <div className="space-y-4">

      {currentLesson ? (
        <PandaPlayer 
          videoId={currentLesson.videoId}
          title={currentLesson.title}
        />
      ) : (
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecione uma aula para começar</p>
            </div>
          </div>
        </div>
      )}

      {/* Informações da aula */}
      {currentLesson && (
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{currentLesson.title}</h2>
            <p className="text-sm text-muted-foreground">
              Aprenda os fundamentos do marketing digital para clínicas e consultórios médicos
            </p>
          </div>
          <div className="flex gap-2 self-start">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Materiais
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 