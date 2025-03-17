"use client"

import { useState, useEffect } from "react"
import { Funnel } from "@/types/funis"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import Link from "next/link"

interface FunnelHeaderProps {
  selectedFunnel: Funnel | null
  funnels: Funnel[]
  onFunnelChange: (funnel: Funnel) => void
}

export function FunnelHeader({ selectedFunnel, funnels, onFunnelChange }: FunnelHeaderProps) {
  const [mounted, setMounted] = useState(false)

  // Evitar erro de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !selectedFunnel) {
    return (
      <div className="flex items-center justify-between mb-4  bg-white dark:bg-gray-800 ">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between w-full  bg-white dark:bg-gray-800 ">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold mr-4">Funil:</h1>
        <Select
          value={selectedFunnel.id}
          onValueChange={(value) => {
            const funnel = funnels.find(f => f.id === value)
            if (funnel) onFunnelChange(funnel)
          }}
        >
          <SelectTrigger className="w-[240px]">
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

      <div className="flex items-center gap-2">
        <Link href="/funis/gerenciar">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Funis
          </Button>
        </Link>
        <Link href="/funis/gerenciar">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Funil
          </Button>
        </Link>
      </div>
    </div>
  )
} 