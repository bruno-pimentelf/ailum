"use client"

import { useState, useEffect } from "react"
import { FunnelCreator } from "@/components/funis/funnel-creator"
import { Funnel } from "@/types/funis"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GerenciarFunisPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar funis do localStorage ou usar dados de exemplo
  useEffect(() => {
    const loadFunnels = () => {
      try {
        const savedFunnels = localStorage.getItem("funnels")
        if (savedFunnels) {
          setFunnels(JSON.parse(savedFunnels))
        } else {
          // Dados de exemplo
          const exampleFunnels: Funnel[] = [
            {
              id: "consulta-inicial",
              name: "Consulta Inicial",
              stages: [
                { id: "novo-contato", name: "Novo Contato", color: "bg-blue-500" },
                { id: "interesse", name: "Demonstrou Interesse", color: "bg-purple-500" },
                { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
                { id: "confirmacao", name: "Confirmação", color: "bg-green-500" },
                { id: "concluido", name: "Consulta Realizada", color: "bg-emerald-500" },
              ],
            },
            {
              id: "procedimento-estetico",
              name: "Procedimento Estético",
              stages: [
                { id: "contato-inicial", name: "Contato Inicial", color: "bg-blue-500" },
                { id: "avaliacao", name: "Avaliação", color: "bg-indigo-500" },
                { id: "orcamento", name: "Orçamento", color: "bg-purple-500" },
                { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
                { id: "realizado", name: "Procedimento Realizado", color: "bg-green-500" },
              ],
            },
            {
              id: "cirurgia",
              name: "Cirurgia Plástica",
              stages: [
                { id: "contato-inicial", name: "Contato Inicial", color: "bg-blue-500" },
                { id: "consulta", name: "Consulta", color: "bg-indigo-500" },
                { id: "exames", name: "Exames", color: "bg-violet-500" },
                { id: "orcamento", name: "Orçamento", color: "bg-purple-500" },
                { id: "agendamento", name: "Agendamento", color: "bg-yellow-500" },
                { id: "pre-op", name: "Pré-Operatório", color: "bg-orange-500" },
                { id: "realizada", name: "Cirurgia Realizada", color: "bg-green-500" },
                { id: "pos-op", name: "Pós-Operatório", color: "bg-emerald-500" },
              ],
            },
          ]
          setFunnels(exampleFunnels)
          localStorage.setItem("funnels", JSON.stringify(exampleFunnels))
        }
      } catch (error) {
        console.error("Erro ao carregar funis:", error)
        toast({
          title: "Erro ao carregar funis",
          description: "Ocorreu um erro ao carregar os funis salvos.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFunnels()
  }, [])

  // Salvar funis no localStorage
  const saveFunnels = (updatedFunnels: Funnel[]) => {
    try {
      localStorage.setItem("funnels", JSON.stringify(updatedFunnels))
    } catch (error) {
      console.error("Erro ao salvar funis:", error)
      toast({
        title: "Erro ao salvar funis",
        description: "Ocorreu um erro ao salvar os funis.",
        variant: "destructive"
      })
    }
  }

  // Criar novo funil
  const handleCreateFunnel = (newFunnel: Funnel) => {
    const updatedFunnels = [...funnels, newFunnel]
    setFunnels(updatedFunnels)
    saveFunnels(updatedFunnels)
  }

  // Atualizar funil existente
  const handleUpdateFunnel = (updatedFunnel: Funnel) => {
    const updatedFunnels = funnels.map(funnel => 
      funnel.id === updatedFunnel.id ? updatedFunnel : funnel
    )
    setFunnels(updatedFunnels)
    saveFunnels(updatedFunnels)
  }

  // Excluir funil
  const handleDeleteFunnel = (funnelId: string) => {
    const updatedFunnels = funnels.filter(funnel => funnel.id !== funnelId)
    setFunnels(updatedFunnels)
    saveFunnels(updatedFunnels)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando funis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/funis">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Gerenciar Funis</h1>
      </div>

      <div className="bg-white dark:bg-gray-800">
        <FunnelCreator
          funnels={funnels}
          onFunnelCreate={handleCreateFunnel}
          onFunnelUpdate={handleUpdateFunnel}
          onFunnelDelete={handleDeleteFunnel}
        />
      </div>
    </div>
  )
} 