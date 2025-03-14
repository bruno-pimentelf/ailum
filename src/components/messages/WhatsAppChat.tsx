import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Send, ArrowLeft, MoreVertical, RefreshCw } from "lucide-react"
import { Message } from "./types"
import { WhatsAppMessage } from "./WhatsAppMessage"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface WhatsAppChatProps {
  instanceName: string
  contactNumber: string
  contactName?: string
  onBack?: () => void
  onSendMessage?: (message: string) => Promise<void>
}

export function WhatsAppChat({
  instanceName,
  contactNumber,
  contactName,
  onBack,
  onSendMessage
}: WhatsAppChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  // Formatar o número para exibição
  const formattedNumber = contactNumber.replace('@s.whatsapp.net', '')
  const displayName = contactName || formattedNumber
  
  // Iniciais para o avatar
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
  
  // Buscar mensagens
  const fetchMessages = async (page = 1, append = false) => {
    if (!contactNumber) return
    
    try {
      setIsLoadingMore(page > 1)
      if (page === 1) setIsLoading(true)
      
      const response = await fetch(`/api/whatsapp/messages/find-messages-from-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceName,
          where: {
            key: {
              remoteJid: contactNumber
            }
          },
          page,
          offset: 20
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao buscar mensagens")
      }
      
      const data = await response.json()
      
      if (data.messages && Array.isArray(data.messages.records)) {
        // Formatar as mensagens
        const formattedMessages = data.messages.records.map((msg: any) => {
          // Garantir que temos o tipo correto
          const messageType = msg.type || (msg.key.fromMe ? "sent" : "received");
          
          // Usar os campos já processados pela API
          return {
            ...msg,
            type: messageType
          };
        })
        
        // Inverter a ordem para exibir da mais antiga para a mais nova
        // A API retorna as mensagens da mais nova para a mais antiga
        const sortedMessages = [...formattedMessages].reverse();
        
        // Atualizar o estado
        // Se estamos carregando mais mensagens (página > 1), adicionamos ao início da lista
        // Se estamos carregando a primeira página, substituímos a lista
        setMessages(prev => 
          append ? [...sortedMessages, ...prev] : sortedMessages
        )
        setTotalPages(data.messages.pages || 1)
        setCurrentPage(data.messages.currentPage || 1)
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error)
      toast({
        title: "Erro ao buscar mensagens",
        description: error instanceof Error ? error.message : "Não foi possível buscar as mensagens",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }
  
  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    
    try {
      setIsSending(true)
      
      if (onSendMessage) {
        await onSendMessage(messageText)
      } else {
        // Implementação padrão de envio
        const response = await fetch("/api/whatsapp/messages/send-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instanceName,
            phoneNumber: formattedNumber,
            message: messageText
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Falha ao enviar mensagem")
        }
      }
      
      setMessageText("")
      
      // Recarregar mensagens após envio
      setTimeout(() => fetchMessages(1), 1000)
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Não foi possível enviar a mensagem",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }
  
  // Carregar mais mensagens
  const loadMoreMessages = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      fetchMessages(currentPage + 1, true)
    }
  }
  
  // Detectar quando o usuário rola para o topo para carregar mais mensagens
  const handleScroll = () => {
    if (!chatContainerRef.current) return
    
    const { scrollTop } = chatContainerRef.current
    
    // Quando o usuário rola para o topo (scrollTop próximo de 0), carregamos mais mensagens
    if (scrollTop < 50 && currentPage < totalPages && !isLoadingMore) {
      loadMoreMessages()
    }
  }
  
  // Efeito para buscar mensagens iniciais
  useEffect(() => {
    if (contactNumber) {
      fetchMessages(1)
    }
  }, [contactNumber])
  
  // Efeito para rolar para o final quando as mensagens são carregadas pela primeira vez
  useEffect(() => {
    if (!isLoading && messages.length > 0 && messagesEndRef.current && currentPage === 1) {
      // Rolar para o final do chat quando as mensagens são carregadas pela primeira vez
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [isLoading, messages, currentPage])
  
  // Efeito para preservar a posição de rolagem quando carregamos mais mensagens antigas
  useEffect(() => {
    if (!isLoadingMore && messages.length > 0 && chatContainerRef.current && currentPage > 1) {
      // Quando carregamos mais mensagens antigas (no topo), queremos manter a posição de rolagem
      // para que o usuário não perca o contexto
      chatContainerRef.current.scrollTop = 100
    }
  }, [isLoadingMore, messages, currentPage])
  
  return (
    <Card className="flex flex-col h-[700px] max-w-md mx-auto border border-gray-200 shadow-lg bg-white rounded-xl overflow-hidden">
      {/* Cabeçalho do chat */}
      <CardHeader className="p-3 border-b border-gray-200 flex flex-row items-center space-y-0 gap-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-t-xl">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 transition-all duration-200"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <Avatar className="h-10 w-10 border-2 border-white/80 shadow-md shadow-emerald-500/20">
          <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500">{initials}</AvatarFallback>
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} />
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-medium text-white drop-shadow-sm">{displayName}</h3>
          <p className="text-xs text-emerald-50 flex items-center gap-1">
            {isLoading ? "Carregando..." : (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-200 animate-pulse"></span>
                Online
              </>
            )}
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 transition-all duration-200"
          onClick={() => fetchMessages(1)}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 transition-all duration-200"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      {/* Área de mensagens */}
      <CardContent 
        className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-3"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-3/4 ml-auto bg-gray-100 rounded-xl" />
            <Skeleton className="h-16 w-3/4 bg-gray-100 rounded-xl" />
            <Skeleton className="h-16 w-3/4 ml-auto bg-gray-100 rounded-xl" />
            <Skeleton className="h-16 w-3/4 bg-gray-100 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Botão para carregar mais mensagens */}
            {currentPage < totalPages && !isLoadingMore && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadMoreMessages}
                  className="text-xs text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-all duration-200"
                >
                  Carregar mensagens anteriores
                </Button>
              </div>
            )}
            
            {/* Indicador de carregamento */}
            {isLoadingMore && (
              <div className="text-center py-2">
                <RefreshCw className="h-5 w-5 animate-spin mx-auto text-emerald-500" />
              </div>
            )}
            
            {/* Lista de mensagens */}
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message) => (
                  <WhatsAppMessage 
                    key={message.id || message.key?.id || Date.now()} 
                    message={message} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <p>Nenhuma mensagem encontrada.</p>
                <p className="text-sm mt-1">Envie uma mensagem para começar.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      
      {/* Área de entrada de mensagem */}
      <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white rounded-b-xl">
        <Input
          placeholder="Digite uma mensagem"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          className="flex-1 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
        />
        <Button 
          size="icon"
          onClick={handleSendMessage}
          disabled={isSending || !messageText.trim()}
          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-md shadow-emerald-200/50 transition-all duration-200"
        >
          {isSending ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </Card>
  )
} 