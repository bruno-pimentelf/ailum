"use client"

import { useState, useRef, useEffect } from "react"
import { ChatDialog } from "@/components/funis/chat-dialog"
import { FunnelHeader } from "@/components/funis/funnel-header"
import { KanbanControls } from "@/components/funis/kanban-controls"
import { KanbanBoard } from "@/components/funis/kanban-board"
import { InfoMessage } from "@/components/funis/info-message"
import { Contact, Funnel } from "@/types/funis"

// Dados de exemplo
const funnels: Funnel[] = [
  {
    id: "consulta-inicial",
    name: "Consulta Inicial",
    stages: [
      { id: "novo-contato", name: "Novo Contato", color: "bg-blue-500" },
      { id: "interesse", name: "Demonstrou Interesse", color: "bg-purple-500" },
      { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
      { id: "confirmacao", name: "Confirmação", color: "bg-green-500" },
      { id: "concluido", name: "Consulta Realizada", color: "bg-emerald-500" },
    ],
  },
  {
    id: "procedimento-estetico",
    name: "Procedimento Estético",
    stages: [
      { id: "contato-inicial", name: "Contato Inicial", color: "bg-blue-500" },
      { id: "avaliacao", name: "Avaliação", color: "bg-indigo-500" },
      { id: "orcamento", name: "Orçamento", color: "bg-purple-500" },
      { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
      { id: "realizado", name: "Procedimento Realizado", color: "bg-green-500" },
    ],
  },
  {
    id: "cirurgia",
    name: "Cirurgia Plástica",
    stages: [
      { id: "contato-inicial", name: "Contato Inicial", color: "bg-blue-500" },
      { id: "consulta", name: "Consulta", color: "bg-indigo-500" },
      { id: "exames", name: "Exames", color: "bg-violet-500" },
      { id: "orcamento", name: "Orçamento", color: "bg-purple-500" },
      { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
      { id: "pre-op", name: "Pré-Operatório", color: "bg-orange-500" },
      { id: "realizada", name: "Cirurgia Realizada", color: "bg-green-500" },
      { id: "pos-op", name: "Pós-Operatório", color: "bg-emerald-500" },
    ],
  },
]

// Contatos de exemplo
const contacts: Contact[] = [
  {
    id: "contact1",
    name: "Maria Silva",
    phone: "+5511987654321",
    avatar: "/avatars/maria.jpg",
    stageId: "novo-contato",
    status: "needs_response",
    lastActivity: "Hoje, 10:30",
    unreadCount: 2
  },
  {
    id: "contact2",
    name: "João Pereira",
    phone: "+5511912345678",
    stageId: "interesse",
    status: "in_conversation",
    lastActivity: "Hoje, 09:15"
  },
  {
    id: "contact3",
    name: "Ana Oliveira",
    phone: "+5511998765432",
    stageId: "agendamento",
    status: "waiting_client",
    lastActivity: "Ontem, 18:45"
  },
  {
    id: "contact4",
    name: "Carlos Santos",
    phone: "+5511987651234",
    stageId: "novo-contato",
    status: "needs_response",
    lastActivity: "Ontem, 15:20",
    unreadCount: 1
  },
  {
    id: "contact5",
    name: "Fernanda Lima",
    phone: "+5511976543210",
    stageId: "agendamento",
    status: "in_conversation",
    lastActivity: "Ontem, 14:05"
  },
  {
    id: "contact6",
    name: "Roberto Alves",
    phone: "+5511965432109",
    stageId: "interesse",
    status: "needs_response",
    lastActivity: "Segunda, 16:30",
    unreadCount: 3
  },
  {
    id: "contact7",
    name: "Luciana Costa",
    phone: "+5511954321098",
    stageId: "confirmacao",
    status: "resolved",
    lastActivity: "Segunda, 09:10"
  },
  {
    id: "contact8",
    name: "Marcelo Souza",
    phone: "+5511943210987",
    stageId: "concluido",
    status: "resolved",
    lastActivity: "Domingo, 18:20"
  },
]

export default function FunnelsPage() {
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel>(funnels[0])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('grid')
  const kanbanRef = useRef<HTMLDivElement>(null)
  
  // Funções para navegação horizontal do Kanban
  const scrollLeft = () => {
    if (kanbanRef.current) {
      kanbanRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (kanbanRef.current) {
      kanbanRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  // Função para abrir o chat com um contato
  const handleOpenChat = (contact: Contact) => {
    setSelectedContact(contact)
    setIsChatOpen(true)
  }

  // Efeito para ajustar o modo de visualização com base no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('scroll')
      } else {
        setViewMode('grid')
      }
    }
    
    // Verificar o tamanho inicial da tela
    handleResize()
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', handleResize)
    
    // Limpar listener ao desmontar
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <FunnelHeader
        selectedFunnel={selectedFunnel}
        funnels={funnels}
        onFunnelChange={setSelectedFunnel}
      />

      <KanbanControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onScrollLeft={scrollLeft}
        onScrollRight={scrollRight}
      />

      <KanbanBoard
        funnel={selectedFunnel}
        contacts={contacts}
        viewMode={viewMode}
        onChatOpen={handleOpenChat}
        kanbanRef={kanbanRef}
      />

      <InfoMessage />

      {/* Chat Dialog */}
      {selectedContact && (
        <ChatDialog 
          contact={selectedContact}
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
        />
      )}
    </div>
  )
}
