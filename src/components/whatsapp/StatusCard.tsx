import { RefreshCw, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectionStatus } from "./types"

// type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

interface StatusCardProps {
  connectionStatus: ConnectionStatus
  onRefreshStatus: () => void
}

export function StatusCard({ connectionStatus, onRefreshStatus }: StatusCardProps) {
  console.log("StatusCard renderizando com status:", connectionStatus);
  
  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="font-medium">Conectado</span>
          </div>
        )
      case "connecting":
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="font-medium">Conectando...</span>
          </div>
        )
      case "close":
        return (
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Sessão Fechada</span>
          </div>
        )
      case "error":
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Erro de Conexão</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-2 text-gray-500">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Desconectado</span>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status da Conexão</CardTitle>
        <CardDescription>
          Informações sobre o estado atual da sua conexão com o WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">Status</span>
            <span className="text-sm">{renderConnectionStatus()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onRefreshStatus}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar Status
        </Button>
      </CardFooter>
    </Card>
  )
} 