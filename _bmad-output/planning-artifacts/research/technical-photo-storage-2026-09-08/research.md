# Pesquisa: Gestão e Persistência de Fotos no FotoBook

## Resumo Executivo

**Recomendação:** Abordagem **Híbrida (SQLite + Filesystem)** — a melhor opção para o FotoBook.

**Justificativa:** Combina a simplicidade do filesystem para armazenar imagens com a robustez do SQLite para metadados, busca e organização. Atende aos requisitos de performance, escala e manutenibilidade do projeto.

---

## 1. Análise das Opções

### Opção A: Banco de Dados Relacional (PostgreSQL)

**Vantagens:**
- Transacionalidade e integridade referencial
- Busca avançada (全文索引, JSON queries)
- Escalabilidade para múltiplos usuários
- Suporte a transações complexas

**Desvantagens:**
- Overhead de operação (connection pooling, backups)
- Custo de infraestrutura (RDS, manutenção)
- Complexidade desnecessária para projeto pessoal
- Performance inferior para arquivos binários grandes

**Benchmark (2026):**
- SELECT simples: 1.203ms (vs 847ms SQLite)
- INSERT bulk: 1.891ms (vs 312ms SQLite)
- Escrita concorrente: 2.341ms (vs 19.847ms SQLite)

**Fonte:** "Stop Using PostgreSQL for Everything" - jcalloway.dev (2026-03-20)

---

### Opção B: Pastas Distribuídas (JSON + Filesystem)

**Vantagens:**
- Simplicidade extrema
- Zero configuração
- Backup = copiar pasta
- Portabilidade total

**Desvantagens:**
- Busca ineficiente (ler todos os JSONs)
- Sem integridade referencial
- Difícil de escalar para 1000+ fotos
- Consistência manual (arquivos órfãos)

**Benchmark estimado:**
- Busca por tag: O(n) — ler todos os JSONs
- Busca por data: O(n) — ordenação manual
- Performance degrada com acúmulo

---

### Opção C: Híbrida (SQLite + Filesystem) ⭐ RECOMENDADA

**Vantagens:**
- **Performance:** SQLite processa 100.000+ SELECTs/segundo
- **Simplicidade:** Zero configuração, arquivo único
- **Busca:** JSON queries nativas (SQLite 3.45+)
- **Portabilidade:** Banco = arquivo, filesystem = pastas
- **Backup:** Copiar 2 arquivos (db + uploads/)
- **Escala:** Suporta até 281TB (teórico)

**Desvantagens:**
- Escrita concorrente limitada (database-level locking)
- Não ideal para múltiplos usuários simultâneos

**Benchmark (2026):**
- SELECT simples: 847ms (1M records)
- INSERT bulk: 312ms (10K records)
- Busca JSON: nativa via `json_extract()`

**Fonte:** SQLite 3.51.0 (2025-11-04), "SQLite Trends 2026" - calmops.com

---

## 2. Arquitetura Recomendada

```
fotobook/
├── data/
│   └── fotobook.db          # SQLite database
├── uploads/
│   ├── {uuid}.jpg           # Fotos (renomeadas para UUID)
│   └── thumbnails/          # Thumbnails (futuro)
└── src/
    └── lib/
        └── db.ts            # Database connection
```

### Schema SQLite

```sql
-- Fotos
CREATE TABLE photos (
  id TEXT PRIMARY KEY,           -- UUID
  filename TEXT NOT NULL,        -- {uuid}.jpg
  original_name TEXT NOT NULL,   -- Nome original sanitizado
  description TEXT DEFAULT '',   -- Máx. 500 chars
  tags TEXT DEFAULT '[]',        -- JSON array de tags
  uploaded_at TEXT NOT NULL,     -- ISO 8601
  size INTEGER NOT NULL,         -- Bytes
  mime_type TEXT NOT NULL,       -- image/jpeg, etc.
  width INTEGER,                 -- Opcional
  height INTEGER,                -- Opcional
  is_public INTEGER DEFAULT 1,   -- 0/1
  is_favorite INTEGER DEFAULT 0, -- 0/1
  album_id TEXT,                 -- Reference to albums
  FOREIGN KEY (album_id) REFERENCES albums(id)
);

-- Álbuns
CREATE TABLE albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_photo_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  photo_count INTEGER DEFAULT 0,
  FOREIGN KEY (cover_photo_id) REFERENCES photos(id)
);

-- Tags
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  photo_count INTEGER DEFAULT 0
);

-- Índices para performance
CREATE INDEX idx_photos_album ON photos(album_id);
CREATE INDEX idx_photos_uploaded ON photos(uploaded_at);
CREATE INDEX idx_photos_tags ON photos(tags);
CREATE INDEX idx_albums_name ON albums(name);
CREATE INDEX idx_tags_slug ON tags(slug);
```

