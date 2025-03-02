"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { 
  Calendar, 
  Check, 
  ChevronDown, 
  Clock, 
  DollarSign, 
  Edit, 
  Flag, 
  Phone, 
  Send, 
  Tag, 
  User, 
  X 
} from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Tipos para o funil e mensagens
type FunnelStage = {
  id: string
  name: string
  color: string
}

type Funnel = {
  id: string
  name: string
  stages: FunnelStage[]
}

type ContactStatus = "needs_response" | "in_conversation" | "waiting_client" | "resolved"

type Contact = {
  id: string
  name: string
  phone: string
  avatar?: string
  stageId: string
  status: ContactStatus
  lastActivity: string
  unreadCount?: number
  addedAt?: string
  serviceInterest?: string
  funnelId?: string
  priority?: "low" | "medium" | "high"
  estimatedValue?: number
  lastContactDate?: string
  closingDate?: string
  channel?: string
}

type Message = {
  id: string
  contactId: string
  content: string
  timestamp: string
  isFromContact: boolean
  isRead: boolean
}

// Dados de exemplo para funis
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

// Canais de venda
const salesChannels = [
  "Indicação",
  "Redes Sociais",
  "Google",
  "Comercial de TV",
  "Outdoor",
  "Outro"
]

// Serviços de interesse
const services = [
  "Consulta Dermatológica",
  "Botox",
  "Preenchimento Facial",
  "Limpeza de Pele",
  "Tratamento para Acne",
  "Cirurgia Plástica",
  "Peeling Químico",
  "Microagulhamento",
  "Outro"
]

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Função para obter a cor e texto do status
const getStatusInfo = (status: ContactStatus) => {
  switch (status) {
    case "needs_response":
      return { color: "bg-red-500", text: "Necessita de resposta", textColor: "text-red-500", badgeVariant: "destructive" }
    case "in_conversation":
      return { color: "bg-amber-500", text: "Em conversa", textColor: "text-amber-500", badgeVariant: "default" }
    case "waiting_client":
      return { color: "bg-blue-500", text: "Aguardando cliente", textColor: "text-blue-500", badgeVariant: "secondary" }
    case "resolved":
      return { color: "bg-green-500", text: "Resolvido", textColor: "text-green-500", badgeVariant: "outline" }
  }
}

// Função para obter a cor da prioridade
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "text-green-500"
    case "medium":
      return "text-amber-500"
    case "high":
      return "text-red-500"
    default:
      return "text-muted-foreground"
  }
}

// Função para obter o texto da prioridade
const getPriorityText = (priority: string) => {
  switch (priority) {
    case "low":
      return "Baixa"
    case "medium":
      return "Média"
    case "high":
      return "Alta"
    default:
      return "Não definida"
  }
}

