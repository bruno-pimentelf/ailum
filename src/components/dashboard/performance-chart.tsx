import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ChartBarIcon } from "lucide-react"

export function PerformanceChart() {
  return (
    <Card className="md:col-span-4 border-none bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm shadow-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,180,190,0.05)] via-transparent to-transparent pointer-events-none"></div>
      
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Desempenho dos Funis
            <div className="h-5 w-5 rounded-full bg-[rgba(0,180,190,0.2)] flex items-center justify-center">
              <Brain className="h-3 w-3 text-[rgb(0,180,190)]" />
            </div>
          </CardTitle>
          <CardDescription>
            Conversões por funil nos últimos 30 dias
          </CardDescription>
        </div>
        <div className="text-xs text-[rgb(0,180,190)] bg-[rgba(0,180,190,0.1)] px-2 py-1 rounded-full">
          + 12.5% de crescimento
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full">
          {/* Simulação de um gráfico mais futurista */}
          <div className="flex h-full items-end gap-2 pt-8 relative">
            {/* Grid lines decorativas */}
            <div className="absolute inset-0 border-t border-dashed border-gray-100"></div>
            <div className="absolute inset-0 top-1/4 border-t border-dashed border-gray-100"></div>
            <div className="absolute inset-0 top-2/4 border-t border-dashed border-gray-100"></div>
            <div className="absolute inset-0 top-3/4 border-t border-dashed border-gray-100"></div>
            
            <div className="relative flex h-full w-full flex-col justify-end">
              <div className="absolute -top-[1.5rem] left-0 right-0 flex justify-between text-xs text-muted-foreground">
                <span>Consulta</span>
                <span>Retorno</span>
                <span>Procedimento</span>
                <span>Cirurgia</span>
                <span>Estética</span>
              </div>
              <div className="flex h-full w-full items-end gap-2">
                <div className="w-full">
                  <div style={{height: '60%'}} className="rounded-md bg-gradient-to-t from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)] shadow-sm relative group">
                    <div className="absolute inset-x-0 -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs font-medium">60%</div>
                    <div className="absolute inset-x-0 -bottom-2 h-1 w-1/2 mx-auto rounded-full bg-[rgb(0,180,190)] blur-sm"></div>
                  </div>
                </div>
                <div className="w-full">
                  <div style={{height: '40%'}} className="rounded-md bg-gradient-to-t from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)] shadow-sm relative group">
                    <div className="absolute inset-x-0 -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs font-medium">40%</div>
                    <div className="absolute inset-x-0 -bottom-2 h-1 w-1/2 mx-auto rounded-full bg-[rgb(0,180,190)] blur-sm"></div>
                  </div>
                </div>
                <div className="w-full">
                  <div style={{height: '75%'}} className="rounded-md bg-gradient-to-t from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)] shadow-sm relative group">
                    <div className="absolute inset-x-0 -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs font-medium">75%</div>
                    <div className="absolute inset-x-0 -bottom-2 h-1 w-1/2 mx-auto rounded-full bg-[rgb(0,180,190)] blur-sm"></div>
                  </div>
                </div>
                <div className="w-full">
                  <div style={{height: '25%'}} className="rounded-md bg-gradient-to-t from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)] shadow-sm relative group">
                    <div className="absolute inset-x-0 -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs font-medium">25%</div>
                    <div className="absolute inset-x-0 -bottom-2 h-1 w-1/2 mx-auto rounded-full bg-[rgb(0,180,190)] blur-sm"></div>
                  </div>
                </div>
                <div className="w-full">
                  <div style={{height: '50%'}} className="rounded-md bg-gradient-to-t from-[rgb(0,180,190)] to-[rgba(0,180,190,0.7)] shadow-sm relative group">
                    <div className="absolute inset-x-0 -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs font-medium">50%</div>
                    <div className="absolute inset-x-0 -bottom-2 h-1 w-1/2 mx-auto rounded-full bg-[rgb(0,180,190)] blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 