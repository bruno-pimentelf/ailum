"use client"

import { useState } from "react"
import { Funnel } from "@/types/funis"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Cores disponíveis para os estágios
const availableColors = [
  { value: "bg-blue-500", label: "Azul" },
  { value: "bg-indigo-500", label: "Índigo" },
  { value: "bg-purple-500", label: "Roxo" },
  { value: "bg-violet-500", label: "Violeta" },
  { value: "bg-pink-500", label: "Rosa" },
  { value: "bg-red-500", label: "Vermelho" },
  { value: "bg-orange-500", label: "Laranja" },
  { value: "bg-yellow-500", label: "Amarelo" },
  { value: "bg-green-500", label: "Verde" },
  { value: "bg-emerald-500", label: "Esmeralda" },
  { value: "bg-teal-500", label: "Turquesa" },
  { value: "bg-cyan-500", label: "Ciano" },
]

interface FunnelCreatorProps {
  funnels: Funnel[]
  onFunnelCreate: (funnel: Funnel) => void
  onFunnelUpdate: (funnel: Funnel) => void
  onFunnelDelete: (funnelId: string) => void
}

export function FunnelCreator({ 
  funnels, 
  onFunnelCreate, 
  onFunnelUpdate, 
  onFunnelDelete 
}: FunnelCreatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null)
  const [newFunnel, setNewFunnel] = useState<Funnel>({
    id: "",
    name: "",
    stages: [{ id: "", name: "", color: "bg-blue-500" }]
  })

  // Função para gerar ID único
  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
  }

  // Função para resetar o formulário
  const resetForm = () => {
    setNewFunnel({
      id: "",
      name: "",
      stages: [{ id: "", name: "", color: "bg-blue-500" }]
    })
    setIsEditMode(false)
    setSelectedFunnel(null)
  }

  // Função para abrir o modal em modo de edição
  const handleEditFunnel = (funnel: Funnel) => {
    setSelectedFunnel(funnel)
    setNewFunnel({...funnel})
    setIsEditMode(true)
    setIsOpen(true)
  }

  // Função para adicionar um novo estágio
  const addStage = () => {
    setNewFunnel({
      ...newFunnel,
      stages: [
        ...newFunnel.stages,
        { id: "", name: "", color: "bg-blue-500" }
      ]
    })
  }

  // Função para remover um estágio
  const removeStage = (index: number) => {
    if (newFunnel.stages.length <= 1) {
      toast({
        title: "Erro",
        description: "Um funil precisa ter pelo menos um estágio",
        variant: "destructive"
      })
      return
    }
    
    const updatedStages = [...newFunnel.stages]
    updatedStages.splice(index, 1)
    
    setNewFunnel({
      ...newFunnel,
      stages: updatedStages
    })
  }

  // Função para atualizar um estágio
  const updateStage = (index: number, field: string, value: string) => {
    const updatedStages = [...newFunnel.stages]
    
    if (field === "name") {
      updatedStages[index] = {
        ...updatedStages[index],
        name: value,
        id: generateId(value)
      }
    } else if (field === "color") {
      updatedStages[index] = {
        ...updatedStages[index],
        color: value
      }
    }
    
    setNewFunnel({
      ...newFunnel,
      stages: updatedStages
    })
  }

  // Função para salvar o funil
  const saveFunnel = () => {
    // Validar campos
    if (!newFunnel.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do funil é obrigatório",
        variant: "destructive"
      })
      return
    }

    // Verificar se todos os estágios têm nome
    if (newFunnel.stages.some(stage => !stage.name.trim())) {
      toast({
        title: "Erro",
        description: "Todos os estágios precisam ter um nome",
        variant: "destructive"
      })
      return
    }

    // Gerar ID para o funil se estiver criando um novo
    const finalFunnel = {
      ...newFunnel,
      id: isEditMode ? newFunnel.id : generateId(newFunnel.name)
    }

    if (isEditMode) {
      onFunnelUpdate(finalFunnel)
      toast({
        title: "Funil atualizado",
        description: `O funil "${finalFunnel.name}" foi atualizado com sucesso`
      })
    } else {
      onFunnelCreate(finalFunnel)
      toast({
        title: "Funil criado",
        description: `O funil "${finalFunnel.name}" foi criado com sucesso`
      })
    }

    setIsOpen(false)
    resetForm()
  }

  // Função para confirmar exclusão de funil
  const confirmDeleteFunnel = (funnel: Funnel) => {
    if (confirm(`Tem certeza que deseja excluir o funil "${funnel.name}"?`)) {
      onFunnelDelete(funnel.id)
      toast({
        title: "Funil excluído",
        description: `O funil "${funnel.name}" foi excluído com sucesso`
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm()
              setIsOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Funil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar Funil" : "Criar Novo Funil"}</DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Edite as informações do funil existente" 
                  : "Crie um novo funil para gerenciar seus contatos"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="funnel-name">Nome do Funil</Label>
                <Input 
                  id="funnel-name" 
                  value={newFunnel.name} 
                  onChange={(e) => setNewFunnel({...newFunnel, name: e.target.value})}
                  placeholder="Ex: Consulta Inicial"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Estágios do Funil</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addStage}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Estágio
                  </Button>
                </div>
                
                {newFunnel.stages.map((stage, index) => (
                  <div key={index} className="flex items-end gap-2 p-3 border rounded-md">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`stage-name-${index}`}>Nome do Estágio</Label>
                      <Input 
                        id={`stage-name-${index}`} 
                        value={stage.name} 
                        onChange={(e) => updateStage(index, "name", e.target.value)}
                        placeholder="Ex: Novo Contato"
                      />
                    </div>
                    
                    <div className="w-1/3 space-y-2">
                      <Label htmlFor={`stage-color-${index}`}>Cor</Label>
                      <div className="grid grid-cols-6 gap-1">
                        {availableColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`w-6 h-6 rounded-full ${color.value} ${
                              stage.color === color.value ? "ring-2 ring-offset-2 ring-black" : ""
                            }`}
                            title={color.label}
                            onClick={() => updateStage(index, "color", color.value)}
                            aria-label={`Cor ${color.label}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeStage(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveFunnel}>
                {isEditMode ? "Atualizar" : "Criar"} Funil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funnels.map((funnel) => (
          <Card key={funnel.id}>
            <CardHeader>
              <CardTitle>{funnel.name}</CardTitle>
              <CardDescription>
                {funnel.stages.length} estágios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {funnel.stages.map((stage) => (
                  <div 
                    key={stage.id} 
                    className={`px-2 py-1 rounded text-white text-xs ${stage.color}`}
                  >
                    {stage.name}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditFunnel(funnel)}
              >
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive"
                onClick={() => confirmDeleteFunnel(funnel)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 