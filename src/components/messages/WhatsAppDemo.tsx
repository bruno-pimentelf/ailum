import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { WhatsAppInterface } from "./WhatsAppInterface"
import { WhatsAppChat } from "./WhatsAppChat"

interface WhatsAppDemoProps {
  instanceName: string
}

export function WhatsAppDemo({ instanceName }: WhatsAppDemoProps) {
  const [contactNumber, setContactNumber] = useState("")
  const [contactName, setContactName] = useState("")
  const [showDirectChat, setShowDirectChat] = useState(false)
  
  const handleStartChat = () => {
    if (!contactNumber) return
    
    // Formatar o número
    let formattedNumber = contactNumber.replace(/\D/g, "")
    
    // Adicionar @s.whatsapp.net se não estiver presente
    if (!formattedNumber.includes("@s.whatsapp.net")) {
      formattedNumber = `${formattedNumber}@s.whatsapp.net`
    }
    
    setContactNumber(formattedNumber)
    setShowDirectChat(true)
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Messenger</CardTitle>
          <CardDescription>
            Visualize e envie mensagens através da sua instância do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="interface">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="interface">Interface Completa</TabsTrigger>
              <TabsTrigger value="direct">Chat Direto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interface" className="pt-4">
              <WhatsAppInterface instanceName={instanceName} />
            </TabsContent>
            
            <TabsContent value="direct" className="pt-4">
              {showDirectChat ? (
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDirectChat(false)}
                  >
                    Voltar
                  </Button>
                  
                  <WhatsAppChat
                    instanceName={instanceName}
                    contactNumber={contactNumber}
                    contactName={contactName || undefined}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Número do Contato</Label>
                    <Input
                      id="contactNumber"
                      placeholder="Ex: 5511999999999"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite o número com código do país e DDD, sem espaços ou caracteres especiais
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Nome do Contato (opcional)</Label>
                    <Input
                      id="contactName"
                      placeholder="Ex: João Silva"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleStartChat}
                    disabled={!contactNumber}
                    className="w-full"
                  >
                    Iniciar Conversa
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 