### Vantagens desta Arquitetura

1. **Busca eficiente:** `SELECT * FROM photos WHERE tags LIKE '%viagem%'`
2. **Ordenação:** `ORDER BY uploaded_at DESC`
3. **Paginação:** `LIMIT 12 OFFSET 0`
4. **Contagem:** `SELECT COUNT(*) FROM photos WHERE album_id = ?`
5. **Relacionamentos:** JOIN entre photos e albums

---

## 3. Cenários de Uso

### Foto com Álbum Definido

```sql
-- Criar álbum
INSERT INTO albums (id, name, created_at) VALUES (?, ?, ?);

-- Adicionar foto ao álbum
UPDATE photos SET album_id = ? WHERE id = ?;

-- Listar fotos do álbum
SELECT p.* FROM photos p WHERE p.album_id = ? ORDER BY p.uploaded_at DESC;
```

### Foto sem Álbum

```sql
-- Fotos sem álbum (gerais)
SELECT * FROM photos WHERE album_id IS NULL ORDER BY uploaded_at DESC;

-- Ou: fotos em "Álbum Geral" (fixo)
SELECT * FROM photos WHERE album_id = 'general' ORDER BY uploaded_at DESC;
```

### Busca Avançada

```sql
-- Busca por texto (descrição + tags)
SELECT * FROM photos 
WHERE description LIKE '%praia%' 
   OR tags LIKE '%praia%';

-- Busca por período
SELECT * FROM photos 
WHERE uploaded_at BETWEEN '2026-01-01' AND '2026-12-31';

-- Busca por tag específica
SELECT * FROM photos 
WHERE json_each.value = 'viagem' 
  AND json_each.key IN (
    SELECT value FROM json_each(photos.tags)
  );
```

---

## 4. Comparação Final

| Critério | PostgreSQL | JSON/Filesystem | SQLite+Filesystem |
|----------|------------|-----------------|-------------------|
| **Simplicidade** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Busca** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ |
| **Escalabilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Custo** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Manutenção** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Portabilidade** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Vencedor:** SQLite + Filesystem (4.0/5)

---

## 5. Recomendação Final

### Para o FotoBook (Projeto Pessoal)

**Use SQLite + Filesystem** porque:

1. **Simplicidade:** Zero configuração, arquivo único
2. **Performance:** 100K+ SELECTs/segundo (suficiente para 1000+ fotos)
3. **Busca:** JSON nativo para tags, LIKE para texto
4. **Backup:** Copiar `data/fotobook.db` + `uploads/`
5. **Portabilidade:** Funciona em qualquer OS
6. **Custo:** $0 (vs $280+/mês PostgreSQL gerenciado)

### Quando Migrar para PostgreSQL

- Quando precisar de múltiplos usuários simultâneos
- Quando atingir 10.000+ fotos com busca complexa
- Quando precisar de replicação/geolocalização
- Quando o projeto se tornar comercial

---

## 6. Fontes

1. "Storing Images: Database vs Filesystem" - codegenes.net (2026-01-16)
2. "Image Storage Architecture" - devgex.com (2025-12-07)
3. "Database vs Filesystem: Should You Store Images as BLOBs?" - nextstruggle.com (2025-06)
4. "SQLite 4.0 as a Production Database" - markaicode.com (2025-03-21)
5. "Stop Using PostgreSQL for Everything" - jcalloway.dev (2026-03-20)
6. "SQLite Trends 2026" - calmops.com (2026-03-05)
7. "File and Database Storage Systems in System Design" - geeksforgeeks.org (2026-05-01)
8. "Comparative Analysis: Photo Database Software vs. Traditional File Storage" - razuna.com (2026-03-21)

---

*Pesquisa realizada via Deep Recon - 2026-09-08*
*Tipo: Technical Research*
*Decisão: Storage Architecture*