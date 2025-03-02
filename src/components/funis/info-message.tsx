export function InfoMessage() {
  return (
    <div className="mt-3 sm:mt-4 p-2 sm:p-3 md:p-4 bg-muted/30 rounded-lg border border-dashed">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0">
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
        </svg>
        <p className="leading-tight">
          Os contatos são adicionados automaticamente quando novas mensagens são recebidas no WhatsApp.
          <span className="hidden xs:inline"> Arraste os cards entre as colunas para atualizar o status do contato no funil.</span>
        </p>
      </div>
    </div>
  )
} 