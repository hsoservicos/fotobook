---
title: 'PostgreSQL + Filesystem com Autenticação'
type: 'feature'
created: '2026-09-08'
status: 'ready-for-dev'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O FotoBook precisa de uma arquitetura comercial com autenticação de usuários, isolamento de dados e persistência robusta. O armazenamento atual (filesystem + JSON) não suporta múltiplos usuários nem integridade referencial.

**Approach:** Migrar para PostgreSQL (metadados + auth) + Filesystem (imagens), com:
- Sistema de usuários registrado (registro/login)
- Schema relacional para fotos, álbuns e tags
- Estrutura de pastas por usuário para uploads
- Isolamento de dados entre usuários

</frozen-after-approval>

**Decisions:**
- ORM: Prisma
- Auth: Custom JWT
- Estrutura de Pastas: `/uploads/{userId}/{uuid}.jpg`
- Providers: Email+Senha + Google OAuth

## Tasks & Acceptance

**Execution:**
- [ ] `schema.prisma` -- Criar schema do banco de dados -- Tabelas: users, photos, albums, audit_logs
- [ ] `.env` -- Configurar variáveis de ambiente -- DATABASE_URL, JWT_SECRET, etc.
- [ ] `src/lib/env.ts` -- Criar validação de variáveis de ambiente
- [ ] `src/lib/db.ts` -- Criar módulo Prisma client (singleton)
- [ ] `src/lib/auth.ts` -- Criar módulo JWT (sign, verify, hash password)
- [ ] `src/lib/rate-limit.ts` -- Criar módulo de rate limiting
- [ ] `src/lib/lockout.ts` -- Criar módulo de account lockout
- [ ] `src/lib/audit.ts` -- Criar módulo de audit log
- [ ] `src/lib/upload-validate.ts` -- Criar validação de upload (magic bytes)
- [ ] `src/app/api/auth/register/route.ts` -- Criar rota de registro
- [ ] `src/app/api/auth/login/route.ts` -- Criar rota de login (com rate limit + lockout)
- [ ] `src/app/api/auth/delete/route.ts` -- Criar rota de exclusão de conta (LGPD)
- [ ] `src/app/api/photos/route.ts` -- Atualizar rota de fotos -- Query DB com userId
- [ ] `src/app/api/upload/route.ts` -- Atualizar rota de upload -- Pasta por usuário
- [ ] `src/app/api/albums/route.ts` -- Criar rota de álbuns -- CRUD
- [ ] `src/app/(auth)/login/page.tsx` -- Criar página de login
- [ ] `src/app/(auth)/register/page.tsx` -- Criar página de registro
- [ ] `src/app/privacidade/page.tsx` -- Criar política de privacidade (LGPD)
- [ ] `src/components/AuthProvider.tsx` -- Criar provider de sessão
- [ ] `src/middleware.ts` -- Criar middleware -- Rotas protegidas
- [ ] `__tests__/auth.test.ts` -- Criar testes de autenticação
- [ ] `__tests__/photos.test.ts` -- Criar testes de fotos
- [ ] `__tests__/albums.test.ts` -- Criar testes de álbuns
- [ ] `__tests__/security.test.ts` -- Criar testes de segurança

**Acceptance Criteria:**
- Given um usuário se registra, when faz login, then recebe um JWT válido
- Given um usuário faz upload, when a foto é salva, then está na pasta /uploads/{userId}/ e com userId no DB
- Given um usuário lista fotos, when consulta o DB, then vê apenas suas fotos (não as de outros)
- Given um usuário cria álbum, when adiciona fotos, then as fotos são vinculadas corretamente
- Given um usuário busca, when usa tags/descrição, then retorna apenas seus resultados
- Given os testes rodam, when executados, then todos passam sem erros

## Code Map

- `package.json` -- Adicionar dependências: prisma, @prisma/client, jsonwebtoken, bcryptjs, uuid
- `src/lib/db.ts` -- Criar módulo Prisma client (singleton)
- `src/lib/auth.ts` -- Criar módulo JWT (sign, verify, hash password)
- `src/app/api/auth/register/route.ts` -- Criar rota de registro
- `src/app/api/auth/login/route.ts` -- Criar rota de login
- `src/app/api/photos/route.ts` -- Substituir leitura de JSON por queries Prisma
- `src/app/api/upload/route.ts` -- Substituir writeFile por Prisma + writeFile em pasta por usuário
- `src/app/api/albums/route.ts` -- Criar rota de álbuns
- `src/app/layout.tsx` -- AdicionarAuthProvider (context de sessão)
- `src/app/page.tsx` -- Adicionar botão de login/logout no header
- `src/middleware.ts` -- Criar middleware de proteção de rotas
- `.env` -- Criar com variáveis de ambiente
- `.gitignore` -- Adicionar .env, .env.local, prisma/migrations

