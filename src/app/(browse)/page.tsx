import { StatsCards } from "@/components/dashboard/stats-cards"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { ActiveFunnels } from "@/components/dashboard/active-funnels"
import { LearningSection } from "@/components/dashboard/learning-section"
import { Brain, Sparkles } from "lucide-react"

export default function BrowsePage() {
  return (
    <div className="relative">
      {/* Background decorativo com gradiente e blur */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[rgba(0,180,190,0.05)] to-transparent pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[rgba(0,180,190,0.08)] blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-[rgba(0,180,190,0.05)] blur-3xl"></div>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Dashboard Ailum</h1>
          <Brain className="h-7 w-7 text-[rgb(0,180,190)]" />
        </div>
        <div className="flex items-center gap-2 mb-8">
          <p className="text-muted-foreground">
            Bem-vindo ao seu CRM para médicos powered by AI
          </p>
          <Sparkles className="h-4 w-4 text-[rgb(0,180,190)]" />
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-7 mb-8">
        <PerformanceChart />
        <ActiveFunnels />
      </div>

      <div className="grid gap-4 md:grid-cols-1 mb-8">
        <LearningSection />
      </div>
      
      {/* Adicional: Dica de IA */}
      <div className="bg-gradient-to-r from-[rgba(0,180,190,0.1)] to-transparent backdrop-blur-sm rounded-lg p-4 border border-[rgba(0,180,190,0.2)] mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(0,180,190,0.2)]">
            <Brain className="h-5 w-5 text-[rgb(0,180,190)]" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
              Insight da IA <Sparkles className="h-3 w-3 text-[rgb(0,180,190)]" />
            </h3>
            <p className="text-sm text-muted-foreground">
              Baseado nos dados atuais, sugerimos focar no funil de &quot;Consulta Inicial&quot; que apresenta a maior conversão potencial esta semana.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 