import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default async function middleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl
  
  // Verificar se o caminho está dentro do diretório (browse)
  const isBrowseRoute = pathname.startsWith('/cursos') || 
                        pathname.startsWith('/whatsapp') || 
                        pathname.startsWith('/mensagens') || 
                        pathname.startsWith('/funis') ||
                        pathname.startsWith('/dashboard') ||
                        pathname === '/'
  
  // Rotas públicas que não precisam de autenticação
  const isPublicRoute = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/api') ||
    pathname.includes('/_next') ||
    pathname.includes('/favicon.ico')
  
  // Se não for uma rota pública, verificar autenticação
  if (!isPublicRoute) {
    const token = await getToken({ req: request })
    
    // Se for uma rota do (browse) e o usuário não estiver autenticado, redirecionar para login
    if (isBrowseRoute && !token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos exceto:
     * 1. /api (rotas da API)
     * 2. /_next (arquivos do Next.js)
     * 3. /_static (se você armazenar arquivos estáticos no pasta public)
     * 4. /favicon.ico, /sitemap.xml (arquivos específicos)
     */
    '/((?!_next|_static|favicon.ico).*)',
  ],
} 