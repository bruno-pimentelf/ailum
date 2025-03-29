import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ChevronRight, Zap } from "lucide-react"

export function ActiveFunnels() {
  return (
    <Card className="md:col-span-3 border-none bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm shadow-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,180,190,0.05)] via-transparent to-transparent pointer-events-none"></div>
      
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Funis Ativos
            <div className="h-5 w-5 rounded-full bg-[rgba(0,180,190,0.2)] flex items-center justify-center">
              <Zap className="h-3 w-3 text-[rgb(0,180,190)]" />
            </div>
          </CardTitle>
          <CardDescription>
            Status dos seus funis de vendas
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[rgba(0,180,190,0.05)] transition-colors duration-150 group">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-green-500 opacity-20"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              </div>
              <div>
                <span className="text-sm font-medium group-hover:text-[rgb(0,180,190)] transition-colors duration-150">Consulta Inicial</span>
                <div className="flex items-center gap-1">
                  <Brain className="h-3 w-3 text-[rgb(0,180,190)]" />
                  <span className="text-xs text-[rgb(0,180,190)]">Alto potencial</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-[rgba(0,180,190,0.1)] text-[rgb(0,180,190)] px-2 py-0.5 rounded-full">24</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[rgba(0,180,190,0.05)] transition-colors duration-150 group">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              </div>
              <span className="text-sm font-medium group-hover:text-[rgb(0,180,190)] transition-colors duration-150">Procedimento Estético</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-[rgba(0,180,190,0.1)] text-[rgb(0,180,190)] px-2 py-0.5 rounded-full">18</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[rgba(0,180,190,0.05)] transition-colors duration-150 group">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-20"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
              </div>
              <span className="text-sm font-medium group-hover:text-[rgb(0,180,190)] transition-colors duration-150">Cirurgia Plástica</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-[rgba(0,180,190,0.1)] text-[rgb(0,180,190)] px-2 py-0.5 rounded-full">12</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[rgba(0,180,190,0.05)] transition-colors duration-150 group">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-purple-500 opacity-20"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
              </div>
              <span className="text-sm font-medium group-hover:text-[rgb(0,180,190)] transition-colors duration-150">Tratamento Contínuo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-[rgba(0,180,190,0.1)] text-[rgb(0,180,190)] px-2 py-0.5 rounded-full">8</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[rgba(0,180,190,0.05)] transition-colors duration-150 group">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-orange-500 opacity-20"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
              </div>
              <span className="text-sm font-medium group-hover:text-[rgb(0,180,190)] transition-colors duration-150">Retorno Pós-Operatório</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-[rgba(0,180,190,0.1)] text-[rgb(0,180,190)] px-2 py-0.5 rounded-full">15</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link 
          href="#" 
          className="text-sm text-[rgb(0,180,190)] hover:underline flex items-center gap-1"
        >
          Ver todos os funis
          <ChevronRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
} 