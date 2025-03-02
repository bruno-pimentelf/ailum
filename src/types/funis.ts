export type FunnelStage = {
  id: string
  name: string
  color: string
}

export type Funnel = {
  id: string
  name: string
  stages: FunnelStage[]
}

export type ContactStatus = "needs_response" | "in_conversation" | "waiting_client" | "resolved"

export type Contact = {
  id: string
  name: string
  phone: string
  avatar?: string
  stageId: string
  status: ContactStatus
  lastActivity: string
  unreadCount?: number
} 