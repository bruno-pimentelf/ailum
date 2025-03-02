import { Contact, FunnelStage } from "@/types/funis"
import { ContactCard } from "./contact-card"

interface StageColumnProps {
  stage: FunnelStage
  contacts: Contact[]
  onChatOpen: (contact: Contact) => void
  onDragStart?: (e: React.DragEvent, contactId: string) => void
}

export function StageColumn({ stage, contacts, onChatOpen, onDragStart }: StageColumnProps) {
  return (
    <div className="flex flex-col border border-muted rounded-lg overflow-hidden">
      <div className={`flex items-center gap-2 p-2 ${stage.color.replace('bg-', 'bg-opacity-10 bg-')} border-b-2 ${stage.color.replace('bg-', 'border-')}`}>
        <div className={`h-3 w-3 rounded-full ${stage.color}`} />
        <h3 className="font-medium text-xs sm:text-sm md:text-base truncate">{stage.name}</h3>
        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
          {contacts.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2 sm:gap-3 sm:p-3 bg-muted/20 h-full min-h-[200px] xs:min-h-[250px] sm:min-h-[300px] overflow-y-auto">
        {contacts.map((contact) => (
          <ContactCard 
            key={contact.id}
            contact={contact}
            onChatOpen={onChatOpen}
            onDragStart={onDragStart}
          />
        ))}
        {contacts.length === 0 && (
          <div className="flex items-center justify-center h-20 sm:h-24 border border-dashed rounded-md bg-background">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Nenhum contato nesta etapa
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 