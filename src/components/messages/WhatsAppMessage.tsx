import { Message } from "./types"
import Image from "next/image"
import { Check, CheckCheck } from "lucide-react"

interface WhatsAppMessageProps {
  message: Message
}

export function WhatsAppMessage({ message }: WhatsAppMessageProps) {
  const isReceived = message.type === "received"
  
  // Extrair o conteúdo da mensagem
  let content = null
  let messageType = message.messageType || "unknown"
  
  // Extrair o timestamp
  const timestamp = message.timestamp || 
    (message.messageTimestamp ? new Date(message.messageTimestamp * 1000).toISOString() : null) ||
    new Date().toISOString()
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  // Renderizar diferentes tipos de mensagens
  if (message.content !== undefined && message.mediaType) {
    // Usar os campos processados pela API
    switch (message.mediaType) {
      case "text":
        content = (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )
        break
        
      case "image":
        content = (
          <div className="space-y-2">
            {message.mediaUrl ? (
              <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-transparent z-10 pointer-events-none" />
                <Image 
                  src={message.mediaUrl} 
                  alt="Imagem" 
                  fill 
                  className="object-cover transition-transform hover:scale-105 duration-300"
                  unoptimized
                />
              </div>
            ) : (
              <div className="bg-gray-100 w-48 h-48 rounded-xl flex items-center justify-center border border-gray-200">
                <p className="text-xs text-gray-500">Imagem não disponível</p>
              </div>
            )}
            {message.content && message.content !== "[Imagem]" && (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        )
        break
        
      case "sticker":
        content = (
          <div className="w-32 h-32 relative">
            {message.mediaUrl ? (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-100/30 to-transparent z-10 pointer-events-none" />
                <Image 
                  src={message.mediaUrl} 
                  alt="Sticker" 
                  fill 
                  className="object-contain drop-shadow-sm"
                  unoptimized
                />
              </div>
            ) : (
              <div className="bg-gray-100 w-full h-full rounded-xl flex items-center justify-center border border-gray-200">
                <p className="text-xs text-gray-500">Sticker não disponível</p>
              </div>
            )}
          </div>
        )
        break
        
      case "audio":
        content = (
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div className="flex-1">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0:00</span>
                <span className="text-xs text-gray-500">0:30</span>
              </div>
            </div>
          </div>
        )
        break
        
      case "video":
        content = (
          <div className="space-y-2">
            <div className="relative bg-gray-100 w-48 h-48 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent z-10"></div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center z-20 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div className="absolute bottom-2 left-2 right-2 z-20">
                <div className="h-1 bg-gray-200/80 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
            {message.content && message.content !== "[Vídeo]" && (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        )
        break
        
      case "document":
        content = (
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-10 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm truncate">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">Documento</p>
            </div>
          </div>
        )
        break
        
      default:
        // Texto simples
        content = <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
    }
  } else {
    // Fallback para o comportamento anterior
    switch (messageType) {
      case "conversation":
        content = (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message?.conversation || ""}
          </p>
        )
        break
        
      case "imageMessage":
        const imageUrl = message.message?.imageMessage?.url
        content = (
          <div className="space-y-1">
            {imageUrl ? (
              <div className="relative w-48 h-48 rounded-md overflow-hidden">
                <Image 
                  src={imageUrl} 
                  alt="Imagem" 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="bg-gray-200 w-48 h-48 rounded-md flex items-center justify-center">
                <p className="text-xs text-gray-500">Imagem não disponível</p>
              </div>
            )}
            {message.message?.imageMessage?.caption && (
              <p className="text-sm">{message.message.imageMessage.caption}</p>
            )}
          </div>
        )
        break
        
      case "stickerMessage":
        const stickerUrl = message.message?.stickerMessage?.url
        content = (
          <div className="w-32 h-32 relative">
            {stickerUrl ? (
              <Image 
                src={stickerUrl} 
                alt="Sticker" 
                fill 
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="bg-gray-200 w-full h-full rounded-md flex items-center justify-center">
                <p className="text-xs text-gray-500">Sticker não disponível</p>
              </div>
            )}
          </div>
        )
        break
        
      case "audioMessage":
        content = (
          <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div className="text-xs">Áudio</div>
          </div>
        )
        break
        
      case "videoMessage":
        content = (
          <div className="space-y-1">
            <div className="bg-gray-200 w-48 h-48 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <p className="text-sm">Vídeo</p>
          </div>
        )
        break
        
      default:
        // Tentar extrair texto de qualquer tipo de mensagem
        const textContent = message.conversation || 
                          message.message?.conversation ||
                          message.message?.extendedTextMessage?.text ||
                          message.text ||
                          message.body ||
                          (typeof message.message === 'string' ? message.message : null)
        
        if (textContent) {
          content = <p className="text-sm whitespace-pre-wrap break-words">{textContent}</p>
        } else {
          content = <p className="text-sm text-gray-500">Tipo de mensagem não suportado</p>
        }
    }
  }
  
  // Status da mensagem (apenas para mensagens enviadas)
  const renderMessageStatus = () => {
    if (isReceived) return null
    
    return (
      <span className="text-emerald-50 ml-1">
        <CheckCheck className="h-3 w-3 inline" />
      </span>
    )
  }
  
  return (
    <div 
      className={`flex ${isReceived ? 'justify-start' : 'justify-end'}`}
    >
      <div 
        className={`rounded-2xl p-3 max-w-[80%] relative backdrop-blur-sm shadow-sm ${
          isReceived 
            ? 'bg-white border border-gray-200 rounded-tl-none text-gray-800' 
            : 'bg-gradient-to-br from-emerald-500 to-teal-400 border border-emerald-400/50 rounded-tr-none text-white'
        }`}
      >
        {content}
        <div className="flex items-center justify-end mt-2 space-x-1">
          <span className={`text-[10px] ${isReceived ? 'text-gray-500' : 'text-emerald-50'}`}>{formattedTime}</span>
          {renderMessageStatus()}
        </div>
        
        {/* Triângulo para o balão de mensagem */}
        <div 
          className={`absolute top-0 w-0 h-0 border-8 border-solid ${
            isReceived 
              ? 'left-0 -translate-x-full border-white border-l-transparent border-b-transparent border-t-transparent' 
              : 'right-0 translate-x-full border-emerald-500 border-r-transparent border-b-transparent border-t-transparent'
          }`}
        />
        
        {/* Efeito de glow */}
        <div 
          className={`absolute inset-0 rounded-2xl opacity-20 blur-md -z-10 ${
            isReceived 
              ? 'bg-gray-200/50' 
              : 'bg-emerald-400/30'
          }`}
        />
      </div>
    </div>
  )
} 