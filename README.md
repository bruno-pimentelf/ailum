# Ailum

Sistema de gerenciamento para profissionais de saúde.

## Configuração do Banco de Dados

Este projeto utiliza o [Prisma](https://www.prisma.io/) como ORM e o [NeonDB](https://neon.tech/) como banco de dados PostgreSQL serverless.

### Configuração do NeonDB

1. Crie uma conta no [NeonDB](https://neon.tech/)
2. Crie um novo projeto
3. Obtenha a string de conexão do seu banco de dados
4. Atualize o arquivo `.env` com suas credenciais:

```
DATABASE_URL="postgresql://user:password@db.example.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@db.example.neon.tech/neondb?sslmode=require"
```

### Configuração do Prisma

Após configurar o banco de dados, execute os seguintes comandos:

```bash
# Instalar dependências
npm install

# Gerar o cliente Prisma
npm run prisma:generate

# Aplicar migrações
npm run prisma:migrate
```

## Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
npm run dev

# Abrir o Prisma Studio (interface visual para o banco de dados)
npm run prisma:studio
```

## Autenticação

O sistema utiliza o NextAuth.js para autenticação, suportando:

- Login com email/senha
- Login com Google

Para configurar o login com Google, adicione suas credenciais no arquivo `.env`:

```
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
``` 