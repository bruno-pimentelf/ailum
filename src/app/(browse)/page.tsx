import { StatsCards } from "@/components/dashboard/stats-cards"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { ActiveFunnels } from "@/components/dashboard/active-funnels"
import { LearningSection } from "@/components/dashboard/learning-section"

export default function BrowsePage() {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">Dashboard Ailum</h1>
        <p className="text-muted-foreground mb-6">
          Bem-vindo ao seu CRM para médicos powered by AI
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-4 md:grid-cols-7 mb-6">
        <PerformanceChart />
        <ActiveFunnels />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <LearningSection />
      </div>
    </>
  )
} 