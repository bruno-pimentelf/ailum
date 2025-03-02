import { CourseLayout } from "@/components/cursos/course-layout"

export default function CoursesPage() {
  return (
    <>
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold mb-2">Cursos Ailum</h1>
        <p className="text-muted-foreground">
          Aprenda a melhorar o marketing e as vendas da sua clínica
        </p>
      </div>

      <CourseLayout />
    </>
  )
}
