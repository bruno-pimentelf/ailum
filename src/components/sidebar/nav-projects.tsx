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
      <SidebarGroupLabel>Acesso Rápido</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project, i) => {
          const Icon = project.icon
          const isActive = project.isActive

          return (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton
                asChild
                tooltip={project.name}
                className={cn(
                  "hover:bg-muted/80 hover:text-blue-600 transition-colors duration-200",
                  isActive && "text-blue-600 font-medium border-l-2 border-blue-600 bg-gradient-to-r from-blue-50/80 to-transparent hover:text-blue-600"
                )}
              >
                <a href={project.url}>
                  {Icon && <Icon className={cn("h-4 w-4", isActive && "text-blue-600")} />}
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
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
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>Mais opções</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
