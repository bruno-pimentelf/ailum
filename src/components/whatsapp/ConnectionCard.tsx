import Image from "next/image"
import { AlertCircle, Check, Loader2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ConnectionStatus } from "./types"

// type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

interface ConnectionCardProps {
  connectionStatus: ConnectionStatus
  autoReconnect: boolean
  onAutoReconnectChange: (checked: boolean) => void
  onConnect: () => void
  onDisconnect: () => void
  onGenerateNewQrCode: () => void
  isDisconnecting?: boolean
  instanceData?: {
    number: string | null
    profileName: string | null
    profilePicUrl: string | null
    stats: {
      messages: number
      contacts: number
      chats: number
    }
  } | null
}

export function ConnectionCard({
  connectionStatus,
  autoReconnect,
  onAutoReconnectChange,
  onConnect,
  onDisconnect,
  onGenerateNewQrCode,
  isDisconnecting = false,
  instanceData
}: ConnectionCardProps) {
  console.log("ConnectionCard renderizando com status:", connectionStatus);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar WhatsApp</CardTitle>
        <CardDescription>
          Conecte seu número de WhatsApp para começar a receber e enviar mensagens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionStatus === "connected" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
              <div className="flex flex-col items-center gap-2 text-center">
                {instanceData?.profilePicUrl ? (
                  <Image
                    src={instanceData.profilePicUrl}
                    alt="WhatsApp Profile"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full"
                  />
                ) : (
                  <Image
                    src="/assets/images/whatsapp.png"
                    alt="WhatsApp"
                    width={64}
                    height={64}
                    className="h-16 w-16 text-primary"
                  />
                )}
                <h3 className="text-lg font-medium">WhatsApp Conectado</h3>
                <p className="text-sm text-muted-foreground">
                  {instanceData?.profileName || "Seu WhatsApp está conectado e pronto para uso"}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  <span>{instanceData?.number || "Número não disponível"}</span>
                </div>
                {instanceData?.stats && (
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-medium">{instanceData.stats.messages}</div>
                      <div className="text-muted-foreground">Mensagens</div>
                    </div>
                    <div>
                      <div className="font-medium">{instanceData.stats.contacts}</div>
                      <div className="text-muted-foreground">Contatos</div>
                    </div>
                    <div>
                      <div className="font-medium">{instanceData.stats.chats}</div>
                      <div className="text-muted-foreground">Chats</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Alert>
              <Check className="h-4 w-4" />
              <AlertTitle>Conexão estabelecida</AlertTitle>
              <AlertDescription>
                Seu WhatsApp está conectado e pronto para receber mensagens.
              </AlertDescription>
            </Alert>
          </div>
        ) : connectionStatus === "connecting" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-16 w-16 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <h3 className="text-lg font-medium">Conectando WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Aguarde enquanto estabelecemos a conexão com o WhatsApp
                </p>
              </div>
            </div>
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle>Conectando</AlertTitle>
              <AlertDescription>
                Escaneie o QR Code com seu WhatsApp para completar a conexão.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
              <div className="flex flex-col items-center gap-2 text-center">
                <Image
                  src="/assets/images/whatsapp.png"
                  alt="WhatsApp"
                  width={64}
                  height={64}
                  className="h-16 w-16 text-muted-foreground opacity-50"
                />
                <h3 className="text-lg font-medium">WhatsApp Desconectado</h3>
                <p className="text-sm text-muted-foreground">
                  {connectionStatus === "close" 
                    ? "Sua sessão anterior foi fechada. Conecte novamente para continuar."
                    : "Conecte seu WhatsApp para começar a receber mensagens"}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-reconnect" 
                  checked={autoReconnect}
                  onCheckedChange={onAutoReconnectChange}
                />
                <Label htmlFor="auto-reconnect">Reconectar automaticamente</Label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {connectionStatus === "connected" ? (
          <Button 
            variant="destructive" 
            onClick={onDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Desconectando...
              </>
            ) : (
              "Desconectar"
            )}
          </Button>
        ) : connectionStatus === "connecting" ? (
          <>
            <Button 
              variant="outline" 
              onClick={onGenerateNewQrCode}
            >
              Gerar Novo QR Code
            </Button>
            <Button 
              variant="outline" 
              onClick={onDisconnect} 
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Cancelar"
              )}
            </Button>
          </>
        ) : (
          <Button onClick={onConnect}>
            {connectionStatus === "close" ? "Conectar" : "Gerar QR Code"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 