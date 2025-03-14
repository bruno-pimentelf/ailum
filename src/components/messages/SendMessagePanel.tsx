import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, Send, AlertCircle } from "lucide-react"

interface SendMessagePanelProps {
  phoneNumber: string
  messageText: string
  isSending: boolean
  webhookConfigured: boolean
  onPhoneNumberChange: (value: string) => void
  onMessageTextChange: (value: string) => void
  onSendMessage: () => void
  onConfigureWebhook: () => void
}

export function SendMessagePanel({
  phoneNumber,
  messageText,
  isSending,
  webhookConfigured,
  onPhoneNumberChange,
  onMessageTextChange,
  onSendMessage,
  onConfigureWebhook
}: SendMessagePanelProps) {
  return (
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
            onChange={(e) => onPhoneNumberChange(e.target.value)}
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
              onChange={(e) => onMessageTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
            />
            <Button 
              onClick={onSendMessage}
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
                onClick={onConfigureWebhook}
              >
                Configurar agora
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 