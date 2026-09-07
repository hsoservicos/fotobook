---
title: FotoBook — Product Requirements Document
status: draft
created: 2026-09-07
updated: 2026-09-07
author: Humberto Santos
---

# FotoBook — Product Requirements Document

## 1. Vision & Overview

### 1.1 Product Vision

FotoBook é uma aplicação web pessoal para registro, organização e visualização de fotos pessoais. Projetada para ser simples, intuitiva e direta — sem complexidade desnecessária — permite que a usuária principal (Vânia Rodrigues) faça upload, organize e acesse suas fotos favoritas de qualquer dispositivo.

### 1.2 Problem Statement

A usuária precisa de um espaço pessoal e seguro para:
- Armazenar fotos pessoais com organização simples
- Acessar rapidamente fotos específicas por data, descrição ou tags
- Compartilhar fotos com familiares quando desejar
- Manter memórias organizadas sem depender de plataformas de redes sociais

### 1.3 Target Users

| Persona | Descrição | Necessidades Principais |
|---------|-----------|------------------------|
| **Vânia Rodrigues** | Usuária principal, fotógrafa amadora | Upload simples, organização por tags, busca rápida |
| **Humberto Santos** | Desenvolvedor/Gestor, técnico | Manutenção, expansão de funcionalidades |
| **Familiares** (futuro) | Visualizadores | Acesso compartilhado, download |

### 1.4 Form Factor

- **Primário**: Web Application (responsive — desktop + mobile)
- **Acesso**: Navegador web (Chrome, Firefox, Safari, Edge)
- **Deploy**: Self-hosted via Coolify

### 1.5 Success Metrics

| Métrica | Meta | Medição |
|---------|------|---------|
| Tempo de upload | < 5s para foto de 5MB | Métricas de performance |
| Uso de galeria | > 80% das fotos visualizadas | Analytics de uso |
| Satisfação do usuário | > 4/5 | Feedback da Vânia |
| Disponibilidade | > 99% uptime | Monitoramento |

**Counter-metrics:**
- Não aumentar complexidade do UI acima do necessário
- Manter tempo de carregamento da galeria < 3s

---

## 2. Functional Requirements

### FR-001: Upload de Fotos
**Prioridade:** Crítica
**Descrição:** O sistema deve permitir upload de fotos pessoais de forma simples e direta.

**Sub-requisitos:**
- FR-001.1: Suporte a drag & drop para upload
- FR-001.2: Botão de seleção como alternativa ao drag & drop
- FR-001.3: Upload múltiplo (várias fotos de uma vez)
- FR-001.4: Barra de progresso individual por arquivo
- FR-001.5: Preview instantâneo antes do envio
- FR-001.6: Validação de tipo (JPG, PNG, GIF, WEBP, HEIC)
- FR-001.7: Validação de tamanho (máximo 10MB por arquivo)
- FR-001.8: Feedback de sucesso/erro claro e amigável
- FR-001.9: Campo de descrição (obrigatório, máx. 500 caracteres)
- FR-001.10: Campo de tags (opcional, múltiplas, separadas por vírgula)

**Critérios de Aceite:**
- [ ] Upload funciona em desktop e mobile
- [ ] Progresso é visível durante o envio
- [ ] Erros são exibidos com mensagens claras
- [ ] Preview mostra a imagem selecionada
- [ ] Tags são normalizadas (minúsculas, sem espaços extras)

---

### FR-002: Galeria de Fotos
**Prioridade:** Crítica
**Descrição:** O sistema deve exibir as fotos em uma galeria organizada e visualmente atraente.

**Sub-requisitos:**
- FR-002.1: Grid responsivo (2-4 colunas dependendo do viewport)
- FR-002.2: Modos de visualização: Grid, Masonry, Lista
- FR-002.3: Lazy loading para performance
- FR-002.4: Infinite scroll para carregamento progressivo
- FR-002.5: Skeleton loading durante carregamento
- FR-002.6: Hover effects com informações da foto
- FR-002.7: Empty state amigável quando não há fotos
- FR-002.8: Ordenação por data, nome ou tamanho
- FR-002.9: Busca por texto (descrição, nome, tags)
- FR-002.10: Filtro por tags

**Critérios de Aceite:**
- [ ] Galeria carrega em < 3s com 100+ fotos
- [ ] Modos de visualização alternam sem perda de estado
- [ ] Busca retorna resultados em < 500ms
- [ ] Lazy loading funciona corretamente
- [ ] Mobile mostra layout adaptado

---

### FR-003: Visualização Detalhada (Lightbox)
**Prioridade:** Alta
**Descrição:** O sistema deve permitir visualizar fotos em tamanho ampliado com informações detalhadas.

