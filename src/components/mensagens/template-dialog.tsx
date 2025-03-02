import { Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageTemplate, TemplateVariable, templateCategories } from "@/types/mensagens"

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditMode: boolean
  template: Partial<MessageTemplate>
  variables: TemplateVariable[]
  cursorPosition: number
  onTemplateChange: (template: Partial<MessageTemplate>) => void
  onCursorPositionChange: (position: number) => void
  onSave: () => void
}

export function TemplateDialog({
  open,
  onOpenChange,
  isEditMode,
  template,
  variables,
  cursorPosition,
  onTemplateChange,
  onCursorPositionChange,
  onSave
}: TemplateDialogProps) {
  // Função para inserir variável no texto
  const insertVariable = (variable: TemplateVariable) => {
    if (!template.content) return

    const beforeCursor = template.content.substring(0, cursorPosition)
    const afterCursor = template.content.substring(cursorPosition)
    
    const newContent = beforeCursor + variable.placeholder + afterCursor
    onTemplateChange({...template, content: newContent})
    
    // Atualiza a posição do cursor para depois da variável inserida
    onCursorPositionChange(cursorPosition + variable.placeholder.length)
  }

  // Função para rastrear a posição do cursor no textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTemplateChange({...template, content: e.target.value})
    onCursorPositionChange(e.target.selectionStart)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Template" : "Criar Novo Template"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Edite o template de mensagem existente." 
              : "Crie um novo template de mensagem para usar em suas conversas."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              value={template.title}
              onChange={(e) => onTemplateChange({...template, title: e.target.value})}
              placeholder="Ex: Boas-vindas"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <select 
              id="category"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={template.category}
              onChange={(e) => onTemplateChange({...template, category: e.target.value})}
            >
              {templateCategories.filter(c => c !== "Todos").map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Conteúdo</Label>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>Variáveis disponíveis</span>
              </div>
            </div>
            <Textarea 
              id="content" 
              rows={5}
              value={template.content}
              onChange={handleTextareaChange}
              onSelect={(e) => onCursorPositionChange(e.currentTarget.selectionStart)}
              placeholder="Digite o conteúdo do template. Insira variáveis usando os botões abaixo."
            />
          </div>
          <div>
            <Label className="text-xs mb-2 block">Inserir variáveis:</Label>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Button 
                  key={variable.id} 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertVariable(variable)}
                  className="text-xs"
                >
                  {variable.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clique em uma variável para inseri-la na posição atual do cursor.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {isEditMode ? "Atualizar" : "Salvar"} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 