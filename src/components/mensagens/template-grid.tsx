import { MessageTemplate, TemplateVariable } from "@/types/mensagens"
import { TemplateCard } from "./template-card"

interface TemplateGridProps {
  templates: MessageTemplate[]
  variables: TemplateVariable[]
  onToggleStar: (id: string) => void
  onEdit: (template: MessageTemplate) => void
  onDelete: (id: string) => void
}

export function TemplateGrid({
  templates,
  variables,
  onToggleStar,
  onEdit,
  onDelete
}: TemplateGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.length > 0 ? (
        templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            variables={variables}
            onToggleStar={onToggleStar}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="flex items-center justify-center h-40 border border-dashed rounded-md md:col-span-2 lg:col-span-3">
          <p className="text-muted-foreground">
            Nenhum template encontrado
          </p>
        </div>
      )}
    </div>
  )
} 