**Sub-requisitos:**
- FR-003.1: Modal/lightbox com foto em tamanho grande
- FR-003.2: Navegação por setas (esquerda/direita)
- FR-003.3: Navegação por teclado (setas + Escape)
- FR-003.4: Painel lateral com metadados
- FR-003.5: Download da foto original
- FR-003.6: Copiar link da foto
- FR-003.7: Fechar com clique fora ou tecla Escape

**Critérios de Aceite:**
- [ ] Lightbox abre em < 200ms
- [ ] Navegação por teclado funciona
- [ ] Metadados são exibidos corretamente
- [ ] Download inicia imediatamente
- [ ] Fecha corretamente em mobile

---

### FR-004: Organização por Albums
**Prioridade:** Alta
**Descrição:** O sistema deve permitir organizar fotos em albums (coleções temáticas).

**Sub-requisitos:**
- FR-004.1: Criar novo album com nome e descrição
- FR-004.2: Adicionar fotos a um album
- FR-004.3: Remover fotos de um album
- FR-004.4: Listar todos os albums
- FR-004.5: Visualizar fotos de um album específico
- FR-004.6: Definir foto de capa do album
- FR-004.7: Excluir album (não exclui as fotos)

**Critérios de Aceite:**
- [ ] Albums são criados corretamente
- [ ] Fotos podem ser adicionadas/removidas
- [ ] Contagem de fotos por album está correta
- [ ] Capa do album é exibida na listagem

---

### FR-005: Metadados e EXIF
**Prioridade:** Média
**Descrição:** O sistema deve extrair e exibir metadados das fotos automaticamente.

**Sub-requisitos:**
- FR-005.1: Extração automática de dados EXIF no upload
- FR-005.2: Exibir dados da câmera (modelo, configurações)
- FR-005.3: Exibir data/hora de captura
- FR-005.4: Exibir dimensões da imagem
- FR-005.5: Exibir tamanho do arquivo
- FR-005.6: Preservar dados EXIF originais

**Critérios de Aceite:**
- [ ] EXIF é extraído corretamente de JPG e PNG
- [ ] Dados são exibidos no lightbox
- [ ] Dados preservados após upload

---

### FR-006: Busca Avançada
**Prioridade:** Média
**Descrição:** O sistema deve permitir busca por múltiplos critérios.

**Sub-requisitos:**
- FR-006.1: Busca por texto livre
- FR-006.2: Busca por tag específica
- FR-006.3: Busca por período (data)
- FR-006.4: Busca por album
- FR-006.5: Combinar critérios de busca

**Critérios de Aceite:**
- [ ] Busca retorna resultados relevantes
- [ ] Combinação de filtros funciona
- [ ] Resultados são exibidos na galeria

---

## 3. Non-Functional Requirements

### NFR-001: Performance
- Tempo de carregamento inicial da galeria: < 3s
- Tempo de upload (foto de 5MB): < 5s
- Tempo de busca: < 500ms
- Suporte a 1000+ fotos sem degradação

### NFR-002: Usabilidade
- Interface intuitiva para usuários não-técnicos
- Upload com no máximo 2 cliques
- Feedback visual em todas as ações
- Acessibilidade básica (navegação por teclado, contraste)

### NFR-003: Compatibilidade
- Desktop: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- Mobile: iOS 14+, Android 10+
- Resolução: 320px a 2560px

### NFR-004: Segurança
- Validação de tipo MIME (magic bytes)
- Limitação de tamanho (10MB)
- Renomeação para UUID (prevenir directory traversal)
- Armazenamento fora do web root quando possível
- Rate limiting no endpoint de upload

### NFR-005: Privacidade
- Dados EXIF GPS stripped por padrão
- Opção de manter dados EXIF no upload
- Controle de visibilidade (público/privado)
- Conformidade com LGPD (Brasil)

### NFR-006: Manutenibilidade
- Código tipado (TypeScript)
- Componentes reutilizáveis
- API REST documentada
- Tests unitários para APIs críticas

---

## 4. User Journeys

### UJ-001: Primeiro Upload (Vânia)

**Protagonista:** Vânia, 45 anos, fotógrafa amadora
**Contexto:** Vânia acabou de voltar de uma viagem e quer organizar as fotos

**Jornada:**
1. Vânia acessa FotoBook no navegador
2. Clica em "Enviar Fotos" na página inicial
3. Arrasta 5 fotos da pasta do computador para a zona de upload
4. Vê as 5 fotos com preview e campos de descrição
5. Adiciona descrição "Viagem a Porto de Galinhas" na primeira foto
6. Adiciona tags "viagem, praia, família"
7. Clica em "Enviar 5 Fotos"
8. Vê barra de progresso individual para cada foto
9. Após envio, vê confirmação "5 fotos enviadas com sucesso!"
10. Clica em "Ver Galeria" para visualizar

**Sentimento:** Satisfação, alívio de que foi simples

---

### UJ-002: Busca de Foto (Vânia)