## Schema Prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  passwordHash  String
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  photos        Photo[]
  albums        Album[]
}

model Photo {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  filename      String
  originalName  String
  description   String    @default("")
  tags          String[]  // Array de strings no Postgres
  uploadedAt    DateTime  @default(now())
  size          Int
  mimeType      String
  width         Int?
  height        Int?
  isPublic      Boolean   @default(false)
  isFavorite    Boolean   @default(false)
  albumId       String?
  album         Album?    @relation(fields: [albumId], references: [id])
  
  @@index([userId])
  @@index([albumId])
  @@index([uploadedAt])
}

model Album {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  name          String
  description   String    @default("")
  coverPhotoId  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  photos        Photo[]
  
  @@index([userId])
}

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

## Variáveis de Ambiente (.env)

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fotobook"

# JWT (mínimo 32 caracteres)
JWT_SECRET="sua-chave-secreta-minimo-32-char"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE="10485760"  # 10MB em bytes

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Nota:** Variáveis obrigatórias: DATABASE_URL, JWT_SECRET. As demais são opcionais.

## Segurança

**Autenticação:**
- **Senhas:** Hash com bcrypt (10 rounds)
- **Política de Senha:** Mínimo 8 caracteres, 1 maiúscula, 1 número
- **JWT:** Token HttpOnly, Secure, SameSite=Lax, expiração 15min (access) / 7d (refresh)
- **Rate Limiting:** 5 tentativas/minuto no login
- **Account Lockout:** Bloquear após 5 falhas por 15 minutos
- **CAPTCHA:** reCAPTCHA v2 no registro e login

**Upload:**
- **Validação:** Magic bytes (não só extensão), tamanho máximo 10MB
- **Limites:** Máximo 100 fotos por usuário por dia
- **Armazenamento:** UUID não-guessables para filenames

**Infraestrutura:**
- **HTTPS:** Obrigatório em produção (redirect automático)
- **CORS:** Configurar para domínio específico
- **SQL Injection:** Prisma previne automaticamente
- **Audit Log:** Registrar tentativas de login (sucesso/falha)

**LGPD:**
- **Política de Privacidade:** Página obrigatória
- **Consentimento:** Checkbox no registro
- **Exclusão:** Endpoint para deletar conta e dados
- **Retenção:** Fotos retidas por 5 anos (configurável)

## Prevenções (Pre-mortem)

1. **Validação de Variáveis:** Verificar todas as env vars no startup da aplicação
2. **Transações:** Usar `prisma.$transaction()` em operações críticas (upload + metadata)
3. **Isolamento:** Sempre filtrar por `userId` em queries SELECT
4. **JWT Seguro:** Chave com 32+ caracteres, tokens de curta duração
5. **OAuth Fallback:** Se Google OAuth falhar, usar Email+Senha
6. **Monitoramento:** Logs de erro detalhados, métricas de performance
7. **Index:** Criar indexes em userId, albumId, uploadedAt para performance
8. **Account Lockout:** Bloquear após 5 falhas por 15 minutos
9. **Audit Log:** Registrar tentativas de login (IP, user-agent, timestamp)
10. **Magic Bytes:** Validar header do arquivo, não só extensão
11. **LGPD:** Exclusão de conta, política de privacidade, consentimento

## Rate Limiting

```typescript
// src/lib/rate-limit.ts
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimit.get(key);
  
  if (!record || now > record.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) return false;
  
  record.count++;
  return true;
}
```

## Account Lockout

```typescript
// src/lib/lockout.ts
const lockouts = new Map<string, { attempts: number; lockedUntil: number }>();

export function checkLockout(email: string): { locked: boolean; remainingMs?: number } {
  const record = lockouts.get(email);
  if (!record) return { locked: false };
  
  const now = Date.now();
  if (now > record.lockedUntil) {
    lockouts.delete(email);
    return { locked: false };
  }
  
  return { locked: true, remainingMs: record.lockedUntil - now };
}

export function recordFailedAttempt(email: string): void {
  const record = lockouts.get(email) || { attempts: 0, lockedUntil: 0 };
  record.attempts++;
  
  if (record.attempts >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutos
  }
  
  lockouts.set(email, record);
}

export function clearAttempts(email: string): void {
  lockouts.delete(email);
}
```

