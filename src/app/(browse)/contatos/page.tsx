"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Plus, Search, Filter, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Tipos temporários (deveriam vir do back-end)
type ContactStatus = "needs_response" | "in_conversation" | "waiting_client" | "resolved"

type PriorityLevel = "low" | "medium" | "high"

type Contact = {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  stageId: string
  status: ContactStatus
  lastActivity: string
  unreadCount?: number
  addedAt?: string
  serviceInterest?: string
  funnelId?: string
  priority?: PriorityLevel
  estimatedValue?: number
  lastContactDate?: string
  closingDate?: string
  channel?: string
  value?: number
  notes?: string
}

type FunnelStage = {
  id: string
  name: string
  color: string
  order: number
}

type Funnel = {
  id: string
  name: string
  stages: FunnelStage[]
}

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Função para obter informações do status
const getStatusInfo = (status: ContactStatus) => {
  switch (status) {
    case "needs_response":
      return { color: "bg-red-500", text: "Necessita de resposta", textColor: "text-red-500", badgeVariant: "destructive" }
    case "in_conversation":
      return { color: "bg-amber-500", text: "Em conversa", textColor: "text-amber-500", badgeVariant: "default" }
    case "waiting_client":
      return { color: "bg-blue-500", text: "Aguardando cliente", textColor: "text-blue-500", badgeVariant: "secondary" }
    case "resolved":
      return { color: "bg-green-500", text: "Resolvido", textColor: "text-green-500", badgeVariant: "outline" }
  }
}

