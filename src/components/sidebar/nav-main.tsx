"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
    isActive?: boolean
  }[]
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-2">
        {items.map((item, i) => {
          const Icon = item.icon
          const isActive = item.isActive

          if (item.items?.length) {
            return (
              <Collapsible
                key={i}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "hover:bg-muted/80 hover:text-[rgb(0,180,190)] transition-colors duration-200 flex-col py-2 h-auto",
                        isActive && "text-[rgb(0,180,190)] font-medium border-t-2 border-[rgb(0,180,190)] bg-gradient-to-b from-[rgba(0,180,190,0.1)] to-transparent hover:text-[rgb(0,180,190)]"
                      )}
                    >
                      {Icon && <Icon className={cn("h-5 w-5 mb-1", isActive && "text-[rgb(0,180,190)]")} />}
                      <span className="text-xs">{item.title}</span>
                      <ChevronRight className={cn(
                        "transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 absolute right-2 top-1/2 -translate-y-1/2",
                        isActive && "text-[rgb(0,180,190)]"
                      )} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild
                            className={cn(
                              "hover:bg-muted/80 hover:text-[rgb(0,180,190)] transition-colors duration-200",
                              subItem.isActive && "text-[rgb(0,180,190)] font-medium border-l-2 border-[rgb(0,180,190)] bg-gradient-to-r from-[rgba(0,180,190,0.1)] to-transparent hover:text-[rgb(0,180,190)]"
                            )}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(
                  "hover:bg-muted/80 hover:text-[rgb(0,180,190)] transition-colors duration-200 flex-col py-2 h-auto",
                  isActive && "text-[rgb(0,180,190)] font-medium border-t-2 border-[rgb(0,180,190)] bg-gradient-to-b from-[rgba(0,180,190,0.1)] to-transparent hover:text-[rgb(0,180,190)]"
                )}
              >
                <Link href={item.url} className="flex flex-col items-center">
                  {Icon && <Icon className={cn("h-5 w-5 mb-1", isActive && "text-[rgb(0,180,190)]")} />}
                  <span className="text-xs">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
