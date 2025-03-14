import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"
import { MessageItem } from "./MessageItem"
import { Message } from "./types"

interface MessagesPanelProps {
  messages: Message[]
  isRefreshing: boolean
  webhookConfigured: boolean
  onRefresh: () => void
}

export function MessagesPanel({
  messages,
  isRefreshing,
  webhookConfigured,
  onRefresh
}: MessagesPanelProps) {
  return (
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
          onClick={onRefresh}
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
            {messages.map((message) => (
              <MessageItem key={message.key?.id || message.id || Date.now()} message={message} />
            ))}
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
  )
} 