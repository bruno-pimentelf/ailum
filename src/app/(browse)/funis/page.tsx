"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ChatDialog } from "@/components/funis/chat-dialog"
import { FunnelHeader } from "@/components/funis/funnel-header"
import { KanbanControls } from "@/components/funis/kanban-controls"
import { KanbanBoard } from "@/components/funis/kanban-board"
import { InfoMessage } from "@/components/funis/info-message"
import { Contact, Funnel } from "@/types/funis"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { AlertCircle, Settings } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

// Interface para mensagens
interface Message {
  key?: {
    id: string;
    remoteJid?: string;
  };
  message?: any;
  timestamp?: string;
  type?: "sent" | "received";
  pushName?: string;
  messageTimestamp?: number;
  conversation?: string;
  webhookEvent?: string;
  rawData?: any;
  [key: string]: any;
}

export default function FunnelsPage() {
  const { data: session } = useSession()
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('grid')
  const kanbanRef = useRef<HTMLDivElement>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [webhookConfigured, setWebhookConfigured] = useState(false)
  const [webhookToken, setWebhookToken] = useState("")
  const [instanceName, setInstanceName] = useState(session?.user?.email || "")
  const [messages, setMessages] = useState<Message[]>([])
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  
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
    
    // Marcar mensagens como lidas
    if (contact.unreadCount) {
      const updatedContacts = contacts.map(c => {
        if (c.id === contact.id) {
          return { ...c, unreadCount: 0, status: "in_conversation" as const }
        }
        return c
      })
      setContacts(updatedContacts)
    }
  }

  // Configurar webhook
  const configureWebhook = async () => {
    if (!instanceName) return;
    
    try {
      const response = await fetch("/api/whatsapp/webhook/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instanceName }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setWebhookConfigured(true);
        setWebhookToken(data.token || "");
        toast({
          title: "Webhook configurado com sucesso",
          description: "Agora você receberá mensagens em tempo real.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao configurar webhook",
          description: data.error || "Ocorreu um erro ao configurar o webhook.",
        });
      }
    } catch (error) {
      console.error("Erro ao configurar webhook:", error);
      toast({
        variant: "destructive",
        title: "Erro ao configurar webhook",
        description: "Ocorreu um erro ao configurar o webhook.",
      });
    }
  };

  // Buscar mensagens
  const fetchMessages = async () => {
    if (!instanceName) return;
    
    try {
      const response = await fetch(`/api/whatsapp/webhook?instance=${instanceName}`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar mensagens");
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data.messages)) {
        setMessages(data.messages);
        processNewMessages(data.messages);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Processar novas mensagens e atualizar contatos
  const processNewMessages = (newMessages: Message[]) => {
    const receivedMessages = newMessages.filter(msg => 
      msg.type === "received" && 
      (msg.conversation || (msg.message?.conversation) || 
       (msg.message?.extendedTextMessage?.text))
    );
    
    if (receivedMessages.length === 0) return;
    
    // Atualizar contatos existentes ou adicionar novos
    const updatedContacts = [...contacts];
    
    receivedMessages.forEach(msg => {
      const phoneNumber = msg.key?.remoteJid?.split('@')[0] || "";
      const contactName = msg.pushName || `Contato ${phoneNumber.slice(-4)}`;
      const messageContent = msg.conversation || 
                            msg.message?.conversation || 
                            msg.message?.extendedTextMessage?.text || "";
      const timestamp = new Date(msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now());
      
      // Verificar se o contato já existe
      const existingContactIndex = updatedContacts.findIndex(
        c => c.phone === phoneNumber || c.phone === `+${phoneNumber}`
      );
      
      if (existingContactIndex >= 0) {
        // Atualizar contato existente
        updatedContacts[existingContactIndex] = {
          ...updatedContacts[existingContactIndex],
          lastActivity: formatTimestamp(timestamp),
          status: "needs_response",
          unreadCount: (updatedContacts[existingContactIndex].unreadCount || 0) + 1
        };
      } else {
        // Adicionar novo contato
        const newContact: Contact = {
          id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: contactName,
          phone: phoneNumber,
          stageId: selectedFunnel?.stages[0]?.id || "novo-contato", // Estágio inicial
          status: "needs_response",
          lastActivity: formatTimestamp(timestamp),
          unreadCount: 1,
          value: 0 // Valor inicial zero para novos contatos
        };
        
        updatedContacts.push(newContact);
        
        // Notificar sobre novo contato
        toast({
          title: "Novo contato recebido",
          description: `${contactName} enviou uma mensagem: "${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}"`,
        });
      }
    });
    
    setContacts(updatedContacts);
  };

  // Formatar timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return `Hoje, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  // Enviar mensagem
  const sendMessage = async (phoneNumber: string, message: string): Promise<boolean> => {
    if (!instanceName || !phoneNumber || !message) return false;
    
    try {
      const response = await fetch("/api/whatsapp/messages/send-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceName,
          phoneNumber,
          message,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }
      
      // Atualizar status do contato
      const updatedContacts = contacts.map(c => {
        if (c.phone === phoneNumber || c.phone === `+${phoneNumber}`) {
          return { 
            ...c, 
            status: "waiting_client" as const,
            lastActivity: formatTimestamp(new Date())
          };
        }
        return c;
      });
      
      setContacts(updatedContacts as Contact[]);
      
      // Buscar mensagens atualizadas
      fetchMessages();
      
      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar a mensagem.",
      });
      return false;
    }
  };

  // Atualizar estágio do contato
  const updateContactStage = (contactId: string, newStageId: string) => {
    const updatedContacts = contacts.map(c => {
      if (c.id === contactId) {
        return { ...c, stageId: newStageId };
      }
      return c;
    });
    
    setContacts(updatedContacts as Contact[]);
    
    // Notificar sobre a mudança de estágio
    const contact = contacts.find(c => c.id === contactId);
    const stage = selectedFunnel?.stages.find(s => s.id === newStageId);
    
    if (contact && stage) {
      toast({
        title: "Contato movido",
        description: `${contact.name} foi movido para ${stage.name}`,
      });
    }
  };

  // Atualizar contato
  const updateContact = (updatedContact: Contact) => {
    const updatedContacts = contacts.map(c => {
      if (c.id === updatedContact.id) {
        return updatedContact;
      }
      return c;
    });
    
    setContacts(updatedContacts);
  };

  // Carregar funis do localStorage
  const loadFunnels = () => {
    try {
      const savedFunnels = localStorage.getItem("funnels");
      
      if (savedFunnels) {
        const parsedFunnels = JSON.parse(savedFunnels);
        setFunnels(parsedFunnels);
        setSelectedFunnel(parsedFunnels[0]);
        return;
      }
    } catch (error) {
      console.error("Erro ao carregar funis do localStorage:", error);
    }
    
    // Dados de exemplo caso não haja funis salvos
    const defaultFunnels: Funnel[] = [
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
    ];
    
    setFunnels(defaultFunnels);
    setSelectedFunnel(defaultFunnels[0]);
    
    // Salvar os funis padrão no localStorage
    localStorage.setItem("funnels", JSON.stringify(defaultFunnels));
  };

  // Efeito para inicializar dados
  useEffect(() => {
    // Carregar funis
    loadFunnels();
    
    // Carregar contatos de exemplo inicialmente
    setContacts([
      {
        id: "contact1",
        name: "Maria Silva",
        phone: "+5527995072522",
        avatar: "/avatars/maria.jpg",
        stageId: "novo-contato",
        status: "needs_response" as const,
        lastActivity: "Hoje, 10:30",
        unreadCount: 2,
        value: 1500
      },
      {
        id: "contact2",
        name: "João Pereira",
        phone: "+5511912345678",
        stageId: "interesse",
        status: "in_conversation" as const,
        lastActivity: "Hoje, 09:15",
        value: 2800
      },
      {
        id: "contact3",
        name: "Ana Oliveira",
        phone: "+5511998765432",
        stageId: "agendamento",
        status: "waiting_client" as const,
        lastActivity: "Ontem, 18:45",
        value: 3500
      },
      {
        id: "contact4",
        name: "Carlos Santos",
        phone: "+5511987651234",
        stageId: "novo-contato",
        status: "needs_response" as const,
        lastActivity: "Ontem, 15:20",
        unreadCount: 1,
        value: 1200
      },
      {
        id: "contact5",
        name: "Fernanda Lima",
        phone: "+5511976543210",
        stageId: "agendamento",
        status: "in_conversation" as const,
        lastActivity: "Ontem, 14:05",
        value: 4200
      },
      {
        id: "contact6",
        name: "Roberto Alves",
        phone: "+5511965432109",
        stageId: "interesse",
        status: "needs_response" as const,
        lastActivity: "Segunda, 16:30",
        unreadCount: 3,
        value: 2500
      },
      {
        id: "contact7",
        name: "Luciana Costa",
        phone: "+5511954321098",
        stageId: "confirmacao",
        status: "resolved" as const,
        lastActivity: "Segunda, 09:10",
        value: 5000
      },
      {
        id: "contact8",
        name: "Marcelo Souza",
        phone: "+5511943210987",
        stageId: "concluido",
        status: "resolved" as const,
        lastActivity: "Domingo, 18:20",
        value: 6500
      }
    ]);
    
    // Configurar webhook e buscar mensagens iniciais
    if (instanceName) {
      configureWebhook();
      fetchMessages();
      
      // Configurar polling para buscar mensagens a cada 10 segundos
      const interval = setInterval(fetchMessages, 10000);
      setPollingInterval(interval);
    }
    
    return () => {
      // Limpar intervalo ao desmontar
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [instanceName]);

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
      {!webhookConfigured && instanceName && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Webhook não configurado</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            Configure o webhook para receber mensagens em tempo real.
            <Button 
              variant="outline" 
              size="sm" 
              onClick={configureWebhook}
              disabled={!instanceName}
            >
              Configurar Webhook
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <FunnelHeader
          selectedFunnel={selectedFunnel}
          funnels={funnels}
          onFunnelChange={setSelectedFunnel}
        />
        
      </div>

      <KanbanControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onScrollLeft={scrollLeft}
        onScrollRight={scrollRight}
      />

      {selectedFunnel && (
        <KanbanBoard
          funnel={selectedFunnel}
          contacts={contacts}
          viewMode={viewMode}
          onChatOpen={handleOpenChat}
          kanbanRef={kanbanRef}
          onContactMove={updateContactStage}
        />
      )}

      <InfoMessage />

      {/* Chat Dialog */}
      {selectedContact && (
        <ChatDialog 
          contact={selectedContact}
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
          onSendMessage={(message) => sendMessage(selectedContact.phone, message)}
          onUpdateStage={(stageId) => updateContactStage(selectedContact.id, stageId)}
          onUpdateContact={updateContact}
        />
      )}
    </div>
  )
}
