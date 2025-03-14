export interface Message {
  key?: {
    id: string;
    remoteJid?: string;
  };
  id?: string;
  messageType?: string;
  message?: any;
  timestamp?: string;
  type?: "sent" | "received";
  pushName?: string;
  messageTimestamp?: number;
  conversation?: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  rawData?: any;
  webhookEvent?: string;
  text?: string;
  body?: string;
  from?: string;
  [key: string]: any;
} 