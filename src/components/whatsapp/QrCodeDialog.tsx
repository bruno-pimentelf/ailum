import { AlertCircle, Loader2, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

interface QrCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCodeExpired: boolean
  onRefreshQrCode: () => void
  onSimulateConnection: () => void
  qrCodeBase64?: string
}

export function QrCodeDialog({
  open,
  onOpenChange,
  qrCodeExpired,
  onRefreshQrCode,
  onSimulateConnection,
  qrCodeBase64
}: QrCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp</DialogTitle>
          <DialogDescription>
            Escaneie o código QR com seu WhatsApp para conectar
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            <div className="w-[250px] h-[250px] bg-white p-4 rounded-lg flex items-center justify-center">
              {qrCodeBase64 ? (
                <div className="relative w-[200px] h-[200px]">
                  <Image 
                    src={qrCodeBase64} 
                    alt="QR Code" 
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-40 w-40 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground ml-2">Carregando QR Code...</p>
                </div>
              )}
            </div>
            {qrCodeExpired && (
              <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">QR Code expirado</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              1. Abra o WhatsApp no seu celular<br />
              2. Toque em Menu ou Configurações<br />
              3. Selecione WhatsApp Web<br />
              4. Aponte a câmera para este código
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefreshQrCode}
              className="mr-2"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Atualizar QR Code
            </Button>
            {/* Botão apenas para simulação */}
            <Button 
              size="sm" 
              onClick={onSimulateConnection}
            >
              Simular Conexão
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <p className="text-xs text-muted-foreground">
            Este código expira em 45 segundos
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 