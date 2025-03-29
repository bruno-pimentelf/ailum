"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface NavProjectsProps {
  projects: {
    name: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
    isActive?: boolean
  }[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-center">Acesso Rápido</SidebarGroupLabel>
      <SidebarMenu className="flex flex-col gap-2">
        {projects.map((project, i) => {
          const Icon = project.icon
          const isActive = project.isActive

          return (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton
                asChild
                tooltip={project.name}
                className={cn(
                  "hover:bg-muted/80 hover:text-blue-600 transition-colors duration-200 flex-col py-2 h-auto",
                  isActive && "text-blue-600 font-medium border-t-2 border-blue-600 bg-gradient-to-b from-blue-50/80 to-transparent hover:text-blue-600"
                )}
              >
                <a href={project.url} className="flex flex-col items-center">
                  {Icon && <Icon className={cn("h-5 w-5 mb-1", isActive && "text-blue-600")} />}
                  <span className="text-xs">{project.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover className="top-1 right-1">
                    <MoreHorizontal />
                    <span className="sr-only">Mais</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Folder className="text-muted-foreground" />
                    <span>Ver Detalhes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward className="text-muted-foreground" />
                    <span>Compartilhar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Remover</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70 flex-col py-2 h-auto">
            <MoreHorizontal className="text-sidebar-foreground/70 h-5 w-5 mb-1" />
            <span className="text-xs">Mais opções</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
