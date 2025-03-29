import Link from "next/link"
import { BookOpen, Brain, ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function LearningSection() {
  return (
    <Card className="border border-gray-100/60 bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm shadow-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,180,190,0.05)] via-transparent to-transparent pointer-events-none"></div>
      
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            E-Learning
            <div className="h-5 w-5 rounded-full bg-[rgba(0,180,190,0.2)] flex items-center justify-center">
              <Brain className="h-3 w-3 text-[rgb(0,180,190)]" />
            </div>
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            Aprenda a melhorar o faturamento da clínica
            <Sparkles className="h-3 w-3 text-[rgb(0,180,190)]" />
          </CardDescription>
        </div>
        <div className="text-xs text-[rgb(0,180,190)] bg-[rgba(0,180,190,0.1)] px-2 py-1 rounded-full">
          3 novos cursos
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-lg border border-[rgba(0,180,190,0.1)] p-4 bg-gradient-to-r from-[rgba(0,180,190,0.03)] to-transparent hover:from-[rgba(0,180,190,0.05)] transition-colors duration-200 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(0,180,190,0.1)]">
              <BookOpen className="h-5 w-5 text-[rgb(0,180,190)]" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium leading-none group-hover:text-[rgb(0,180,190)] transition-colors duration-200">Como criar funis de vendas eficientes</p>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-[rgb(0,180,190)]">75%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Workshop com Dr. Carlos Mendes</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-1.5 w-[75%] rounded-full bg-gradient-to-r from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)]"></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">Aulas: 6/8</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 rounded-lg border border-[rgba(0,180,190,0.1)] p-4 bg-gradient-to-r from-[rgba(0,180,190,0.03)] to-transparent hover:from-[rgba(0,180,190,0.05)] transition-colors duration-200 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(0,180,190,0.1)]">
              <BookOpen className="h-5 w-5 text-[rgb(0,180,190)]" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium leading-none group-hover:text-[rgb(0,180,190)] transition-colors duration-200">Otimizando o atendimento via WhatsApp</p>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-[rgb(0,180,190)]">30%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Curso com Dra. Ana Beatriz</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-1.5 w-[30%] rounded-full bg-gradient-to-r from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)]"></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">Aulas: 3/10</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 rounded-lg border border-[rgba(0,180,190,0.1)] p-4 bg-gradient-to-r from-[rgba(0,180,190,0.03)] to-transparent hover:from-[rgba(0,180,190,0.05)] transition-colors duration-200 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(0,180,190,0.1)]">
              <BookOpen className="h-5 w-5 text-[rgb(0,180,190)]" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium leading-none group-hover:text-[rgb(0,180,190)] transition-colors duration-200">Estratégias para aumentar o faturamento</p>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-[rgb(0,180,190)]">10%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Workshop com Equipe Ailum</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-1.5 w-[10%] rounded-full bg-gradient-to-r from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)]"></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">Aulas: 1/10</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link 
          href="/cursos" 
          className="text-sm text-[rgb(0,180,190)] hover:underline flex items-center gap-1"
        >
          Ver todos os cursos
          <ChevronRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
} 