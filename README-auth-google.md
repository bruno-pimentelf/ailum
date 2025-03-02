# Solução de Problemas de Autenticação Google

Este documento descreve as alterações feitas para resolver problemas com a autenticação do Google no projeto.

## Alterações Realizadas

1. **Melhorias na Configuração do NextAuth**
   - Adicionados logs detalhados para facilitar o diagnóstico de problemas
   - Configurado o parâmetro `prompt: "select_account"` para permitir que o usuário selecione a conta Google
   - Ativado o modo de debug para obter mais informações sobre erros

2. **Melhorias no Tratamento de Erros**
   - Adicionado tratamento de erros mais robusto no componente de login
   - Implementada verificação de configuração antes de iniciar o login com Google

3. **Ferramentas de Diagnóstico**
   - Criada uma API de verificação (`/api/auth/check`) para validar a configuração do OAuth
   - Desenvolvida uma página de diagnóstico (`/auth/diagnostico`) para verificar a configuração
   - Adicionada documentação detalhada sobre a configuração do Google OAuth

4. **Correções no Arquivo .env**
   - Removidas aspas desnecessárias das variáveis de ambiente
   - Garantida a formatação correta das variáveis

## Páginas Adicionadas

1. **Página de Diagnóstico** (`/auth/diagnostico`)
   - Verifica se as variáveis de ambiente estão configuradas corretamente
   - Testa se os cookies estão habilitados no navegador
   - Fornece sugestões para resolver problemas detectados

2. **Página de Documentação** (`/auth/docs`)
   - Guia passo a passo para configurar o Google OAuth
   - Instruções para configurar as variáveis de ambiente
   - Soluções para problemas comuns de autenticação

## Como Usar

1. **Se estiver enfrentando problemas com a autenticação do Google:**
   - Acesse a página de diagnóstico em `/auth/diagnostico`
   - Verifique se há problemas na configuração
   - Siga as sugestões para resolver os problemas detectados

2. **Para configurar o Google OAuth:**
   - Acesse a página de documentação em `/auth/docs`
   - Siga o guia passo a passo para configurar o Google OAuth
   - Configure as variáveis de ambiente conforme as instruções

## Configuração do Google OAuth

Para configurar o Google OAuth corretamente:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Configure a tela de consentimento OAuth
4. Crie credenciais OAuth para aplicativo web
5. Configure as origens JavaScript autorizadas (ex: `http://localhost:3000`)
6. Configure os URIs de redirecionamento autorizados (ex: `http://localhost:3000/api/auth/callback/google`)
7. Obtenha o ID do cliente e o segredo do cliente
8. Configure as variáveis de ambiente no arquivo `.env`:

```
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-segredo-aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

## Solução de Problemas Comuns

### Erro "OAuthSignin"

Este erro geralmente ocorre quando há problemas com a configuração do OAuth ou com cookies.

- Verifique se as variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão configuradas corretamente
- Certifique-se de que os cookies estão habilitados no navegador
- Verifique se a URL de redirecionamento está configurada corretamente no Google Cloud Console
- Certifique-se de que `NEXTAUTH_URL` corresponde à URL que você está usando para acessar o site

### Botão de login com Google não aparece

Se o botão de login com Google não estiver aparecendo, pode haver problemas com a configuração do provedor.

- Verifique se o provedor Google está configurado corretamente no arquivo de configuração do NextAuth
- Certifique-se de que as variáveis de ambiente estão sendo carregadas corretamente
- Verifique se há erros no console do navegador ou nos logs do servidor 