import { Clock, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ContactStatus, Contact } from "@/types/funis"

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
}

export function ContactCard({ contact, onChatOpen, onDragStart }: ContactCardProps) {
  const statusInfo = getStatusInfo(contact.status)

  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow duration-200 cursor-grab active:cursor-grabbing"
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, contact.id)}
    >
      <CardHeader className="p-2 sm:p-3 pb-0 flex flex-row items-center gap-2">
        <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          {contact.avatar ? (
            <img 
              src={contact.avatar} 
              alt={contact.name}
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
            />
          ) : (
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="truncate text-xs sm:text-sm font-medium">
              {contact.name}
            </p>
            {contact.unreadCount && (
              <div className="flex items-center justify-center h-4 sm:h-5 min-w-4 sm:min-w-5 rounded-full bg-primary px-1.5 text-[8px] sm:text-[10px] font-medium text-primary-foreground">
                {contact.unreadCount}
              </div>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {contact.phone}
          </p>
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
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 w-6 sm:h-8 sm:w-8 p-0"
          onClick={() => onChatOpen(contact)}
        >
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 