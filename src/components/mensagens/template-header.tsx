import { Check, ChevronDown, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TemplateCategory, templateCategories } from "@/types/mensagens"

interface TemplateHeaderProps {
  selectedCategory: TemplateCategory
  searchQuery: string
  onCategoryChange: (category: TemplateCategory) => void
  onSearchChange: (query: string) => void
  onNewTemplate: () => void
}

export function TemplateHeader({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onNewTemplate
}: TemplateHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Templates de Mensagens</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie templates para envio rápido de mensagens
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span>Categoria: {selectedCategory}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {templateCategories.map((category) => (
              <DropdownMenuItem 
                key={category}
                onClick={() => onCategoryChange(category)}
                className="flex items-center gap-2"
              >
                {category}
                {category === selectedCategory && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar templates..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Button onClick={onNewTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />
    </>
  )
} 