// Componente principal
export default function ContactsPage() {
  const { data: session } = useSession()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [funnelFilter, setFunnelFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    phone: "",
    email: "",
    funnelId: "",
    stageId: "",
    status: "needs_response" as ContactStatus,
    priority: "medium" as PriorityLevel,
    serviceInterest: "",
    channel: "",
  })

  // Canais disponíveis
  const salesChannels = [
    "Indicação",
    "Redes Sociais",
    "Google",
    "Comercial de TV",
    "Outdoor",
    "Outro"
  ]

  // Serviços disponíveis
  const services = [
    "Consulta Dermatológica",
    "Botox",
    "Preenchimento Facial",
    "Limpeza de Pele",
    "Tratamento para Acne",
    "Cirurgia Plástica",
    "Peeling Químico",
    "Microagulhamento",
    "Outro"
  ]

  // Carregar dados
  useEffect(() => {
    // Simulação de dados - Em produção, isso seria uma chamada API
    const fetchData = async () => {
      // Carregar funis
      const demoFunnels: Funnel[] = [
        {
          id: "consulta-inicial",
          name: "Consulta Inicial",
          stages: [
            { id: "novo-contato", name: "Novo Contato", color: "bg-blue-500", order: 1 },
            { id: "interesse", name: "Demonstrou Interesse", color: "bg-purple-500", order: 2 },
            { id: "agendamento", name: "Agendamento", color: "bg-yellow-500", order: 3 },
            { id: "confirmacao", name: "Confirmação", color: "bg-green-500", order: 4 },
            { id: "concluido", name: "Consulta Realizada", color: "bg-emerald-500", order: 5 },
          ],
        },
        {
          id: "procedimento-estetico",
          name: "Procedimento Estético",
          stages: [
            { id: "contato-inicial", name: "Contato Inicial", color: "bg-blue-500", order: 1 },
            { id: "avaliacao", name: "Avaliação", color: "bg-indigo-500", order: 2 },
            { id: "orcamento", name: "Orçamento", color: "bg-purple-500", order: 3 },
            { id: "agendamento", name: "Agendamento", color: "bg-yellow-500", order: 4 },
            { id: "realizado", name: "Procedimento Realizado", color: "bg-green-500", order: 5 },
          ],
        },
      ]
      setFunnels(demoFunnels)

      // Carregar contatos
      const demoContacts: Contact[] = [
        {
          id: "contact1",
          name: "Maria Silva",
          phone: "+5527995072522",
          email: "maria.silva@email.com",
          avatar: "/avatars/maria.jpg",
          stageId: "novo-contato",
          status: "needs_response",
          lastActivity: "Hoje, 10:30",
          unreadCount: 2,
          value: 1500,
          funnelId: "consulta-inicial",
          addedAt: "15/02/2023",
          serviceInterest: "Consulta Dermatológica",
          priority: "high",
          estimatedValue: 250,
          channel: "Redes Sociais"
        },
        {
          id: "contact2",
          name: "João Pereira",
          phone: "+5511912345678",
          email: "joao.pereira@email.com",
          stageId: "interesse",
          status: "in_conversation",
          lastActivity: "Hoje, 09:15",
          value: 2800,
          funnelId: "consulta-inicial",
          addedAt: "14/02/2023",
          serviceInterest: "Botox",
          priority: "medium",
          estimatedValue: 800,
          channel: "Indicação"
        },
        {
          id: "contact3",
          name: "Ana Oliveira",
          phone: "+5511998765432",
          email: "ana.oliveira@email.com",
          stageId: "agendamento",
          status: "waiting_client",
          lastActivity: "Ontem, 18:45",
          value: 3500,
          funnelId: "consulta-inicial",
          addedAt: "12/02/2023",
          serviceInterest: "Preenchimento Facial",
          priority: "low",
          estimatedValue: 1200,
          channel: "Google"
        },
        {
          id: "contact4",
          name: "Carlos Santos",
          phone: "+5511987651234",
          email: "carlos.santos@email.com",
          stageId: "contato-inicial",
          status: "needs_response",
          lastActivity: "Ontem, 15:20",
          unreadCount: 1,
          value: 1200,
          funnelId: "procedimento-estetico",
          addedAt: "10/02/2023",
          serviceInterest: "Cirurgia Plástica",
          priority: "high",
          estimatedValue: 5000,
          channel: "Redes Sociais"
        },
      ]
      setContacts(demoContacts)
      setFilteredContacts(demoContacts)
    }

    fetchData()
  }, [])

  // Efeito para filtrar contatos
  useEffect(() => {
    let results = contacts

    // Filtro de pesquisa
    if (searchTerm) {
      results = results.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phone.includes(searchTerm) ||
          (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro de funil
    if (funnelFilter !== "all") {
      results = results.filter((contact) => contact.funnelId === funnelFilter)
    }

    // Filtro de estágio
    if (stageFilter !== "all") {
      results = results.filter((contact) => contact.stageId === stageFilter)
    }

    // Filtro de status
    if (statusFilter !== "all") {
      results = results.filter((contact) => contact.status === statusFilter)
    }

    setFilteredContacts(results)
  }, [contacts, searchTerm, funnelFilter, stageFilter, statusFilter])

  // Função para criar um novo contato
  const handleCreateContact = () => {
    // Validação básica
    if (!newContact.name || !newContact.phone || !newContact.funnelId || !newContact.stageId) {
      toast({
        title: "Erro ao criar contato",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    // Criar um novo ID
    const newId = `contact${Date.now()}`

    // Criar o novo contato
    const contactToAdd: Contact = {
      id: newId,
      name: newContact.name!,
      phone: newContact.phone!,
      email: newContact.email,
      stageId: newContact.stageId!,
      status: newContact.status as ContactStatus,
      lastActivity: "Agora",
      funnelId: newContact.funnelId,
      addedAt: new Date().toLocaleDateString('pt-BR'),
      serviceInterest: newContact.serviceInterest,
      priority: newContact.priority as PriorityLevel,
      channel: newContact.channel,
      estimatedValue: newContact.estimatedValue || 0,
      unreadCount: 0
    }

    // Adicionar à lista
    setContacts([contactToAdd, ...contacts])
    
    // Fechar o diálogo
    setIsCreateDialogOpen(false)
    
    // Limpar formulário
    setNewContact({
      name: "",
      phone: "",
      email: "",
      funnelId: "",
      stageId: "",
      status: "needs_response" as ContactStatus,
      priority: "medium" as PriorityLevel,
      serviceInterest: "",
      channel: "",
    })

    toast({
      title: "Contato criado com sucesso",
      description: `${contactToAdd.name} foi adicionado à sua lista de contatos.`
    })
  }

  // Função para obter os estágios do funil selecionado
  const getStagesForSelectedFunnel = () => {
    if (!newContact.funnelId) return []
    const selectedFunnel = funnels.find(f => f.id === newContact.funnelId)
    return selectedFunnel ? selectedFunnel.stages : []
  }

  // Função para iniciar conversa (simulação)
  const handleStartChat = (contactId: string) => {
    // Aqui seria uma navegação para a página de chat ou abrir um diálogo
    toast({
      title: "Conversa iniciada",
      description: "Função de chat em desenvolvimento."
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contatos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Contato</DialogTitle>
              <DialogDescription>
                Preencha os dados do contato para adicioná-lo ao sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome*</Label>
                <Input 
                  id="name" 
                  value={newContact.name} 
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone*</Label>
                <Input 
                  id="phone" 
                  value={newContact.phone} 
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="+55 (00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={newContact.email} 
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="email@exemplo.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funnel">Funil*</Label>
                <Select 
                  value={newContact.funnelId} 
                  onValueChange={(value) => {
                    setNewContact({
                      ...newContact, 
                      funnelId: value,
                      // Limpar o estágio quando mudar o funil
                      stageId: ""
                    })
                  }}
                >
                  <SelectTrigger id="funnel">
                    <SelectValue placeholder="Selecione um funil" />
                  </SelectTrigger>
                  <SelectContent>
                    {funnels.map((funnel) => (
                      <SelectItem key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Estágio*</Label>
                <Select
                  disabled={!newContact.funnelId}
                  value={newContact.stageId}
                  onValueChange={(value) => setNewContact({...newContact, stageId: value})}
                >
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Selecione um estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStagesForSelectedFunnel().map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                          <span>{stage.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newContact.status} 
                  onValueChange={(value: ContactStatus) => setNewContact({...newContact, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="needs_response">Necessita de resposta</SelectItem>
                    <SelectItem value="in_conversation">Em conversa</SelectItem>
                    <SelectItem value="waiting_client">Aguardando cliente</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select 
                  value={newContact.priority} 
                  onValueChange={(value: PriorityLevel) => setNewContact({...newContact, priority: value})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Serviço de Interesse</Label>
                <Select 
                  value={newContact.serviceInterest} 
                  onValueChange={(value) => setNewContact({...newContact, serviceInterest: value})}
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel">Canal</Label>
                <Select 
                  value={newContact.channel} 
                  onValueChange={(value) => setNewContact({...newContact, channel: value})}
                >
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Selecione um canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesChannels.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Valor Estimado (R$)</Label>
                <Input 
                  id="estimatedValue" 
                  type="number"
                  value={newContact.estimatedValue || ""} 
                  onChange={(e) => setNewContact({...newContact, estimatedValue: parseFloat(e.target.value)})}
                  placeholder="0,00"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea 
                  id="notes"
                  value={newContact.notes || ""} 
                  onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                  placeholder="Adicione notas ou observações sobre o contato"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateContact}>Criar Contato</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar Contatos</CardTitle>
          <CardDescription>Use os filtros abaixo para encontrar contatos específicos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input 
                placeholder="Buscar por nome, email ou telefone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={funnelFilter} onValueChange={setFunnelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por funil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os funis</SelectItem>
                  {funnels.map((funnel) => (
                    <SelectItem key={funnel.id} value={funnel.id}>
                      {funnel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={stageFilter} 
                onValueChange={setStageFilter}
                disabled={funnelFilter === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estágio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estágios</SelectItem>
                  {funnelFilter !== "all" && 
                    funnels
                      .find(f => f.id === funnelFilter)?.stages
                      .map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                            <span>{stage.name}</span>
                          </div>
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="needs_response">Necessita de resposta</SelectItem>
                  <SelectItem value="in_conversation">Em conversa</SelectItem>
                  <SelectItem value="waiting_client">Aguardando cliente</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
          <CardDescription>
            {filteredContacts.length} {filteredContacts.length === 1 ? 'contato encontrado' : 'contatos encontrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contato</TableHead>
                <TableHead>Funil</TableHead>
                <TableHead>Estágio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor Est.</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum contato encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => {
                  const funnel = funnels.find(f => f.id === contact.funnelId)
                  const stage = funnel?.stages.find(s => s.id === contact.stageId)
                  const statusInfo = getStatusInfo(contact.status)
                  
                  return (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {contact.avatar ? (
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                            ) : (
                              <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-muted-foreground">{contact.phone}</div>
                          </div>
                          {contact.unreadCount && contact.unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {contact.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{funnel?.name || "-"}</TableCell>
                      <TableCell>
                        {stage && (
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${stage.color}`}></div>
                            <span>{stage.name}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.badgeVariant as any}>
                          {statusInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell>{contact.serviceInterest || "-"}</TableCell>
                      <TableCell>{contact.estimatedValue ? formatCurrency(contact.estimatedValue) : "-"}</TableCell>
                      <TableCell>{contact.lastActivity || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleStartChat(contact.id)}>
                          Conversar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 