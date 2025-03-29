import { ArrowUpRight, MessageSquare, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card className="border border-gray-100/60 bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,180,190,0.08)] via-transparent to-transparent pointer-events-none"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Novos Contatos
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,180,190,0.1)]">
            <MessageSquare className="h-4 w-4 text-[rgb(0,180,190)]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            +24
            <span className="text-xs font-normal text-[rgb(0,180,190)] bg-[rgba(0,180,190,0.1)] px-2 py-0.5 rounded-full">+15%</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-[rgb(0,180,190)]" />
            Em relação à semana passada
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-gray-100/60 bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,180,190,0.08)] via-transparent to-transparent pointer-events-none"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Conversões
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,180,190,0.1)]">
            <ArrowUpRight className="h-4 w-4 text-[rgb(0,180,190)]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            12
            <span className="text-xs font-normal text-[rgb(0,180,190)] bg-[rgba(0,180,190,0.1)] px-2 py-0.5 rounded-full">+8%</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-[rgb(0,180,190)]" />
            Em relação à semana passada
          </p>
        </CardContent>
      </Card>
      
      <Card className="border border-gray-100/60 bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,180,190,0.08)] via-transparent to-transparent pointer-events-none"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Pacientes Ativos
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,180,190,0.1)]">
            <Users className="h-4 w-4 text-[rgb(0,180,190)]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            142
            <span className="text-xs font-normal text-[rgb(0,180,190)] bg-[rgba(0,180,190,0.1)] px-2 py-0.5 rounded-full">+3%</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-[rgb(0,180,190)]" />
            Em relação ao mês passado
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 