## Audit Log

```typescript
// src/lib/audit.ts
interface AuditEntry {
  timestamp: Date;
  event: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'REGISTER' | 'DELETE_ACCOUNT';
  email: string;
  ip: string;
  userAgent: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  // Salvar no banco ou em arquivo de log
  console.log(JSON.stringify(entry));
}
```

## Validação de Upload (Magic Bytes)

```typescript
// src/lib/upload-validate.ts
const MAGIC_BYTES: Record<string, Buffer> = {
  'image/jpeg': Buffer.from([0xFF, 0xD8, 0xFF]),
  'image/png': Buffer.from([0x89, 0x50, 0x4E, 0x47]),
  'image/gif': Buffer.from([0x47, 0x49, 0x46, 0x38]),
  'image/webp': Buffer.from([0x52, 0x49, 0x46, 0x46]),
};

export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const expected = MAGIC_BYTES[mimeType];
  if (!expected) return false;
  
  const header = buffer.subarray(0, expected.length);
  return header.equals(expected);
}
```

## Implementation Notes

- Prisma como ORM (mais popular, melhor documentação)
- JWT custom com jsonwebtoken (mais controle)
- Estrutura de pastas: `/uploads/{userId}/{uuid}.jpg`
- Middleware para rotas protegidas (/upload, /galeria, /api/*)
- Bcrypt para hash de senhas
- Rate limiting no endpoint de login
- Validar env vars no startup (src/lib/env.ts)
- Usar transações Prisma em upload (arquivo + metadata)
- Logs estruturados para debugging

## Estratégia de Longo Prazo

**1. Abstração de Storage:**
```typescript
// src/lib/storage.ts
interface StorageProvider {
  upload(userId: string, filename: string, buffer: Buffer): Promise<string>;
  delete(userId: string, filename: string): Promise<void>;
  getUrl(userId: string, filename: string): Promise<string>;
}

// Implementação local
class LocalStorage implements StorageProvider { ... }

// Futuro: S3 Storage
class S3Storage implements StorageProvider { ... }
```

**2. Cache de Sessão (Futuro Redis):**
- Cache de JWT validation (evitar decode a cada request)
- Cache de queries frequentes (tags, álbuns)
- Rate limiting distribuído

**3. Migração para S3:**
- Quando atingir 1000+ usuários
- Ou quando disco local estiver > 80% cheio
- Manter abstração de storage para facilitar

**4. Monitoramento:**
- Métricas de upload (tempo, tamanho)
- Métricas de query (latência, throughput)
- Alertas de espaço em disco
- Logs de erro centralizados

## Validação de Env Vars

```typescript
// src/lib/env.ts
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

export function validateEnv() {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
}
```

## Transação de Upload

```typescript
// Exemplo: upload + metadata em transação
await prisma.$transaction(async (tx) => {
  const photo = await tx.photo.create({ data: { userId, filename, ... } });
  await fs.mkdir(`uploads/${userId}`, { recursive: true });
  await fs.writeFile(`uploads/${userId}/${filename}`, fileBuffer);
  return photo;
});
```

## Interface de Storage

```typescript
// src/lib/storage.ts
export interface StorageProvider {
  upload(userId: string, filename: string, buffer: Buffer): Promise<string>;
  delete(userId: string, filename: string): Promise<void>;
  getUrl(userId: string, filename: string): string;
}

export class LocalStorage implements StorageProvider {
  constructor(private baseDir: string) {}
  
  async upload(userId: string, filename: string, buffer: Buffer): Promise<string> {
    const dir = `${this.baseDir}/${userId}`;
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(`${dir}/${filename}`, buffer);
    return `${userId}/${filename}`;
  }
  
  async delete(userId: string, filename: string): Promise<void> {
    await fs.unlink(`${this.baseDir}/${userId}/${filename}`);
  }
  
  getUrl(userId: string, filename: string): string {
    return `/uploads/${userId}/${filename}`;
  }
}

// Futuro: S3Storage
// export class S3Storage implements StorageProvider { ... }
```

## Verification

**Commands:**
- `npx prisma db push` -- Verificar schema aplicado
- `npm run dev` -- Verificar app rodando
- `curl http://localhost:3000/api/auth/csrf` -- Verificar auth funcionando

**Manual checks:**
- Registrar novo usuário
- Login com credenciais
- Upload de foto (verificar pasta correta)
- Listar fotos (verificar isolamento)