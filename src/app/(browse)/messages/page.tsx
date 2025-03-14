"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { SendMessagePanel } from "@/components/messages/SendMessagePanel"
import { MessagesPanel } from "@/components/messages/MessagesPanel"
import { WhatsAppDemo } from "@/components/messages/WhatsAppDemo"
import { Message } from "@/components/messages/types"

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
      setWebhookToken(data.webhookToken);
      
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
      
      const encodedInstanceName = encodeURIComponent(instanceName.trim());
      const response = await fetch(`/api/whatsapp/webhook/receiver/${encodedInstanceName}?token=${webhookToken}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar mensagens");
      }
      
      const data = await response.json();
      
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
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });
      
      setMessageText("");
      
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
    
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [webhookConfigured, instanceName, webhookToken]);

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

      <div className="grid grid-cols-1 gap-6">
        {/* Nova interface do WhatsApp */}
        <WhatsAppDemo instanceName={instanceName} />
        
        {/* Interface antiga (opcional - pode ser removida) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SendMessagePanel
            phoneNumber={phoneNumber}
            messageText={messageText}
            isSending={isSending}
            webhookConfigured={webhookConfigured}
            onPhoneNumberChange={setPhoneNumber}
            onMessageTextChange={setMessageText}
            onSendMessage={sendMessage}
            onConfigureWebhook={configureWebhook}
          />

          <MessagesPanel
            messages={messages}
            isRefreshing={isRefreshing}
            webhookConfigured={webhookConfigured}
            onRefresh={fetchMessages}
          />
        </div>
      </div>
    </div>
  );
}
