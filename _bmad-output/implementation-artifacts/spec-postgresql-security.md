---
title: 'PostgreSQL Security — Rate Limit, Lockout, Audit, LGPD'
type: 'feature'
created: '2026-09-08'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context: ['spec-postgresql-core.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O FotoBook precisa de camadas de segurança avançadas: rate limiting, account lockout, audit log e conformidade com LGPD.

**Approach:** Implementar:
- Rate limiting (5 tentativas/min)
- Account lockout (5 falhas = 15min)
- Audit log de tentativas de login
- Validação de magic bytes no upload
- Exclusão de conta (LGPD)
- Política de privacidade

</frozen-after-approval>

## Schema Prisma (Adição)

```prisma
model AuditLog {
  id            String    @id @default(uuid())
  event         String    // LOGIN_SUCCESS, LOGIN_FAILED, REGISTER, DELETE_ACCOUNT
  email         String
  ip            String
  userAgent     String
  createdAt     DateTime  @default(now())
  
  @@index([email])
  @@index([createdAt])
}
```

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/rate-limit.ts` -- Rate limiting (in-memory)
- [ ] `src/lib/lockout.ts` -- Account lockout (5 falhas/15min)
- [ ] `src/lib/audit.ts` -- Audit log (tentativas de login)
- [ ] `src/lib/upload-validate.ts` -- Validação magic bytes
- [ ] `src/app/api/auth/delete/route.ts` -- Exclusão de conta (LGPD)
- [ ] `src/app/privacidade/page.tsx` -- Política de privacidade
- [ ] `__tests__/security.test.ts` -- Testes de segurança

**Acceptance Criteria:**
- Given 6 tentativas falhas, when 7ª tentativa, then conta bloqueada por 15min
- Given upload de arquivo, when magic bytes inválidos, then rejeitado
- Given usuário deleta conta, when confirma, then dados removidos do DB
- Given tentativa de login, when registrada, then audit log criado

## Code Map

- `src/lib/rate-limit.ts` -- Rate limiting
- `src/lib/lockout.ts` -- Account lockout
- `src/lib/audit.ts` -- Audit log
- `src/lib/upload-validate.ts` -- Magic bytes
- `src/app/api/auth/delete/route.ts` -- Exclusão LGPD
- `src/app/privacidade/page.tsx` -- Política privacidade
- `src/app/api/auth/login/route.ts` -- Atualizar com rate limit + lockout + audit

## Implementation Notes

- Rate limiting: Map em memória (futuro Redis)
- Lockout: Map em memória com TTL
- Audit: Salvar no PostgreSQL (tabela AuditLog)
- Magic bytes: Validar header do arquivo
- LGPD: Endpoint de exclusão com confirmação

## Verification

**Commands:**
- Testes de rate limit (6 requisições)
- Testes de lockout (5 falhas)
- Testes de magic bytes (arquivo inválido)
- Testes de exclusão de conta