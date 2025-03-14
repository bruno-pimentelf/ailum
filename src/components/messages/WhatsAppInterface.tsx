import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Search, Users, MessageSquare, Phone, Settings, RefreshCw, Plus, X } from "lucide-react"
import { WhatsAppContact } from "./WhatsAppContact"
import { WhatsAppChat } from "./WhatsAppChat"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Contact {
  id: string
  name: string
  phoneNumber: string
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
}

interface WhatsAppInterfaceProps {
  instanceName: string
  initialContacts?: Contact[]
}

export function WhatsAppInterface({
  instanceName,
  initialContacts = []
}: WhatsAppInterfaceProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newContactName, setNewContactName] = useState("")
  const [newContactPhone, setNewContactPhone] = useState("")
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Buscar contatos
  const fetchContacts = async () => {
    try {
      setIsLoading(true)
      
      // Simulação de busca de contatos
      // Em um ambiente real, você faria uma chamada API aqui
      setTimeout(() => {
        const mockContacts: Contact[] = [
          {
            id: "1",
            name: "João Silva",
            phoneNumber: "5511987654321@s.whatsapp.net",
            lastMessage: "Olá, tudo bem?",
            timestamp: new Date().toISOString(),
            unreadCount: 2
          },
          {
            id: "2",
            name: "Maria Oliveira",
            phoneNumber: "5511912345678@s.whatsapp.net",
            lastMessage: "Vamos marcar aquela reunião?",
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: "3",
            name: "Carlos Pereira",
            phoneNumber: "5511955443322@s.whatsapp.net",
            lastMessage: "Obrigado pelas informações!",
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ]
        
        setContacts(mockContacts)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Erro ao buscar contatos:", error)
      toast({
        title: "Erro ao buscar contatos",
        description: error instanceof Error ? error.message : "Não foi possível buscar os contatos",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }
  
  // Adicionar novo contato
  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e número de telefone são obrigatórios",
        variant: "destructive"
      })
      return
    }
    
    setIsAddingContact(true)
    
    // Formatar o número para o padrão do WhatsApp
    let formattedPhone = newContactPhone.replace(/\D/g, "")
    if (!formattedPhone.includes("@s.whatsapp.net")) {
      formattedPhone = `${formattedPhone}@s.whatsapp.net`
    }
    
    // Simulação de adição de contato
    // Em um ambiente real, você faria uma chamada API aqui
    setTimeout(() => {
      const newContact: Contact = {
        id: `new-${Date.now()}`,
        name: newContactName,
        phoneNumber: formattedPhone,
        timestamp: new Date().toISOString()
      }
      
      setContacts(prev => [newContact, ...prev])
      setNewContactName("")
      setNewContactPhone("")
      setIsAddingContact(false)
      setIsDialogOpen(false)
      
      toast({
        title: "Contato adicionado",
        description: `${newContactName} foi adicionado à sua lista de contatos`,
      })
    }, 1000)
  }
  
  // Filtrar contatos com base na busca
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.replace('@s.whatsapp.net', '').includes(searchQuery)
  )
  
  // Selecionar um contato para chat
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
  }
  
  // Voltar para a lista de contatos
  const handleBackToContacts = () => {
    setSelectedContact(null)
  }
  
  // Efeito para buscar contatos ao montar o componente
  useEffect(() => {
    fetchContacts()
  }, [])
  
  // Renderizar o chat ou a lista de contatos
  if (selectedContact) {
    return (
      <WhatsAppChat
        instanceName={instanceName}
        contactNumber={selectedContact.phoneNumber}
        contactName={selectedContact.name}
        onBack={handleBackToContacts}
      />
    )
  }
  
  return (
    <Card className="flex flex-col h-[700px] max-w-md mx-auto border border-gray-200 shadow-lg bg-white rounded-xl overflow-hidden">
      {/* Cabeçalho */}
      <CardHeader className="p-3 border-b border-gray-200 flex flex-row items-center space-y-0 gap-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-t-xl">
        <div className="flex-1">
          <h2 className="font-medium text-white drop-shadow-sm">WhatsApp</h2>
          <p className="text-xs text-emerald-50">Conectado como {instanceName}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 transition-all duration-200"
          onClick={fetchContacts}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      {/* Conteúdo */}
      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <div className="px-3 pt-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar contatos ou conversas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
          </div>
          
          <TabsList className="w-full bg-gray-100 border border-gray-200">
            <TabsTrigger 
              value="chats" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-400 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-0"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversas
            </TabsTrigger>
            <TabsTrigger 
              value="contacts" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-400 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-0"
            >
              <Users className="h-4 w-4 mr-2" />
              Contatos
            </TabsTrigger>
            <TabsTrigger 
              value="calls" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-400 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-0"
            >
              <Phone className="h-4 w-4 mr-2" />
              Chamadas
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="flex-1 overflow-y-auto p-3 space-y-2 mt-2 relative">
          {/* Botão flutuante para adicionar contato */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="absolute bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-lg shadow-emerald-200/50 z-10"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>Adicionar novo contato</DialogTitle>
                <DialogDescription>
                  Preencha os dados do contato para adicioná-lo à sua lista.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="col-span-3"
                    placeholder="Nome do contato"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="col-span-3"
                    placeholder="Ex: 5511987654321"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isAddingContact}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddContact}
                  disabled={isAddingContact}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500"
                >
                  {isAddingContact ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    "Adicionar contato"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <TabsContent value="chats" className="m-0 space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 bg-gray-100 rounded-xl" />
                <Skeleton className="h-16 bg-gray-100 rounded-xl" />
                <Skeleton className="h-16 bg-gray-100 rounded-xl" />
              </div>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <WhatsAppContact
                  key={contact.id}
                  name={contact.name}
                  phoneNumber={contact.phoneNumber}
                  lastMessage={contact.lastMessage}
                  timestamp={contact.timestamp}
                  unreadCount={contact.unreadCount}
                  onClick={() => handleSelectContact(contact)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p>Nenhuma conversa encontrada.</p>
                {searchQuery && (
                  <p className="text-sm mt-1">Tente uma busca diferente.</p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contacts" className="m-0 space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 bg-gray-100 rounded-xl" />
                <Skeleton className="h-16 bg-gray-100 rounded-xl" />
                <Skeleton className="h-16 bg-gray-100 rounded-xl" />
              </div>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <WhatsAppContact
                  key={contact.id}
                  name={contact.name}
                  phoneNumber={contact.phoneNumber}
                  onClick={() => handleSelectContact(contact)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p>Nenhum contato encontrado.</p>
                {searchQuery && (
                  <p className="text-sm mt-1">Tente uma busca diferente.</p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calls" className="m-0">
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p>Histórico de chamadas em breve.</p>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
} 