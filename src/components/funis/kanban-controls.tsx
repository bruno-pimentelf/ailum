import { ChevronLeft, ChevronRight, LayoutGrid, List, AlignJustify } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KanbanControlsProps {
  viewMode: 'scroll' | 'grid' | 'column'
  onViewModeChange: (mode: 'scroll' | 'grid' | 'column') => void
  onScrollLeft: () => void
  onScrollRight: () => void
}

export function KanbanControls({
  viewMode,
  onViewModeChange,
  onScrollLeft,
  onScrollRight
}: KanbanControlsProps) {
  // Função para alternar entre os modos de visualização
  const toggleViewMode = () => {
    if (viewMode === 'scroll') {
      onViewModeChange('grid');
    } else if (viewMode === 'grid') {
      onViewModeChange('column');
    } else {
      onViewModeChange('scroll');
    }
  };
  
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs sm:text-sm"
          onClick={toggleViewMode}
        >
          {viewMode === 'scroll' ? (
            <>
              <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Visualizar em grade</span>
              <span className="md:hidden">Grade</span>
            </>
          ) : viewMode === 'grid' ? (
            <>
              <AlignJustify className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Visualizar em coluna</span>
              <span className="md:hidden">Coluna</span>
            </>
          ) : (
            <>
              <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Visualizar em lista</span>
              <span className="md:hidden">Lista</span>
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