import { Clock, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ContactStatus, Contact } from "@/types/funis"
import Image from "next/image"
// Função para obter a cor e texto do status
const getStatusInfo = (status: ContactStatus) => {
  switch (status) {
    case "needs_response":
      return { color: "bg-red-500", text: "Necessita de resposta", textColor: "text-red-500" }
    case "in_conversation":
      return { color: "bg-amber-500", text: "Em conversa", textColor: "text-amber-500" }
    case "waiting_client":
      return { color: "bg-blue-500", text: "Aguardando cliente", textColor: "text-blue-500" }
    case "resolved":
      return { color: "bg-green-500", text: "Resolvido", textColor: "text-green-500" }
  }
}

interface ContactCardProps {
  contact: Contact
  onChatOpen: (contact: Contact) => void
  onDragStart?: (e: React.DragEvent, contactId: string) => void
  onClick: () => void
  onMove: (contactId: string, newStageId: string) => void
}

export function ContactCard({ contact, onChatOpen, onDragStart, onClick, onMove }: ContactCardProps) {
  const statusInfo = getStatusInfo(contact.status)

  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "needs_response":
        return "bg-red-500"
      case "in_conversation":
        return "bg-blue-500"
      case "waiting_client":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow duration-200 cursor-grab active:cursor-grabbing relative"
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, contact.id)}
      onClick={onClick}
    >
      {/* Botão de chat no canto superior direito */}
      <Button 
        size="sm" 
        className="absolute top-2 right-2 h-8 w-8 rounded-full p-0 bg-primary/90 hover:bg-primary shadow-sm z-10"
        onClick={(e) => {
          e.stopPropagation()
          onChatOpen(contact)
        }}
        title="Abrir chat"
      >
        <MessageSquare className="h-4 w-4 text-white" />
        {(contact.unreadCount ?? 0) > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {contact.unreadCount}
          </span>
        )}
      </Button>

      <CardHeader className="p-2 sm:p-3 pb-0 flex flex-row items-center gap-2">
        <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          {contact.avatar ? (
            <Image   
              src={contact.avatar} 
              alt={contact.name}
              width={32}
              height={32}
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
            />
          ) : (
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          )}
        </div>
        <div className="flex-1 overflow-hidden pr-8">
          <div className="flex items-center justify-between">
            <p className="truncate text-xs sm:text-sm font-medium">
              {contact.name}
            </p>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {contact.phone}
          </p>
          
          {contact.value && (
            <div className="text-sm font-semibold text-emerald-600 mt-1">
              {contact.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-3 pt-1 sm:pt-2">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
          <p className={`text-[10px] sm:text-xs font-medium ${statusInfo.textColor}`}>
            {statusInfo.text}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-2 sm:p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{contact.lastActivity}</span>
        </div>
      </CardFooter>
    </Card>
  )
} 