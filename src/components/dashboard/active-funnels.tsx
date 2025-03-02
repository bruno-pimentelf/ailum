import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function ActiveFunnels() {
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Funis Ativos</CardTitle>
        <CardDescription>
          Status dos seus funis de vendas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Consulta Inicial</span>
            </div>
            <span className="text-sm text-muted-foreground">24 leads</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">Procedimento Estético</span>
            </div>
            <span className="text-sm text-muted-foreground">18 leads</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium">Cirurgia Plástica</span>
            </div>
            <span className="text-sm text-muted-foreground">12 leads</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium">Tratamento Contínuo</span>
            </div>
            <span className="text-sm text-muted-foreground">8 leads</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
              <span className="text-sm font-medium">Retorno Pós-Operatório</span>
            </div>
            <span className="text-sm text-muted-foreground">15 leads</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          href="#" 
          className="text-sm text-primary hover:underline"
        >
          Ver todos os funis
        </Link>
      </CardFooter>
    </Card>
  )
} 