import { CourseProvider } from "./course-context"
import { CourseVideo } from "./course-video"
import { CoursePlaylist } from "./course-playlist"

export function CourseLayout() {
  return (
    <CourseProvider>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área principal com vídeo */}
        <div className="lg:col-span-2">
          <CourseVideo />
        </div>
        
        {/* Barra lateral com playlists */}
        <div className="lg:col-span-1">
          <CoursePlaylist />
        </div>
      </div>
    </CourseProvider>
  )
} 