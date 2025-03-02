export type MessageTemplate = {
  id: string
  title: string
  content: string
  category: string
  isStarred?: boolean
}

export type TemplateVariable = {
  id: string
  name: string
  placeholder: string
  description: string
}

export const templateCategories = ["Todos", "Geral", "Agendamento", "Informações", "Acompanhamento", "Marketing"] as const

export type TemplateCategory = typeof templateCategories[number] 