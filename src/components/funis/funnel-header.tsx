import { Check, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Funnel } from "@/types/funis"

interface FunnelHeaderProps {
  selectedFunnel: Funnel
  funnels: Funnel[]
  onFunnelChange: (funnel: Funnel) => void
}

export function FunnelHeader({ selectedFunnel, funnels, onFunnelChange }: FunnelHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Funis de Vendas</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            Gerencie seus funis de vendas e acompanhe o progresso dos contatos via WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="whitespace-nowrap h-8 text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Novo Funil</span>
            <span className="sm:hidden">Novo</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="max-w-[120px] sm:max-w-[150px] md:max-w-none h-8 text-xs sm:text-sm">
                <span className="truncate">{selectedFunnel.name}</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {funnels.map((funnel) => (
                <DropdownMenuItem 
                  key={funnel.id}
                  onClick={() => onFunnelChange(funnel)}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  {funnel.name}
                  {funnel.id === selectedFunnel.id && (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="mb-4 sm:mb-6" />
    </>
  )
} 