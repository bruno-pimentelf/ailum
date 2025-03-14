import { Message } from "./types"

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const isReceived = message.type === "received"
  
  // Extrair o conteúdo da mensagem
  let textContent = ""
  
  if (message.webhookEvent === "send.message" && message.rawData?.data?.message?.conversation) {
    textContent = message.rawData.data.message.conversation
  } else {
    textContent = message.conversation || 
                 message.message?.conversation ||
                 message.message?.extendedTextMessage?.text ||
                 message.text ||
                 message.body ||
                 (typeof message.message === 'string' ? message.message : null) ||
                 JSON.stringify(message.message || message)
  }
  
  // Extrair o timestamp
  const timestamp = message.timestamp || 
    (message.messageTimestamp ? new Date(message.messageTimestamp * 1000).toISOString() : null) ||
    new Date().toISOString()
  
  const formattedTime = new Date(timestamp).toLocaleTimeString()
  const formattedDate = new Date(timestamp).toLocaleDateString()
  
  // Extrair o remetente
  const sender = isReceived 
    ? (message.pushName || 
       message.key?.remoteJid?.split('@')[0] || 
       message.from?.split('@')[0] ||
       "Desconhecido")
    : "Você"
  
  return (
    <div 
      className={`p-3 rounded-lg mb-2 max-w-[80%] ${
        isReceived 
          ? "bg-gray-100 self-start" 
          : "bg-blue-100 self-end"
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium">{sender}</span>
        <span className="text-xs text-gray-500 ml-2">{formattedTime}</span>
      </div>
      <p className="text-sm">{textContent}</p>
      <div className="text-xs text-gray-500 text-right mt-1">{formattedDate}</div>
      {message.webhookEvent && (
        <div className="text-xs text-gray-400 mt-1">
          Evento: {message.webhookEvent}
        </div>
      )}
    </div>
  )
} 