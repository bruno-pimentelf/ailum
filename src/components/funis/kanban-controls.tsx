import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanControlsProps {
  viewMode: 'scroll' | 'grid'
  onViewModeChange: (mode: 'scroll' | 'grid') => void
  onScrollLeft: () => void
  onScrollRight: () => void
}

export function KanbanControls({
  viewMode,
  onViewModeChange,
  onScrollLeft,
  onScrollRight
}: KanbanControlsProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="hidden md:flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs sm:text-sm"
          onClick={() => onViewModeChange(viewMode === 'scroll' ? 'grid' : 'scroll')}
        >
          {viewMode === 'scroll' ? (
            <>
              <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Visualizar em grade</span>
            </>
          ) : (
            <>
              <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Visualizar em lista</span>
            </>
          )}
        </Button>
      </div>
      <div className="flex items-center justify-end gap-1 sm:gap-2">
        <span className="text-xs text-muted-foreground mr-1">
          {viewMode === 'scroll' && "Deslize para ver mais →"}
        </span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 sm:h-8 sm:w-8" 
          onClick={onScrollLeft}
          aria-label="Rolar para a esquerda"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 sm:h-8 sm:w-8" 
          onClick={onScrollRight}
          aria-label="Rolar para a direita"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
} 