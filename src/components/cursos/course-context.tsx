"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { playlists } from "./course-playlist"

interface Lesson {
  id: string
  title: string
  duration: string
  videoId: string
}

interface CourseContextType {
  currentLesson: Lesson | null
  setCurrentLesson: (lesson: Lesson) => void
}

const CourseContext = createContext<CourseContextType | null>(null)

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)

  // Inicializa com o primeiro vídeo
  useEffect(() => {
    if (!currentLesson && playlists.length > 0 && playlists[0].lessons.length > 0) {
      setCurrentLesson(playlists[0].lessons[0])
    }
  }, [currentLesson])

  return (
    <CourseContext.Provider value={{ currentLesson, setCurrentLesson }}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourse() {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider")
  }
  return context
} 