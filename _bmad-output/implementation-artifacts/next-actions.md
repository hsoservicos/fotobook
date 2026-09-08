# Próximas Ações — FotoBook

**Última atualização:** 2026-09-08
**Status:** Em desenvolvimento

---

## Prioridade Alta (Próxima Sessão)

### 1. Configurar PostgreSQL
- [ ] Criar banco de dados `fotobook` no PostgreSQL
- [ ] Rodar `npx prisma db push` para criar tabelas
- [ ] Testar conexão com variável de ambiente `DATABASE_URL`

### 2. Implementar Security (spec pendente)
- [ ] Criar `src/lib/rate-limit.ts` — Rate limiting (5 tentativas/min)
- [ ] Criar `src/lib/lockout.ts` — Account lockout (5 falhas = 15min)
- [ ] Criar `src/lib/audit.ts` — Audit log de tentativas de login
- [ ] Atualizar `src/app/api/auth/login/route.ts` com rate limit + lockout
- [ ] Criar `src/app/api/auth/delete/route.ts` — Exclusão de conta (LGPD)
- [ ] Criar `src/app/privacidade/page.tsx` — Política de privacidade

### 3. Configurar Testes
- [ ] Instalar Jest ou Vitest
- [ ] Criar testes de autenticação (`__tests__/auth.test.ts`)
- [ ] Criar testes de upload (`__tests__/upload.test.ts`)
- [ ] Criar testes de segurança (`__tests__/security.test.ts`)

---

## Prioridade Média (MVP Completo)

### 4. Google OAuth
- [ ] Configurar Google Cloud Console
- [ ] Criar rotas de callback `/api/auth/google`
- [ ] Integrar com AuthProvider

### 5. UI/UX
- [ ] Criar componentes reutilizáveis (Card, Button, Modal)
- [ ] Melhorar responsividade mobile
- [ ] Adicionar loading states e skeletons
- [ ] Criar página de perfil do usuário

### 6. Funcionalidades
- [ ] Sistema de favoritos (já existe `isFavorite` no schema)
- [ ] Download de fotos
- [ ] Compartilhamento por link
- [ ] Edição de metadados

---

## Prioridade Baixa (Pós-MVP)

### 7. Performance
- [ ] Criar índice GIN para tags (quando > 1000 fotos)
- [ ] Implementar cursor-based pagination
- [ ] Adicionar cache de sessão (Redis)

### 8. Infraestrutura
- [ ] Configurar Coolify deploy
- [ ] Criar Dockerfile
- [ ] Configurar backups automáticos do PostgreSQL
- [ ] Monitoramento de performance

### 9. LGPD Completo
- [ ] Exportação de dados do usuário
- [ ] Anonimização de dados
- [ ] Política de retenção de fotos

---

## Arquitetura Futura

### Migração para S3
- [ ] Criar `src/lib/storage-s3.ts` (implementação S3)
- [ ] Usar interface `StorageProvider` existente
- [ ] Migrar fotos existentes

### Multi-usuário Avançado
- [ ] Papéis (admin, user)
- [ ] Permissões por álbum
- [ ] Compartilhamento entre usuários

---

## Comandos Úteis

```bash
# Criar banco de dados
npx prisma db push

# Gerar Prisma client
npx prisma generate

# Rodar testes
npm test

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Deploy (Coolify)
git push origin main
```

---

## Contatos

- **Desenvolvedor:** Humberto Santos
- **Usuária Principal:** Vânia Rodrigues
- **Repositório:** https://github.com/hsoservicos/fotobook
- **GitHub Pages:** https://hsoservicos.github.io/fotobook/mockup.html

---

*Próxima sessão: Implementar PostgreSQL + Security*
*Até a próxima! 👋*