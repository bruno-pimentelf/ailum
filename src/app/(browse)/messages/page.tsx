"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { RefreshCw, Send, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  [key: string]: any; // Permitir qualquer outra propriedade
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [instanceName, setInstanceName] = useState(session?.user?.email || "")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [webhookConfigured, setWebhookConfigured] = useState(false)
  const [webhookToken, setWebhookToken] = useState("")

  // Configurar webhook
  const configureWebhook = async () => {
    if (!instanceName) return;
    
    try {
      const response = await fetch("/api/whatsapp/webhook/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceName: instanceName.trim()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao configurar webhook");
      }
      
      const data = await response.json();
      console.log("Webhook configurado:", data);
      
      setWebhookConfigured(true);
      toast({
        title: "Webhook configurado",
        description: "Seu webhook foi configurado com sucesso",
      });
      
      // Carregar mensagens iniciais
      fetchMessages();
    } catch (error) {
      console.error("Erro ao configurar webhook:", error);
      toast({
        title: "Erro ao configurar webhook",
        description: error instanceof Error ? error.message : "Não foi possível configurar o webhook",
        variant: "destructive"
      });
    }
  };

  // Buscar mensagens
  const fetchMessages = async () => {
    if (!instanceName) return;
    
    try {
      setIsRefreshing(true);
      
      // Usar encodeURIComponent para garantir que o email seja codificado corretamente
      const encodedInstanceName = encodeURIComponent(instanceName.trim());
      const response = await fetch(`/api/whatsapp/webhook/receiver/${encodedInstanceName}?token=${webhookToken}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar mensagens");
      }
      
      const data = await response.json();
      console.log("Mensagens recebidas:", data);
      
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast({
        title: "Erro ao buscar mensagens",
        description: error instanceof Error ? error.message : "Não foi possível buscar as mensagens",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!instanceName || !phoneNumber || !messageText) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o número de telefone e a mensagem",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSending(true);
      
      const response = await fetch("/api/whatsapp/messages/send-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceName: instanceName.trim(),
          phoneNumber,
          message: messageText
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao enviar mensagem");
      }
      
      const data = await response.json();
      console.log("Mensagem enviada:", data);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });
      
      // Limpar campo de mensagem
      setMessageText("");
      
      // Atualizar lista de mensagens após um breve delay
      setTimeout(fetchMessages, 1000);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Atualizar instanceName quando a sessão mudar
  useEffect(() => {
    if (session?.user?.email) {
      setInstanceName(session.user.email);
    }
  }, [session]);

  // Efeito para simular o carregamento inicial
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Atualizar mensagens periodicamente
  useEffect(() => {
    if (!webhookConfigured) return;
    
    const fetchMessages = async () => {
      try {
        // Usar encodeURIComponent para garantir que o email seja codificado corretamente
        const encodedInstanceName = encodeURIComponent(instanceName.trim());
        const response = await fetch(`/api/whatsapp/webhook/receiver/${encodedInstanceName}?token=${webhookToken}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao buscar mensagens");
        }
        
        const data = await response.json();
        console.log("Mensagens recebidas:", data);
        
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };
    
    // Buscar mensagens imediatamente
    fetchMessages();
    
    // Configurar polling a cada 5 segundos
    const interval = setInterval(fetchMessages, 5000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [webhookConfigured, instanceName, webhookToken]);

  // Renderizar mensagem
  const renderMessage = (message: Message) => {
    console.log('Dados completos da mensagem:', message); // Debug

    const isReceived = message.type === "received";
    
    // Tentar extrair o conteúdo da mensagem de várias formas possíveis
    const textContent = 
      message.conversation ||
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      message.text ||
      message.body ||
      (typeof message.message === 'string' ? message.message : null) ||
      JSON.stringify(message.message || message);
    
    // Tentar extrair o timestamp de várias formas possíveis
    const timestamp = message.timestamp || 
      (message.messageTimestamp ? new Date(message.messageTimestamp * 1000).toISOString() : null) ||
      new Date().toISOString();
    
    const formattedTime = new Date(timestamp).toLocaleTimeString();
    const formattedDate = new Date(timestamp).toLocaleDateString();
    
    // Tentar extrair o remetente de várias formas possíveis
    const sender = isReceived 
      ? (message.pushName || 
         message.key?.remoteJid?.split('@')[0] || 
         message.from?.split('@')[0] ||
         "Desconhecido")
      : "Você";
    
    // Log para debug
    console.log('Mensagem processada:', {
      id: message.key?.id || 'no-id',
      type: message.type,
      content: textContent,
      sender,
      timestamp
    });
    
    return (
      <div 
        key={message.key?.id || message.id || Date.now()}
        className={`p-3 rounded-lg mb-2 max-w-[80%] ${
          isReceived 
            ? "bg-gray-100 self-start" 
            : "bg-blue-100 self-end"
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="font-medium">{sender}</span>
          <span className="text-xs text-gray-500 ml-2">{formattedTime}</span>
        </div>
        <p className="text-sm">{textContent}</p>
        <div className="text-xs text-gray-500 text-right mt-1">{formattedDate}</div>
        {message.webhookEvent && (
          <div className="text-xs text-gray-400 mt-1">
            Evento: {message.webhookEvent}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mensagens do WhatsApp</h1>
          <p className="text-muted-foreground mt-1">
            Visualize e envie mensagens através da sua instância do WhatsApp
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Envio de Mensagens */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Enviar Mensagem</CardTitle>
            <CardDescription>
              Envie uma mensagem para qualquer número de WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número de Telefone</Label>
              <Input 
                id="phoneNumber" 
                placeholder="Ex: 5511999999999" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Digite o número com código do país e DDD, sem espaços ou caracteres especiais
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="messageText">Mensagem</Label>
              <div className="flex gap-2">
                <Input 
                  id="messageText" 
                  placeholder="Digite sua mensagem..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={sendMessage}
                  disabled={isSending}
                >
                  {isSending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!webhookConfigured && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Webhook não configurado</AlertTitle>
                <AlertDescription>
                  Configure o webhook para receber mensagens em tempo real.
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal ml-1"
                    onClick={configureWebhook}
                  >
                    Configurar agora
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Painel de Mensagens */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Histórico de Mensagens</CardTitle>
              <CardDescription>
                Mensagens enviadas e recebidas através do seu WhatsApp
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchMessages}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {isRefreshing && messages.length === 0 ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : messages.length > 0 ? (
              <div className="flex flex-col h-[600px] overflow-y-auto p-2">
                {messages.map(renderMessage)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {webhookConfigured 
                  ? "Nenhuma mensagem encontrada. Envie uma mensagem para começar."
                  : "Configure o webhook para começar a receber mensagens."
                }
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