interface ChatDialogProps {
  contact: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatDialog({ contact, open, onOpenChange }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [editedContact, setEditedContact] = useState<Contact>({ ...contact })
  const [isEditing, setIsEditing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Efeito para carregar mensagens do contato
  useEffect(() => {
    // Aqui seria uma chamada API para buscar as mensagens
    // Simulando mensagens para demonstração
    const demoMessages: Message[] = [
      {
        id: "msg1",
        contactId: contact.id,
        content: "Olá, gostaria de informações sobre consultas dermatológicas.",
        timestamp: "Hoje, 10:30",
        isFromContact: true,
        isRead: true
      },
      {
        id: "msg2",
        contactId: contact.id,
        content: "Olá! Claro, temos disponibilidade para consultas dermatológicas. Qual seria o melhor dia para você?",
        timestamp: "Hoje, 10:35",
        isFromContact: false,
        isRead: true
      },
      {
        id: "msg3",
        contactId: contact.id,
        content: "Seria possível na próxima terça-feira pela manhã?",
        timestamp: "Hoje, 10:40",
        isFromContact: true,
        isRead: true
      },
      {
        id: "msg4",
        contactId: contact.id,
        content: "Sim, temos horários disponíveis na terça. Poderia ser às 9h ou às 11h. Qual prefere?",
        timestamp: "Hoje, 10:45",
        isFromContact: false,
        isRead: true
      },
      {
        id: "msg5",
        contactId: contact.id,
        content: "Às 9h seria perfeito. Preciso levar algum documento?",
        timestamp: "Hoje, 10:50",
        isFromContact: true,
        isRead: false
      }
    ]
    
    setMessages(demoMessages)
  }, [contact.id])

  // Efeito para rolar para o final das mensagens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Efeito para preencher dados do contato
  useEffect(() => {
    // Simulando dados adicionais do contato
    const enhancedContact: Contact = {
      ...contact,
      addedAt: contact.addedAt || "15/02/2023, 14:30",
      serviceInterest: contact.serviceInterest || "Consulta Dermatológica",
      funnelId: contact.funnelId || "consulta-inicial",
      priority: contact.priority || "medium",
      estimatedValue: contact.estimatedValue || 250,
      lastContactDate: contact.lastContactDate || "Hoje, 10:50",
      closingDate: contact.closingDate || "25/02/2023",
      channel: contact.channel || "Redes Sociais"
    }
    
    setEditedContact(enhancedContact)
  }, [contact])

  // Função para enviar mensagem
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return
    
    const newMsg: Message = {
      id: `msg${Date.now()}`,
      contactId: contact.id,
      content: newMessage,
      timestamp: "Agora",
      isFromContact: false,
      isRead: true
    }
    
    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  // Função para salvar alterações do contato
  const handleSaveContact = () => {
    // Aqui seria uma chamada API para salvar as alterações
    setIsEditing(false)
    // Atualizar o contato no estado global (não implementado neste exemplo)
  }

  // Função para obter o funil pelo ID
  const getFunnelById = (id: string) => {
    return funnels.find(funnel => funnel.id === id)
  }

  // Função para obter os estágios do funil atual
  const getCurrentFunnelStages = () => {
    const funnel = getFunnelById(editedContact.funnelId || "")
    return funnel ? funnel.stages : []
  }

  // Função para obter o nome do estágio pelo ID
  const getStageName = (stageId: string) => {
    const stages = getCurrentFunnelStages()
    const stage = stages.find(s => s.id === stageId)
    return stage ? stage.name : "Desconhecido"
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-0 flex flex-col h-full">
        <div className="flex flex-col h-full">
          {/* Cabeçalho */}
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {editedContact.avatar ? (
                    <AvatarImage src={editedContact.avatar} alt={editedContact.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <SheetTitle className="text-left">{editedContact.name}</SheetTitle>
                  <SheetDescription className="text-left flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {editedContact.phone}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button variant="default" size="sm" onClick={handleSaveContact}>
                      <Check className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetHeader>

          {/* Conteúdo principal */}
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Painel de informações do contato */}
            <div className="w-full md:w-1/3 p-4 border-r overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informações do Contato</h3>
                  
                  <div className="space-y-3">
                    {/* Data de adição */}
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Data de adição</p>
                        {isEditing ? (
                          <Input 
                            value={editedContact.addedAt} 
                            onChange={(e) => setEditedContact({...editedContact, addedAt: e.target.value})}
                            className="h-7 mt-1"
                          />
                        ) : (
                          <p className="text-sm">{editedContact.addedAt}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Serviço de interesse */}
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Serviço de interesse</p>
                        {isEditing ? (
                          <Select 
                            value={editedContact.serviceInterest}
                            onValueChange={(value) => setEditedContact({...editedContact, serviceInterest: value})}
                          >
                            <SelectTrigger className="h-7 mt-1">
                              <SelectValue placeholder="Selecione um serviço" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm">{editedContact.serviceInterest}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Status (Coluna) */}
                    <div className="flex items-start gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        {isEditing ? (
                          <Select 
                            value={editedContact.stageId}
                            onValueChange={(value) => setEditedContact({...editedContact, stageId: value})}
                          >
                            <SelectTrigger className="h-7 mt-1">
                              <SelectValue placeholder="Selecione um status" />
                            </SelectTrigger>
                            <SelectContent>
                              {getCurrentFunnelStages().map((stage) => (
                                <SelectItem key={stage.id} value={stage.id}>
                                  {stage.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm">{getStageName(editedContact.stageId)}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Funil */}
                    <div className="flex items-start gap-2">
                      <ChevronDown className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Funil</p>
                        {isEditing ? (
                          <Select 
                            value={editedContact.funnelId}
                            onValueChange={(value) => setEditedContact({...editedContact, funnelId: value})}
                          >
                            <SelectTrigger className="h-7 mt-1">
                              <SelectValue placeholder="Selecione um funil" />
                            </SelectTrigger>
                            <SelectContent>
                              {funnels.map((funnel) => (
                                <SelectItem key={funnel.id} value={funnel.id}>
                                  {funnel.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm">{getFunnelById(editedContact.funnelId || "")?.name}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Prioridade */}
                    <div className="flex items-start gap-2">
                      <Flag className={`h-4 w-4 ${getPriorityColor(editedContact.priority || "")} mt-0.5`} />
                      <div>
                        <p className="text-xs text-muted-foreground">Prioridade</p>
                        {isEditing ? (
                          <Select 
                            value={editedContact.priority}
                            onValueChange={(value: "low" | "medium" | "high") => 
                              setEditedContact({...editedContact, priority: value})}
                          >
                            <SelectTrigger className="h-7 mt-1">
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Baixa</SelectItem>
                              <SelectItem value="medium">Média</SelectItem>
                              <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className={`text-sm ${getPriorityColor(editedContact.priority || "")}`}>
                            {getPriorityText(editedContact.priority || "")}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Valor estimado */}
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Valor estimado</p>
                        {isEditing ? (
                          <Input 
                            type="number"
                            value={editedContact.estimatedValue} 
                            onChange={(e) => setEditedContact({
                              ...editedContact, 
                              estimatedValue: parseFloat(e.target.value)
                            })}
                            className="h-7 mt-1"
                          />
                        ) : (
                          <p className="text-sm">{formatCurrency(editedContact.estimatedValue || 0)}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Data do último contato */}
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Último contato</p>
                        {isEditing ? (
                          <Input 
                            value={editedContact.lastContactDate} 
                            onChange={(e) => setEditedContact({...editedContact, lastContactDate: e.target.value})}
                            className="h-7 mt-1"
                          />
                        ) : (
                          <p className="text-sm">{editedContact.lastContactDate}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Data de fechamento */}
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Data de fechamento</p>
                        {isEditing ? (
                          <Input 
                            value={editedContact.closingDate} 
                            onChange={(e) => setEditedContact({...editedContact, closingDate: e.target.value})}
                            className="h-7 mt-1"
                          />
                        ) : (
                          <p className="text-sm">{editedContact.closingDate}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Canal */}
                    <div className="flex items-start gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Canal</p>
                        {isEditing ? (
                          <Select 
                            value={editedContact.channel}
                            onValueChange={(value) => setEditedContact({...editedContact, channel: value})}
                          >
                            <SelectTrigger className="h-7 mt-1">
                              <SelectValue placeholder="Selecione um canal" />
                            </SelectTrigger>
                            <SelectContent>
                              {salesChannels.map((channel) => (
                                <SelectItem key={channel} value={channel}>
                                  {channel}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm">{editedContact.channel}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Área de chat */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Mensagens */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "flex",
                        message.isFromContact ? "justify-start" : "justify-end"
                      )}
                    >
                      <div 
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.isFromContact 
                            ? "bg-muted text-foreground" 
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div 
                          className={cn(
                            "flex items-center justify-end gap-1 mt-1",
                            message.isFromContact ? "text-muted-foreground" : "text-primary-foreground/80"
                          )}
                        >
                          <p className="text-xs">{message.timestamp}</p>
                          {!message.isFromContact && (
                            <Check className={cn(
                              "h-3 w-3",
                              message.isRead ? "text-blue-500" : ""
                            )} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Área de digitação */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          onClick={handleSendMessage}
                          disabled={newMessage.trim() === ""}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enviar mensagem</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 