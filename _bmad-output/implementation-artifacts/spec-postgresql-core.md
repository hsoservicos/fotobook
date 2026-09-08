---
title: 'PostgreSQL Core — Auth + Database + Upload'
type: 'feature'
created: '2026-09-08'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '6048b2b37a5c510ca64c333fa59fc570a718e3b6'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O FotoBook precisa de autenticação de usuários, persistência em PostgreSQL e upload de fotos com isolamento de dados.

**Approach:** Implementar:
- PostgreSQL com Prisma ORM
- Auth custom JWT (registro/login)
- Upload de fotos em pastas por usuário
- CRUD de álbuns

</frozen-after-approval>

**Decisions:**
- ORM: Prisma
- Auth: Custom JWT
- Estrutura: `/uploads/{userId}/{uuid}.jpg`
- Providers: Email+Senha + Google OAuth

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
  tags          String[]
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
```

## Variáveis de Ambiente

```
DATABASE_URL="postgresql://user:password@localhost:5432/fotobook"
JWT_SECRET="minimo-32-caracteres-aleatorios"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
UPLOAD_DIR="./public/uploads"
```

## Tasks & Acceptance

**Execution:**
- [x] `schema.prisma` -- Criar schema do banco
- [x] `.env` -- Configurar variáveis de ambiente
- [x] `src/lib/env.ts` -- Validar env vars no startup
- [x] `src/lib/db.ts` -- Criar Prisma client singleton
- [x] `src/lib/auth.ts` -- JWT sign/verify + bcrypt
- [x] `src/lib/storage.ts` -- Interface de storage + LocalStorage
- [x] `src/app/api/auth/register/route.ts` -- Rota de registro
- [x] `src/app/api/auth/login/route.ts` -- Rota de login
- [x] `src/app/api/photos/route.ts` -- Listar fotos (com userId)
- [x] `src/app/api/upload/route.ts` -- Upload em pasta por usuário
- [x] `src/app/api/albums/route.ts` -- CRUD de álbuns
- [x] `src/app/(auth)/login/page.tsx` -- Página de login
- [x] `src/app/(auth)/register/page.tsx` -- Página de registro
- [x] `src/components/AuthProvider.tsx` -- Provider de sessão
- [x] `src/middleware.ts` -- Rotas protegidas
- [ ] `__tests__/auth.test.ts` -- Testes de autenticação (pendente: sem framework de testes)
- [ ] `__tests__/photos.test.ts` -- Testes de fotos (pendente: sem framework de testes)

**Acceptance Criteria:**
- Given um usuário se registra, when faz login, then recebe JWT válido
- Given um usuário faz upload, when salva, then foto está em `/uploads/{userId}/`
- Given um usuário lista fotos, when consulta DB, then vê apenas suas fotos
- Given um usuário cria álbum, when adiciona fotos, then vinculam corretamente

## Code Map

- `package.json` -- Adicionar prisma, @prisma/client, jsonwebtoken, bcryptjs
- `src/lib/db.ts` -- Prisma client singleton
- `src/lib/auth.ts` -- JWT + bcrypt
- `src/lib/storage.ts` -- Interface StorageProvider
- `src/app/api/auth/*` -- Rotas de autenticação
- `src/app/api/photos/route.ts` -- Query DB com userId
- `src/app/api/upload/route.ts` -- Upload + transação
- `src/app/api/albums/route.ts` -- CRUD álbuns
- `src/middleware.ts` -- Proteção de rotas

## Implementation Notes

- Prisma para ORM (melhor documentação)
- JWT custom para controle total
- Transações em upload (arquivo + metadata)
- Validar env vars no startup

## Verification

**Commands:**
- `npx prisma db push` -- Schema aplicado
- `npm run dev` -- App rodando
- Testes manuais: registro, login, upload, listagem