"use client"

import { useState } from "react"
import { TemplateHeader } from "@/components/mensagens/template-header"
import { TemplateDialog } from "@/components/mensagens/template-dialog"
import { TemplateGrid } from "@/components/mensagens/template-grid"
import { MessageTemplate, TemplateCategory, TemplateVariable } from "@/types/mensagens"

// Variáveis disponíveis para templates
const templateVariables: TemplateVariable[] = [
  {
    id: "var1",
    name: "nome",
    placeholder: "[nome]",
    description: "Nome do paciente"
  },
  {
    id: "var2",
    name: "data",
    placeholder: "[data]",
    description: "Data da consulta/procedimento"
  },
  {
    id: "var3",
    name: "horario",
    placeholder: "[horario]",
    description: "Horário da consulta/procedimento"
  },
  {
    id: "var4",
    name: "doutor",
    placeholder: "[doutor]",
    description: "Nome do médico responsável"
  },
  {
    id: "var5",
    name: "procedimento",
    placeholder: "[procedimento]",
    description: "Nome do procedimento"
  },
  {
    id: "var6",
    name: "valor",
    placeholder: "[valor]",
    description: "Valor do procedimento/consulta"
  },
  {
    id: "var7",
    name: "clinica",
    placeholder: "[clinica]",
    description: "Nome da clínica"
  },
  {
    id: "var8",
    name: "endereco",
    placeholder: "[endereco]",
    description: "Endereço da clínica"
  }
]

// Templates de mensagens
const messageTemplates: MessageTemplate[] = [
  {
    id: "template1",
    title: "Boas-vindas",
    content: "Olá [nome], seja bem-vindo(a) à [clinica]! Estamos felizes em atendê-lo(a). Como podemos ajudar hoje?",
    category: "Geral",
    isStarred: true,
  },
  {
    id: "template2",
    title: "Confirmação de Agendamento",
    content: "Olá [nome], sua consulta está confirmada para o dia [data] às [horario]. Por favor, chegue com 15 minutos de antecedência. Caso precise remarcar, entre em contato conosco com pelo menos 24h de antecedência.",
    category: "Agendamento",
    isStarred: true,
  },
  {
    id: "template3",
    title: "Lembrete de Consulta",
    content: "Olá [nome], lembramos que sua consulta está agendada para amanhã, dia [data], às [horario]. Contamos com sua presença!",
    category: "Agendamento",
  },
  {
    id: "template4",
    title: "Informações sobre Procedimento",
    content: "Olá [nome], o procedimento [procedimento] tem duração aproximada de 1 hora e valor de R$ [valor]. Gostaria de agendar uma avaliação?",
    category: "Informações",
  },
  {
    id: "template5",
    title: "Pós-Consulta",
    content: "Olá [nome], como está se sentindo após sua consulta? Lembre-se de seguir todas as recomendações do Dr(a). [doutor]. Estamos à disposição para qualquer dúvida.",
    category: "Acompanhamento",
  },
  {
    id: "template6",
    title: "Promoção",
    content: "Olá [nome], temos uma promoção especial este mês para [procedimento]. Válido até [data]. Aproveite esta oportunidade!",
    category: "Marketing",
  },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("Todos")
  const [newTemplate, setNewTemplate] = useState<Partial<MessageTemplate>>({
    title: "",
    content: "",
    category: "Geral"
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [templates, setTemplates] = useState(messageTemplates)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null)

  // Filtra templates com base na categoria e pesquisa
  const filteredTemplates = templates.filter(template => 
    (selectedCategory === "Todos" || template.category === selectedCategory) &&
    (template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Função para adicionar novo template
  const handleSaveTemplate = () => {
    if (newTemplate.title && newTemplate.content && newTemplate.category) {
      if (isEditMode && editingTemplateId) {
        // Atualiza template existente
        setTemplates(templates.map(template => 
          template.id === editingTemplateId 
            ? { 
                ...template, 
                title: newTemplate.title || "", 
                content: newTemplate.content || "", 
                category: newTemplate.category || "Geral" 
              } 
            : template
        ))
      } else {
        // Cria novo template
        const template: MessageTemplate = {
          id: `template${Date.now()}`,
          title: newTemplate.title,
          content: newTemplate.content,
          category: newTemplate.category,
          isStarred: false
        }
        
        setTemplates([...templates, template])
      }
      
      // Reseta o estado
      setNewTemplate({ title: "", content: "", category: "Geral" })
      setIsDialogOpen(false)
      setIsEditMode(false)
      setEditingTemplateId(null)
    }
  }

  // Função para favoritar/desfavoritar template
  const toggleStarTemplate = (id: string) => {
    setTemplates(templates.map(template => 
      template.id === id 
        ? { ...template, isStarred: !template.isStarred } 
        : template
    ))
  }

  // Função para excluir template
  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id))
  }

  // Função para editar template
  const editTemplate = (template: MessageTemplate) => {
    setNewTemplate({
      title: template.title,
      content: template.content,
      category: template.category
    })
    setIsEditMode(true)
    setEditingTemplateId(template.id)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <TemplateHeader
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        onNewTemplate={() => {
          setIsEditMode(false)
          setEditingTemplateId(null)
          setNewTemplate({ title: "", content: "", category: "Geral" })
          setIsDialogOpen(true)
        }}
      />

      <TemplateGrid
        templates={filteredTemplates}
        variables={templateVariables}
        onToggleStar={toggleStarTemplate}
        onEdit={editTemplate}
        onDelete={deleteTemplate}
      />

      <TemplateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        template={newTemplate}
        variables={templateVariables}
        cursorPosition={cursorPosition}
        onTemplateChange={setNewTemplate}
        onCursorPositionChange={setCursorPosition}
        onSave={handleSaveTemplate}
      />
    </div>
  )
}
