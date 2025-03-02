"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ConnectionCard,
  StatusCard,
  QrCodeDialog,
  ConnectionStatus
} from "@/components/whatsapp"
import { toast } from "@/components/ui/use-toast"

interface WhatsAppInstance {
  instanceName: string
  instanceId: string
  status: string
}

interface QrCodeData {
  base64: string
  code: string
}

export default function WhatsAppPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [autoReconnect, setAutoReconnect] = useState(true)
  const [qrCodeExpired, setQrCodeExpired] = useState(false)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrCodeBase64, setQrCodeBase64] = useState<string | undefined>(undefined)
  const [instanceData, setInstanceData] = useState<WhatsAppInstance | null>(null)
  const [isCreatingInstance, setIsCreatingInstance] = useState(false)
  const [instanceName, setInstanceName] = useState(session?.user?.email || "")
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  // Função para verificar o status da instância
  const checkInstanceStatus = useCallback(async () => {
    if (!instanceName) return;

    try {
      console.log("Verificando status para:", instanceName);
      const response = await fetch(`/api/whatsapp/instance/status?instanceName=${encodeURIComponent(instanceName.trim())}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        console.error("Resposta não ok:", response.status);
        setConnectionStatus("disconnected");
        setInstanceData(null);
        return;
      }

      const data = await response.json();
      console.log("Status da instância recebido:", JSON.stringify(data));

      // Atualizar o status da conexão com base na resposta da API
      if (data.instance?.state) {
        const state = data.instance.state;
        console.log("Estado da instância:", state);
        
        if (state === "open" || state === "connected") {
          console.log("Definindo status como conectado");
          setConnectionStatus("connected");
          // Atualizar instanceData se não existir ou se o estado mudou
          setInstanceData({
            instanceName: instanceName,
            instanceId: instanceName,
            status: "connected"
          });
        } else if (state === "connecting") {
          console.log("Definindo status como conectando");
          setConnectionStatus("connecting");
        } else if (state === "close") {
          console.log("Definindo status como close");
          setConnectionStatus("close");
        } else {
          console.log("Definindo status como desconectado, estado:", state);
          setConnectionStatus("disconnected");
          setInstanceData(null);
        }
      } else {
        console.log("Estado não encontrado na resposta, definindo como desconectado");
        setConnectionStatus("disconnected");
        setInstanceData(null);
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setConnectionStatus("error");
      setInstanceData(null);
    }
  }, [instanceName]);

  // Verificar status inicial ao carregar a página
  useEffect(() => {
    console.log("Efeito de inicialização - Verificando status inicial");
    checkInstanceStatus();
  }, [checkInstanceStatus]);

  // Atualizar instanceName quando a sessão mudar
  useEffect(() => {
    if (session?.user?.email) {
      setInstanceName(session.user.email);
    }
  }, [session]);

  // Verificar o status da instância periodicamente
  useEffect(() => {
    console.log("Efeito de intervalo - Configurando verificação periódica");
    const interval = setInterval(() => {
      console.log("Verificação periódica - Chamando checkInstanceStatus");
      checkInstanceStatus();
    }, 2000); // Verificar a cada 2 segundos

    return () => {
      console.log("Limpando intervalo de verificação");
      clearInterval(interval);
    };
  }, [checkInstanceStatus]);

  // Efeito para simular o carregamento inicial
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  // Função para criar uma instância do WhatsApp
  const handleConnect = async () => {
    if (connectionStatus === "disconnected" || connectionStatus === "error" || connectionStatus === "close") {
      if (!instanceName.trim()) {
        toast({
          title: "Nome da instância obrigatório",
          description: "Por favor, informe um nome para a instância do WhatsApp",
          variant: "destructive"
        });
        return;
      }

      try {
        setIsCreatingInstance(true)
        setConnectionStatus("connecting")
        
        // Se o status for "close", usamos a API de conexão em vez de criar uma nova instância
        if (connectionStatus === "close") {
          setQrDialogOpen(true)
          setQrCodeBase64(undefined)
          
          const response = await fetch("/api/whatsapp/instance/connect", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              instanceName: instanceName.trim()
            }),
          })
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro ao conectar instância:", errorData);
            throw new Error(errorData.error || "Falha ao conectar instância")
          }
          
          const data = await response.json()
          console.log("Dados da conexão:", data);
          
          // Verificar se o QR code está presente em qualquer um dos formatos possíveis
          const qrCodeBase64 = data.qrcode?.base64 || data.base64
          
          if (qrCodeBase64) {
            setQrCodeBase64(qrCodeBase64)
            if (instanceData) {
              setInstanceData({
                ...instanceData,
                status: "connecting"
              })
            } else {
              setInstanceData({
                instanceName: instanceName.trim(),
                instanceId: instanceName.trim(),
                status: "connecting"
              })
            }
          } else {
            console.error("QR Code não encontrado na resposta:", data)
            throw new Error("QR Code não recebido ou em formato inválido")
          }
        } else {
          // Caso contrário, criamos uma nova instância
          setQrDialogOpen(true)
          setQrCodeBase64(undefined)
          
          const response = await fetch("/api/whatsapp/instance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              instanceName: instanceName.trim()
            }),
          })
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro ao criar instância:", errorData);
            throw new Error(errorData.error || "Falha ao criar instância")
          }
          
          const data = await response.json()
          console.log("Dados da instância:", data);
          
          if (data.qrcode?.base64) {
            setQrCodeBase64(data.qrcode.base64)
            setInstanceData({
              instanceName: data.instance.instanceName,
              instanceId: data.instance.instanceId,
              status: data.instance.status
            })
          } else {
            console.error("QR Code não encontrado na resposta:", data)
            throw new Error("QR Code não recebido ou em formato inválido")
          }
        }
      } catch (error) {
        console.error("Erro ao conectar WhatsApp:", error)
        toast({
          title: "Erro ao conectar",
          description: error instanceof Error ? error.message : "Não foi possível criar a instância do WhatsApp",
          variant: "destructive"
        })
        setConnectionStatus("error")
        setQrDialogOpen(false)
      } finally {
        setIsCreatingInstance(false)
      }
    }
  }

  // Função para desconectar a instância
  const handleDisconnect = async () => {
    if (connectionStatus === "connected" || connectionStatus === "connecting") {
      if (!instanceName) {
        toast({
          title: "Nome da instância obrigatório",
          description: "Nome da instância não encontrado",
          variant: "destructive"
        });
        return;
      }

      try {
        setIsDisconnecting(true);
        
        const response = await fetch("/api/whatsapp/instance/disconnect", {
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
          console.error("Erro ao desconectar instância:", errorData);
          throw new Error(errorData.error || "Falha ao desconectar instância");
        }
        
        const data = await response.json();
        console.log("Instância desconectada:", data);
        
        setConnectionStatus("disconnected");
        setInstanceData(null);
        setQrCodeBase64(undefined);
        
        toast({
          title: "Desconectado",
          description: "Sua instância do WhatsApp foi desconectada com sucesso",
        });
      } catch (error) {
        console.error("Erro ao desconectar WhatsApp:", error);
        toast({
          title: "Erro ao desconectar",
          description: error instanceof Error ? error.message : "Não foi possível desconectar a instância do WhatsApp",
          variant: "destructive"
        });
      } finally {
        setIsDisconnecting(false);
      }
    }
  }

  // Função para simular a atualização do QR Code
  const handleRefreshQrCode = async () => {
    setQrCodeExpired(false)
    
    try {
      // Aqui você pode implementar a lógica para atualizar o QR code
      // Por enquanto, vamos apenas simular
      setQrCodeBase64(undefined)
      
      // Simulando o tempo de atualização
      setTimeout(() => {
        if (connectionStatus !== "connected") {
          handleConnect()
        }
      }, 1500)
    } catch (error) {
      console.error("Erro ao atualizar QR Code:", error)
      toast({
        title: "Erro ao atualizar QR Code",
        description: "Não foi possível atualizar o QR Code",
        variant: "destructive"
      })
    }
  }

  // Função para simular a conexão bem-sucedida após escanear o QR code
  const handleQrCodeScanned = () => {
    // Simulando o tempo de conexão
    setTimeout(() => {
      setConnectionStatus("connected")
      setQrDialogOpen(false)
    }, 2000)
  }

  // Função para gerar um novo QR code
  const handleGenerateNewQrCode = async () => {
    try {
      setQrDialogOpen(true)
      setQrCodeBase64(undefined)
      
      const response = await fetch("/api/whatsapp/instance/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceName: instanceName.trim()
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao gerar novo QR code:", errorData);
        throw new Error(errorData.error || "Falha ao gerar novo QR code")
      }
      
      const data = await response.json()
      console.log("Dados do novo QR code:", data);
      
      // Verificar se o QR code está presente em qualquer um dos formatos possíveis
      const qrCodeBase64 = data.qrcode?.base64 || data.base64
      
      if (qrCodeBase64) {
        setQrCodeBase64(qrCodeBase64)
      } else {
        console.error("QR Code não encontrado na resposta:", data)
        throw new Error("QR Code não recebido ou em formato inválido")
      }
    } catch (error) {
      console.error("Erro ao gerar novo QR code:", error)
      toast({
        title: "Erro ao gerar QR code",
        description: error instanceof Error ? error.message : "Não foi possível gerar um novo QR code",
        variant: "destructive"
      })
    }
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-[200px] w-full" />
            </div>
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie sua conexão e configurações do WhatsApp
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instanceName">Nome da Instância</Label>
              <Input 
                id="instanceName" 
                value={instanceName} 
                onChange={(e) => setInstanceName(e.target.value)}
                placeholder="Email do usuário será usado como nome da instância"
                disabled={true}
              />
              <p className="text-xs text-muted-foreground">
                O email da sua conta será usado como identificador da instância do WhatsApp
              </p>
            </div>
            
            <ConnectionCard
              connectionStatus={connectionStatus}
              autoReconnect={autoReconnect}
              onAutoReconnectChange={setAutoReconnect}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onGenerateNewQrCode={handleGenerateNewQrCode}
              isDisconnecting={isDisconnecting}
            />
          </div>

          <StatusCard
            connectionStatus={connectionStatus}
            onRefreshStatus={checkInstanceStatus}
          />
        </div>

        {connectionStatus === "connected" && (
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle>Tudo pronto!</AlertTitle>
            <AlertDescription>
              Seu WhatsApp está conectado e configurado corretamente. Você já pode receber mensagens dos seus pacientes diretamente nos funis de vendas.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <QrCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        qrCodeExpired={qrCodeExpired}
        onRefreshQrCode={handleRefreshQrCode}
        onSimulateConnection={handleQrCodeScanned}
        qrCodeBase64={qrCodeBase64}
      />
    </div>
  )
}
