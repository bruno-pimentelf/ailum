import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PerformanceChart() {
  return (
    <Card className="md:col-span-4">
      <CardHeader>
        <CardTitle>Desempenho dos Funis</CardTitle>
        <CardDescription>
          Conversões por funil nos últimos 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {/* Simulação de um gráfico */}
          <div className="flex h-full items-end gap-2 pt-4">
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
                  <div className="h-[60%] rounded-md bg-primary"></div>
                </div>
                <div className="w-full">
                  <div className="h-[40%] rounded-md bg-primary"></div>
                </div>
                <div className="w-full">
                  <div className="h-[75%] rounded-md bg-primary"></div>
                </div>
                <div className="w-full">
                  <div className="h-[25%] rounded-md bg-primary"></div>
                </div>
                <div className="w-full">
                  <div className="h-[50%] rounded-md bg-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 