import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// Importação com tratamento de erro
let formatPhoneNumber: (phoneNumber: string) => string;
try {
  // Tenta importar a função
  const utils = require("@/lib/utils");
  formatPhoneNumber = utils.formatPhoneNumber;
} catch (error) {
  // Fallback se a importação falhar
  console.warn("Erro ao importar formatPhoneNumber:", error);
  formatPhoneNumber = (phoneNumber: string) => phoneNumber;
}

interface WhatsAppContactProps {
  name: string
  phoneNumber: string
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
  onClick?: () => void
}

export function WhatsAppContact({
  name,
  phoneNumber,
  lastMessage,
  timestamp,
  unreadCount = 0,
  onClick
}: WhatsAppContactProps) {
  // Formatar o número para exibição
  const cleanNumber = phoneNumber.replace('@s.whatsapp.net', '')
  
  // Função local para formatar o número
  const formatNumberFallback = (number: string) => {
    // Remove caracteres não numéricos
    const cleaned = number.replace(/\D/g, "")
    
    // Formato simples para números brasileiros
    if (cleaned.startsWith("55") && cleaned.length >= 12) {
      const ddd = cleaned.substring(2, 4)
      const part1 = cleaned.substring(4, 9)
      const part2 = cleaned.substring(9, 13)
      
      return `(${ddd}) ${part1}-${part2}`
    }
    
    return number
  }
  
  // Usa a função importada se disponível, ou o fallback
  const formattedNumber = typeof formatPhoneNumber === 'function' 
    ? formatPhoneNumber(cleanNumber) 
    : formatNumberFallback(cleanNumber)
  
  // Iniciais para o avatar
  const initials = name
    .split(' ')
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
  
  // Formatar timestamp
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''
  
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:shadow-md group"
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 border-2 border-gray-100 group-hover:border-emerald-200 transition-all duration-300 shadow-sm">
        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-300">
          {initials}
        </AvatarFallback>
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-800 truncate group-hover:text-gray-900 transition-colors duration-200">{name}</h4>
          {formattedTime && (
            <span className="text-xs text-gray-500 group-hover:text-emerald-600 transition-colors duration-200">{formattedTime}</span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500 truncate group-hover:text-gray-600 transition-colors duration-200">
            {lastMessage || formattedNumber}
          </p>
          
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      
      {/* Efeito de glow no hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-emerald-500/10 blur-md -z-10 transition-opacity duration-300" />
    </div>
  )
} 