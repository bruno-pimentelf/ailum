import { ChevronDown, Copy, Edit, Send, Star, StarOff, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageTemplate, TemplateVariable } from "@/types/mensagens"

interface TemplateCardProps {
  template: MessageTemplate
  variables: TemplateVariable[]
  onToggleStar: (id: string) => void
  onEdit: (template: MessageTemplate) => void
  onDelete: (id: string) => void
}

export function TemplateCard({ 
  template, 
  variables,
  onToggleStar,
  onEdit,
  onDelete
}: TemplateCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {template.title}
              {template.isStarred && (
                <Star className="ml-1 inline-block h-3.5 w-3.5 text-amber-500" />
              )}
            </h3>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              {template.category}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleStar(template.id)}>
                {template.isStarred ? (
                  <>
                    <StarOff className="mr-2 h-4 w-4" />
                    <span>Remover dos favoritos</span>
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Adicionar aos favoritos</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(template.id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm whitespace-pre-wrap">
          {template.content}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {variables
            .filter(v => template.content.includes(v.placeholder))
            .map(variable => (
              <span 
                key={variable.id} 
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                title={variable.description}
              >
                {variable.name}
              </span>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end items-center gap-2">
        <Button size="sm" variant="outline">
          <Copy className="h-4 w-4 mr-1" />
          Copiar
        </Button>
        <Button size="sm">
          <Send className="h-4 w-4 mr-1" />
          Usar
        </Button>
      </CardFooter>
    </Card>
  )
} 