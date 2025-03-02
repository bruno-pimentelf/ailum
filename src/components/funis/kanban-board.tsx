import { useRef } from "react"
import { Contact, Funnel } from "@/types/funis"
import { StageColumn } from "./stage-column"

interface KanbanBoardProps {
  funnel: Funnel
  contacts: Contact[]
  viewMode: 'scroll' | 'grid'
  onChatOpen: (contact: Contact) => void
  kanbanRef: React.RefObject<HTMLDivElement>
}

export function KanbanBoard({ funnel, contacts, viewMode, onChatOpen, kanbanRef }: KanbanBoardProps) {
  // Filtra contatos pelo funil selecionado
  const getContactsForStage = (stageId: string) => {
    return contacts.filter(contact => contact.stageId === stageId)
  }

  return (
    <div 
      ref={kanbanRef}
      className={`
        ${viewMode === 'scroll' 
          ? 'flex flex-nowrap overflow-x-auto pr-4' 
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
        } 
        pb-6 gap-4 md:gap-5 snap-x
      `}
      style={{ 
        scrollbarWidth: 'thin',
        msOverflowStyle: 'none'
      }}
    >
      {funnel.stages.map((stage) => (
        <div 
          key={stage.id} 
          className={`
            ${viewMode === 'scroll' 
              ? 'flex-shrink-0 flex-grow-0 w-[260px] xs:w-[280px] sm:w-[300px] snap-start' 
              : 'w-full h-full'
            }
          `}
        >
          <StageColumn
            stage={stage}
            contacts={getContactsForStage(stage.id)}
            onChatOpen={onChatOpen}
          />
        </div>
      ))}
    </div>
  )
} 