**Protagonista:** Vânia
**Contexto:** Vânia quer encontrar uma foto específica de um aniversário

**Jornada:**
1. Vânia acessa a galeria
2. Digita "aniversário" na barra de busca
3. Vê as fotos filtradas aparecerem
4. Clica na foto desejada
5. Lightbox abre com a foto ampliada
6. Vê data, descrição e tags no painel lateral
7. Clica em "Download" para baixar
8. Fecha o lightbox

**Sentimento:** Eficiência, satisfação em encontrar rápido

---

## 5. Technical Architecture (Summary)

### 5.1 Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | Next.js | 15.x (App Router) |
| UI Library | React | 19.x |
| CSS | Tailwind CSS | 4.x |
| Linguagem | TypeScript | 5.x |
| Runtime | Node.js | >= 20.12 |
| Armazenamento | Local (filesystem) | — |
| Deploy | Coolify | 4.3.14 |

### 5.2 API Design

```
POST   /api/upload              → Upload de foto
GET    /api/photos               → Listar fotos (paginado, com filtros)
GET    /api/photos/:id           → Detalhes de uma foto
PATCH  /api/photos/:id           → Atualizar metadados
DELETE /api/photos/:id           → Soft delete

POST   /api/albums               → Criar album
GET    /api/albums               → Listar albums
GET    /api/albums/:id           → Detalhes do album
PATCH  /api/albums/:id           → Atualizar album
DELETE /api/albums/:id           → Remover album

GET    /api/tags                 → Listar tags
POST   /api/tags                 → Criar tag
```

### 5.3 Data Model

```typescript
interface Photo {
  id: string;
  filename: string;
  originalName: string;
  description: string;
  tags: string[];
  uploadedAt: Date;
  size: number;
  mimeType: string;
  url: string;
  exif?: ExifData;
  isPublic: boolean;
  isFavorite: boolean;
  albumId?: string;
}

interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoId?: string;
  createdAt: Date;
  photoCount: number;
}
```

---

## 6. Implementation Phases

### Fase 1: MVP (Atual) ✅
- Upload de fotos com drag & drop
- Galeria básica com grid
- Descrição e tags
- API REST CRUD
- Lightbox com navegação

### Fase 2: Organização (Próxima)
- Albums (criar, gerenciar)
- Busca avançada
- Timeline cronológica
- Favoritos
- Ordenação avançada

### Fase 3: Experiência
- Slideshow
- Download em lote
- Compartilhamento com link
- Exportar metadados
- Exif automático

### Fase 4: IA e Inteligência
- Auto-tags via IA
- Auto-descrição
- Face detection
- Busca semântica
- Deteção de duplicatas

### Fase 5: Escala
- Cloud storage (S3/R2)
- CDN de imagens
- Multi-usuário
- API pública
- Mobile app (PWA)

---

## 7. Assumptions & Constraints

### Assumptions
- [ASSUMPTION] A usuária principal é técnica o suficiente para usar upload
- [ASSUMPTION] Armazenamento local é suficiente para MVP
- [ASSUMPTION] FotoBook será self-hosted via Coolify
- [ASSUMPTION] Não há necessidade de autenticação no MVP (uso pessoal)

### Constraints
- Máximo 10MB por foto
- Formatos aceitos: JPG, PNG, GIF, WEBP, HEIC
- Máximo 20 tags por foto
- Descrição máxima: 500 caracteres

### Dependencies
- Next.js 15 (App Router)
- Node.js >= 20.12
- npm ou yarn
- Coolify para deploy

---

## 8. Open Questions

| # | Pergunta | Owner | Status |
|---|----------|-------|--------|
| 1 | Autenticação será necessária no MVP? | Humberto | Pendente |
| 2 | Armazenamento cloud será necessário? | Humberto | Pendente |
| 3 | Multi-usuário será implementado? | Humberto | Pendente |
| 4 | Integração com redes sociais? | Vânia | Pendente |

---

## 9. Out of Scope (Explicit)

- Autenticação de usuários (MVP)
- Processamento de imagem (resize, crop)
- Compartilhamento público via link (MVP)
- Mobile app nativo
- Integração com redes sociais
- IA para auto-tags (fase futura)
- Reconhecimento facial (fase futura)

---

## 10. Appendices

### A. Referências de Pesquisa
- `docs/pesquisa-referencia-fotobook.md` — Pesquisa abrangente sobre plataformas de imagens
- `_bmad-output/fotobook-project-setup.md` — Configuração do projeto

### B. Screenshots/ wireframes
- Página inicial: Layout limpo com CTA principal
- Upload: Zona de drag & drop com preview
- Galeria: Grid responsivo com 3 modos
- Lightbox: Foto ampliada com painel de metadados

---

*Documento gerado via BMAD Method — PRD v1.0*
*Autor: Humberto Santos*
*Data: 2026-09-07*
