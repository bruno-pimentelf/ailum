// Tipos para o sistema de funis

// Status possíveis para um contato
export type ContactStatus = 
  | "needs_response" // Precisa de resposta
  | "in_conversation" // Em conversa
  | "waiting_client" // Aguardando cliente
  | "resolved" // Resolvido

// Interface para um contato
export interface Contact {
  id: string
  name: string
  phone: string
  avatar?: string
  stageId: string
  status: ContactStatus
  lastActivity: string
  unreadCount?: number
  value?: number // Valor do contato em R$
}

// Interface para um estágio do funil
export interface Stage {
  id: string
  name: string
  color: string
}

// Interface para um funil
export interface Funnel {
  id: string
  name: string
  stages: Stage[]
}

// Interface para uma mensagem
export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: string
  status?: "sent" | "delivered" | "read"
} 