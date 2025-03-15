import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function LearningSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>E-Learning</CardTitle>
        <CardDescription>
          Aprenda a melhorar o faturamento da clínica
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-lg border p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Como criar funis de vendas eficientes</p>
              <p className="text-xs text-muted-foreground">Workshop com Dr. Carlos Mendes</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 w-[75%] rounded-full bg-primary"></div>
              </div>
              <p className="text-xs text-muted-foreground">75% concluído</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg border p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Otimizando o atendimento via WhatsApp</p>
              <p className="text-xs text-muted-foreground">Curso com Dra. Ana Beatriz</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 w-[30%] rounded-full bg-primary"></div>
              </div>
              <p className="text-xs text-muted-foreground">30% concluído</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg border p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Estratégias para aumentar o faturamento</p>
              <p className="text-xs text-muted-foreground">Workshop com Equipe Ailum</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 w-[10%] rounded-full bg-primary"></div>
              </div>
              <p className="text-xs text-muted-foreground">10% concluído</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          href="/cursos" 
          className="text-sm text-primary hover:underline"
        >
          Ver todos os cursos
        </Link>
      </CardFooter>
    </Card>
  )
} 