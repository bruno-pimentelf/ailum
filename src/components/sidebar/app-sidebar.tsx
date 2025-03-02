"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  BookOpen,
  Cog,
  FolderKanban,
  Home,
  MessageSquare,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Dados de navegação principal
const navMainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Funis de Vendas",
    url: "/funis",
    icon: FolderKanban,
  },
  {
    title: "Mensagens",
    url: "/mensagens",
    icon: MessageSquare,
  },
  {
    title: "WhatsApp",
    url: "/whatsapp",
    icon: () => (
      <Image
        src="/assets/images/whatsapp.png"
        alt="WhatsApp"
        width={16}
        height={16}
        className="h-4 w-4"
      />
    ),
  },
  {
    title: "E-Learning",
    url: "/cursos",
    icon: BookOpen,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Cog,
    items: [
      {
        title: "Perfil",
        url: "/configuracoes/perfil",
      },
      {
        title: "Clínica",
        url: "/configuracoes/clinica",
      },
      {
        title: "Integrações",
        url: "/configuracoes/integracoes",
      },
      {
        title: "Assinatura",
        url: "/configuracoes/assinatura",
      },
    ],
  },
];

// Dados de projetos
const projectsItems = [
  {
    name: "Funis Personalizados",
    url: "/funis/personalizados",
    icon: FolderKanban,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Função para verificar se um item está ativo com base na URL atual
  const isItemActive = (url: string) => {
    // Tratamento especial para a rota raiz
    if (url === "/" && pathname === "/") {
      return true
    }
    // Para outras rotas, verifica se o pathname começa com a URL do item
    return url !== "/" && pathname.startsWith(url)
  }

  // Adiciona a propriedade isActive aos itens de navegação
  const navMainWithActive = navMainItems.map(item => ({
    ...item,
    isActive: isItemActive(item.url),
    items: item.items?.map(subItem => ({
      ...subItem,
      isActive: isItemActive(subItem.url)
    }))
  }))

  // Adiciona a propriedade isActive aos projetos
  const projectsWithActive = projectsItems.map(project => ({
    ...project,
    isActive: isItemActive(project.url)
  }))

  // Dados do usuário logado
  const userData = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email || "usuario@exemplo.com",
    avatar: session?.user?.image || "/avatars/avatar.jpg",
    handleLogout: () => signOut({ callbackUrl: "/login" })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center p-2">
        <Image
          src="/assets/images/ailum-logos/5.png"
          alt="Ailum"
          width={200}
          height={100}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
        <NavProjects projects={projectsWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
