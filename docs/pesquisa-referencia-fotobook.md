# 📸 FotoBook — Documento de Pesquisa e Referência

**Versão**: 1.0.0
**Data**: 2026-09-07
**Autor**: Humberto Santos (via Codebuff/Buffy)
**Projeto**: FotoBook — Aplicação Web para Registro de Fotos Pessoais
**Usuária Principal**: Vânia Rodrigues

---

## Sumário Executivo

Este documento compila pesquisa abrangente sobre as principais plataformas de imagens, padrões modernos de upload, organização fotográfica, geração de legendas com IA, otimização de entrega e melhores práticas de UX/UI para aplicações de gerenciamento de fotos. As informações aqui reunidas servem como base para a definição, estruturação e modernização do projeto FotoBook.

---

## 1. Panorama das Plataformas de Imagens (2025-2026)

### 1.1 Principais Plataformas Analisadas

| Plataforma | Foco | Armazenamento | Público | Diferencial |
|------------|------|---------------|---------|-------------|
| **Flickr** | Fotógrafos amadores/profissionais | 1.000 fotos (grátis) / Ilimitado (Pro) | Comunidade fotográfica | Stats detalhados, embed, resoluções múltiplas |
| **500px** | Profissionais | 2.000 fotos (grátis, 20/semana) | Comunidade premium | Venda/licenciamento, alta resolução, NFT Vault |
| **Google Photos** | Pessoal/família | Ilimitado (qualidade reduzida) | Massivo | IA facial, busca inteligente, compartilhamento |
| **Unsplash** | Royalty-free | Ilimitado | Criadores | Comunidade de stock fotográfico gratuito |
| **Behance** | Criativos | Ilimitado | Portfólios | Integração Adobe, projetos em andamento |
| **VSCO** | Mobile/social | Via app | Jovens criativos | Presets, edição avançada, design limpo |
| **Imgur** | Casual/viral | Ilimitado | Reddit/comunidades | Simplicidade, viralidade |
| **Photobucket** | All-in-one | 250 (grátis) / Ilimitado (Expert) | Generalista | Impressões, baixa compressão |

### 1.2 Lições Aprendidas para o FotoBook

| Lição | Fonte | Aplicação no FotoBook |
|-------|-------|----------------------|
| **Fotos merecem espaço** | 500px | Layout limpo, fotos grandes, controles mínimos |
| **Organização por coleções** | Flickr (Sets/Stories) | Albums e tags como organizadores primários |
| **IA facilita a busca** | Google Photos | Tags automáticas, busca por data/local/pessoa |
| **Compartilhamento com controle** | Google Photos | Permissões granulares de visualização |
| **Simplicidade é rei** | Imgur/VSCO | Upload em 1-2 cliques, interface limpa |
| **Estatísticas valorizam** | Flickr/500px | Contador de visualizações, dados de engajamento |

---

## 2. Metadados Fotográficos: EXIF, IPTC e XMP

### 2.1 Os Três Padrões

| Padrão | Nome Completo | Foco | Dados Principais |
|--------|--------------|------|------------------|
| **EXIF** | Exchangeable Image File Format | Dados da câmera | Velocidade, abertura, ISO, GPS, data/hora, modelo da câmera |
| **IPTC** | International Press Telecommunications Council | Dados descritivos | Copyright, autor, legenda, keywords, crédito, embargo |
| **XMP** | Extensible Metadata Platform | Framework flexível | Todos os anteriores + direitos, licenciamento, histórico de edição |

### 2.2 Campos de Metadados Recomendados para o FotoBook

```typescript
interface PhotoMetadata {
  // === Dados EXIF (extraídos automaticamente) ===
  exif: {
    camera: {
      make: string;           // "Canon", "Apple"
      model: string;          // "EOS R5", "iPhone 15 Pro"
      lens?: string;          // "RF 24-70mm"
    };
    settings: {
      iso: number;
      aperture: string;       // "f/2.8"
      shutterSpeed: string;   // "1/250"
      focalLength: string;    // "50mm"
      flash?: boolean;
    };
    gps?: {
      latitude: number;
      longitude: number;
      altitude?: number;
    };
    timestamp: Date;
    orientation: number;
    dimensions: {
      width: number;
      height: number;
    };
  };

  // === Dados IPTC/XMP (preenchidos pelo usuário) ===
  descriptive: {
    title?: string;
    description: string;       // Legenda principal
    keywords: string[];        // Tags
    author: string;            // "Vânia Rodrigues"
    copyright: string;
    location?: {
      name?: string;           // "Praia de Boa Viagem"
      city?: string;
      state?: string;
      country?: string;
    };
  };

  // === Dados Administrativos ===
  admin: {
    uploadedAt: Date;
    fileSize: number;
    mimeType: string;
    format: string;
    isPublic: boolean;
    album?: string;
  };
}
```

### 2.3 Melhores Práticas para Metadados

1. **Extrair EXIF automaticamente** no upload usando `sharp` ou `exiftool`
2. **Preservar dados de câmera** para consulta do usuário
3. **Solicitar dados IPTC** (legenda, tags) no formulário de upload
4. **Strip dados sensíveis** (GPS exato) por padrão por privacidade
5. **Opção de manter/remover** metadados antes de compartilhar

---

## 3. UX/UI para Upload de Fotos

### 3.1 Padrões Essenciais (Estudo de 24+ Plataformas)

| Padrão | Descrição | Prioridade |
|--------|-----------|------------|
| **Drop Zone clara** | Área visual delimitada com instruções | ⭐⭐⭐ Crítico |
| **Drag & Drop** | Arrastar arquivos para a zona de upload | ⭐⭐⭐ Crítico |
| **Botão de seleção** | Fallback para quem não usa drag & drop | ⭐⭐⭐ Crítico |
| **Preview instantâneo** | Thumbnail da imagem selecionada antes de enviar | ⭐⭐⭐ Crítico |
| **Barra de progresso** | Indicador visual do progresso do upload | ⭐⭐⭐ Crítico |
| **Validação de tipo** | Apenas imagens (JPG, PNG, GIF, WEBP) | ⭐⭐⭐ Crítico |
| **Validação de tamanho** | Limite claro (ex: 10MB por arquivo) | ⭐⭐⭐ Crítico |
| **Upload múltiplo** | Selecionar/enviar várias fotos de uma vez | ⭐⭐ Importante |
| **Feedback de sucesso** | Confirmação visual clara após upload | ⭐⭐⭐ Crítico |
| **Tratamento de erros** | Mensagens amigáveis com ação de retry | ⭐⭐⭐ Crítico |
| **Acessibilidade** | Navegação por teclado, leitores de tela | ⭐⭐ Importante |
| **Responsividade** | Funciona bem em mobile e desktop | ⭐⭐⭐ Crítico |

### 3.2 Estados do Upload

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   IDLE      │───▶│  DRAGGING   │───▶│  UPLOADING  │───▶│  SUCCESS    │
│  (Esperando)│    │ (Arrastando)│    │  (Enviando) │    │ (Concluído) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
  ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
  │ Drop    │      │ Highlight│      │ Progress│      │ Check   │
  │ Zone    │      │ Border   │      │ Bar     │      │ Mark    │
  │ Normal  │      │ Blue     │      │ + %     │      │ + Toast │
  └─────────┘      └─────────┘      └─────────┘      └─────────┘
```

### 3.3 Melhores Práticas de UI para Upload

Baseado em estudo de Eleken, Uploadcare, Filestack e patterns do industry:

1. **Zona de Drop**: Borda tracejada, ícone central, texto claro ("Arraste fotos aqui ou clique para selecionar")
2. **Preview**: Thumbnail imediato com nome do arquivo e tamanho
3. **Progresso**: Barra por arquivo + progresso geral para upload múltiplo
4. **Validação**: Mensagens inline antes do upload (tipo, tamanho)
5. **Mobile**: Botão "Câmera" + "Galeria" para nativos do celular
6. **Skeleton Loading**: Placeholder animado enquanto a imagem carrega na galeria

---

## 4. Organização e Estrutura de Fotos

### 4.1 Modelo de Organização

```
FotoBook Organization Model
├── 📁 Albums (Coleções temáticas)
│   ├── Férias 2026
│   ├── Família
│   ├── Natureza
│   └── ...
├── 🏷️ Tags (Palavras-chave)
│   ├── praia, lua, pôr-do-sol
│   ├── família, aniversário
│   └── ...
├── 📅 Timeline (Cronológica)
│   ├── 2026
│   │   ├── Setembro
│   │   ├── Agosto
│   │   └── ...
│   └── 2025
│       └── ...
├── 📍 Localização (Geotag)
│   ├── Brasil
│   │   ├── Pernambuco
│   │   └── ...
│   └── ...
└── 👤 Pessoas (Face Recognition - futuro)
    ├── Vânia
    ├── Humberto
    └── ...
```

### 4.2 Estrutura de Dados Recomendada

```typescript
// Albums
interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhotoId?: string;
  createdAt: Date;
  updatedAt: Date;
  photoCount: number;
  isPublic: boolean;
}

// Tags
interface Tag {
  id: string;
  name: string;
  slug: string;
  photoCount: number;
  color?: string;
}

// Photo (modelo completo)
interface Photo {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  blurDataURL?: string;  // Para placeholder

  // Informações básicas
  title?: string;
  description: string;
  tags: Tag[];

  // Metadados EXIF (extraídos)
  exif?: PhotoExifData;

  // Localização
  location?: {
    name?: string;
    latitude?: number;
    longitude?: number;
  };

  // Organização
  albumId?: string;
  uploadedBy: string;
  uploadedAt: Date;

  // Técnicos
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  format: string;

  // Flags
  isFavorite: boolean;
  isPublic: boolean;
  isDeleted: boolean;  // Soft delete
}
```

### 4.3 Fluxo de Organização

```
Upload → Metadados EXIF extraídos → Usuário adiciona:
  ├── Descrição (obrigatório)
  ├── Tags (opcional, múltiplas)
  ├── Album (opcional)
  ├── Localização (manual ou EXIF)
  └── Favorito (toggle)

Organização Automática (futuro):
  ├── Timeline por data de captura
  ├── Detecção de pessoas (face recognition)
  ├── Tags automáticas via IA
  └── Sugestão de albums
```

---

## 5. Geração de Legendas e Descrições com IA

### 5.1 Ferramentas e Abordagens

| Ferramenta | Tipo | Capacidade | Custo |
|------------|------|------------|-------|
| **OpenAI GPT-4o Vision** | API | Descrição detalhada de imagens | Pago |
| **Google Gemini Vision** | API | Análise de conteúdo, tags | Pago |
| **Claude Vision** | API | Descrição contextual | Pago |
| **Pallyy Caption Generator** | Web | Legendas para redes sociais | Grátis |
| **Hootsuite AI Caption** | Web/Social | Captions para redes sociais | Grátis |
| **Canva AI Caption** | Web | Legendas criativas | Freemium |
| **ImageCaptionGenerator.com** | Web | Legendas automáticas | Grátis |

### 5.2 Capacidades de IA para FotoBook

| Capacidade | Descrição | Implementação | Prioridade |
|------------|-----------|---------------|------------|
| **Auto-descrição** | Gerar descrição da cena | API Vision (OpenAI/Google) | ⭐⭐ Futuro |
| **Auto-tags** | Sugerir tags baseadas no conteúdo | API Vision | ⭐⭐ Futuro |
| **Face Detection** | Detectar rostos na foto | TensorFlow.js / API | ⭐⭐ Futuro |
| **OCR** | Extrair texto visível nas fotos | Tesseract.js / API | ⭐ Futuro |
| **Similaridade** | Encontrar fotos parecidas | Embeddings + busca vetorial | ⭐ Futuro |

### 5.3 Exemplo de Integração com IA

```typescript
// Exemplo de geração de descrição automática
async function generatePhotoDescription(imageUrl: string): Promise<string> {
  const response = await fetch('/api/ai/describe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  });

  const { description, tags, objects } = await response.json();
  return description;
}

// Resposta esperada:
{
  "description": "Uma paisagem costeira ao pôr do sol com palmeiras e águas calmas",
  "tags": ["pôr-do-sol", "praia", "palmeiras", "natureza", "mar"],
  "objects": ["céu", "nuvens", "palmeira", "água", "areia"],
  "mood": "tranquilo",
  "colors": ["dourado", "azul", "verde"]
}
```

---

## 6. Otimização e Entrega de Imagens

### 6.1 Formatos Modernos (2026)

| Formato | Compressão | Qualidade | Suporte | Recomendação |
|---------|-----------|-----------|---------|--------------|
| **AVIF** | 15-30% menor que WebP | Excelente | 92%+ browsers | Formato preferido |
| **WebP** | 25-34% menor que JPEG | Muito boa | 97%+ browsers | Fallback principal |
| **JPEG** | Padrão | Boa | 100% browsers | Compatibilidade |
| **PNG** | Lossless | Perfeita | 100% browsers | Transparência |
| **HEIF/HEIC** | Excelente | Excelente | Limitado | Apple ecosystem |

### 6.2 Pipeline de Otimização

```
Upload Original (até 10MB)
       │
       ▼
┌─────────────────────────┐
│  Validação              │
│  - Tipo MIME            │
│  - Tamanho              │
│  - Dimensões            │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Processamento          │
│  - Extrair EXIF         │
│  - Gerar thumbnail      │
│  - Gerar blurDataURL    │
│  - Converter formatos   │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Geração de Variantes   │
│  - Thumbnail (300px)    │
│  - Média (800px)        │
│  - Grande (1920px)      │
│  - Original (preservar) │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  Armazenamento          │
│  - Original no disco    │
│  - Variantes otimizadas │
│  - Metadados em JSON    │
└─────────────────────────┘
```

### 6.3 Otimização com Next.js `<Image>`

```tsx
import Image from 'next/image';

// Exemplo de uso otimizado
<Image
  src="/uploads/photo-123.jpg"
  alt="Pôr do sol na praia"
  width={800}
  height={600}
  priority={true}           // Para imagens above-the-fold
  placeholder="blur"
  blurDataURL={photo.blurDataURL}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
/>

// Conversão automática:
// - Gera versões AVIF e WebP
//  - Cria tamanhos responsivos
//  - Serve formato ideal para o browser
```

### 6.4 Estratégia de Cache

```
Browser Cache:
├── thumbnails: 30 dias (immutable)
├── imagens processadas: 7 dias
└── API responses: 5 minutos

CDN Cache (se aplicável):
├── imagens: 1 ano (immutable)
└── thumbnails: 1 ano (immutable)

Service Worker (futuro):
├── Cache-first para thumbnails
├── Network-first para detalhes
└── Offline fallback
```

---

## 7. Segurança e Privacidade

### 7.1 Riscos de Metadados (EXIF)

| Dado Sensível | Risco | Mitigação |
|---------------|-------|-----------|
| **GPS/Geolocalização** | Revela localização exata | Strip por padrão, opt-in para manter |
| **Data/Hora** | Revela rotinas | Manter para organização, ocultar em público |
| **Modelo da Câmera** | Info do dispositivo | Manter para o autor |
| **Software de edição** | Revela ferramentas | Opcional |

### 7.2 Melhores Práticas de Segurança

1. **Validar tipo MIME** nos primeiros bytes (não confiar no Content-Type)
2. **Limitar tamanho** (10MB por arquivo)
3. **Renomear arquivos** para UUID (prevenir directory traversal)
4. **Armazenar fora do web root** quando possível
5. **Strip dados EXIF sensíveis** antes de compartilhar publicamente
6. **Rate limiting** no endpoint de upload
7. **Autenticação** obrigatória para upload
8. **Validação de dimensões** (evitar imagens extremamente grandes)
9. **Scan de vírus** (opcional, para ambientes compartilhados)
10. **Soft delete** (não deletar permanentemente)

### 7.3 Checklist de Privacidade

```
Privacidade do Usuário:
[ ] GPS stripping habilitado por padrão
[ ] Opção de manter dados EXIF no upload
[ ] Aviso sobre dados visíveis em fotos públicas
[ ] Controle de visibilidade (público/privado)
[ ] Opção de download removido para visualizadores
[ ] conformidade com LGPD (Brasil)
```

---

## 8. Padrões de API para Upload

### 8.1 Abordagens de Upload

| Método | Quando Usar | Complexidade |
|--------|------------|--------------|
| **multipart/form-data** | Upload simples, < 100MB | Baixa |
| **Base64 em JSON** | Arquivos pequenos com metadata complexa | Média |
| **Chunked Upload** | Arquivos grandes (> 100MB) | Alta |
| **Tus Protocol** | Upload resumível, large files | Alta |
| **Presigned URL** | Upload direto para S3/cloud | Média |

### 8.2 Estrutura de API Recomendada para FotoBook

```
POST   /api/upload              → Upload de foto (multipart/form-data)
GET    /api/photos               → Listar fotos (paginado)
GET    /api/photos/:id           → Detalhes de uma foto
PATCH  /api/photos/:id           → Atualizar metadados
DELETE /api/photos/:id           → Soft delete
GET    /api/photos/:id/download  → Download original

POST   /api/albums               → Criar album
GET    /api/albums               → Listar albums
GET    /api/albums/:id           → Detalhes do album
PATCH  /api/albums/:id           → Atualizar album
DELETE /api/albums/:id           → Remover album
POST   /api/albums/:id/photos    → Adicionar fotos ao album

GET    /api/tags                 → Listar tags
POST   /api/tags                 → Criar tag
GET    /api/tags/:slug/photos    → Fotos por tag

GET    /api/search?q=...         → Busca avançada
GET    /api/timeline?year=&month= → Timeline cronológica
```

### 8.3 Exemplo de Upload com Progresso

```typescript
// Frontend: Upload com progresso
async function uploadPhoto(
  file: File,
  metadata: PhotoMetadataInput,
  onProgress: (percent: number) => void
): Promise<Photo> {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('description', metadata.description);
  formData.append('tags', JSON.stringify(metadata.tags));
  formData.append('albumId', metadata.albumId || '');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error')));

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}
```

---

## 9. Layout da Galeria: Padrões Modernos

### 9.1 Tipos de Grid

| Tipo | Descrição | Quando Usar |
|------|-----------|-------------|
| **Masonry (Pinterest)** | Altura variada, sem lacunas | Fotos com proporções diferentes |
| **Grid Uniforme** | Tamanho fixo, bem alinhado | Fotos quadradas ou padronizadas |
| **Carousel/Slider** | Uma foto por vez, navegação lateral | Destaque de fotos |
| **Timeline** | Agrupadas por data | Navegação cronológica |
| **List/Detail** | Lista + painel de detalhes | Organização por metadados |

### 9.2 CSS Masonry (2026)

```css
/* Masonry nativo com CSS Grid (suporte crescente) */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 8px;
}

.gallery-item {
  grid-row: span var(--row-span);
}

/* Fallback com biblioteca (masonry-grid, 1.4kB) */
.gallery-masonry {
  columns: 4;
  column-gap: 8px;
}

.gallery-masonry-item {
  break-inside: avoid;
  margin-bottom: 8px;
}
```

### 9.3 Lazy Loading e Performance

```tsx
// Next.js: Lazy loading nativo
<Image
  src={photo.url}
  alt={photo.description}
  loading="lazy"           // Lazy loading nativo
  placeholder="blur"
  blurDataURL={photo.blurDataURL}
/>

// Infinite Scroll com Intersection Observer
function useInfiniteScroll(callback: () => void) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [callback]);
}
```

---

## 10. Roadmap de Funcionalidades

### 10.1 Fase 1 — MVP (Atual)

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Upload de fotos | ✅ Implementado | Upload simples com drag & drop |
| Galeria básica | ✅ Implementado | Grid de fotos com preview |
| Descrição e tags | ✅ Implementado | Campos de metadados |
| API REST | ✅ Implementado | CRUD de fotos |

### 10.2 Fase 2 — Organização

| Funcionalidade | Prioridade | Descrição |
|----------------|-----------|-----------|
| Albums | ⭐⭐⭐ | Criar e gerenciar coleções |
| Busca avançada | ⭐⭐⭐ | Por tags, data, descrição |
| Timeline cronológica | ⭐⭐ | Navegação por mês/ano |
| Favoritos | ⭐⭐ | Marcar fotos preferidas |
| Ordenação | ⭐⭐ | Por data, nome, tamanho |

### 10.3 Fase 3 — Experiência

| Funcionalidade | Prioridade | Descrição |
|----------------|-----------|-----------|
| Lightbox/Modal | ⭐⭐⭐ | Visualização ampliada com navegação |
| Slideshow | ⭐⭐ | Apresentação automática |
| Download | ⭐⭐ | Baixar original ou otimizado |
| Compartilhamento | ⭐⭐ | Link público com expiração |
| Exportar metadados | ⭐ | Baixar EXIF/IPTC |

### 10.4 Fase 4 — IA e Inteligência

| Funcionalidade | Prioridade | Descrição |
|----------------|-----------|-----------|
| Auto-tags | ⭐⭐ | Sugerir tags via IA |
| Auto-descrição | ⭐⭐ | Gerar descrição da cena |
| Face detection | ⭐ | Detectar e agrupar por pessoas |
| Busca semântica | ⭐ | Busca por conceitos, não apenas palavras |
| Duplicatas | ⭐ | Detectar fotos repetidas |

### 10.5 Fase 5 — Escala

| Funcionalidade | Prioridade | Descrição |
|----------------|-----------|-----------|
| Cloud storage | ⭐⭐ | Migrar para S3/R2/Cloudflare |
| CDN de imagens | ⭐⭐ | Entrega otimizada global |
| Multi-usuário | ⭐ | Contas e permissões |
| API pública | ⭐ | Integrações externas |
| Mobile app | ⭐ | PWA ou nativo |

---

## 11. Stack Tecnológico Recomendada

### 11.1 Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15.x | Framework React com App Router |
| React | 19.x | UI Library |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Estilização |
| next/image | — | Otimização de imagens |
| sharp | — | Processamento server-side |

### 11.2 Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js API Routes | — | Server-side API |
| sharp | — | Processamento de imagens |
| exiftool-vendored | — | Leitura de metadados EXIF |
| Node.js | >= 20.12 | Runtime |

### 11.3 Armazenamento

| Opção | Quando Usar |
|-------|------------|
| **Local (atual)** | MVP, desenvolvimento |
| **Cloudflare R2** | Escalável, sem egress fees |
| **AWS S3** | Padrão industrial |
| **Backblaze B2** | Econômico |

### 11.4 Deploy

| Opção | Quando Usar |
|-------|------------|
| **Coolify (atual)** | Self-hosted, controle total |
| **Vercel** | Next.js otimizado |
| **Docker** | Portabilidade |

---

## 12. Referências e Fontes

### 12.1 Artigos Consultados

1. **Eleken** — "File Upload UI Tips for Designers" (2026)
2. **Uploadcare** — "UX Best Practices for Designing a File Uploader" (2024)
3. **PetaPixel** — "The Best Photo Sharing Sites in 2026"
4. **Canto** — "A Complete Guide to Photo Metadata" (2026)
5. **Speakeasy** — "File Uploads Best Practices in REST API Design"
6. **IPTC** — "Photo Metadata Mapping Guidelines"
7. **Cloudinary** — "WebP Format: Technology, Pros & Cons" (2025)
8. **Smashing Magazine** — "Masonry: Things You Won't Need A Library For" (2025)
9. **DebugBear** — "Next.js Image Optimization" (2025)
10. **Proton** — "EXIF Data in Shared Photos May Compromise Your Privacy" (2025)

### 12.2 Ferramentas Referenciadas

- **PhotoPrism** — App de gerenciamento open-source com IA
- **digiKam** — Organizador desktop com facial recognition
- **ExifTool** — Leitor/escritor de metadados
- **sharp** — Processamento de imagens Node.js
- **tus.io** — Protocolo de upload resumível

### 12.3 Padrões de Design

- **Masonry Grid** — Pinterest-style layout
- **Lightbox** — Visualização ampliada
- **Skeleton Loading** — Placeholder animado
- **Infinite Scroll** — Carregamento progressivo
- **Drag & Drop** — Upload interativo

---

## 13. Conclusão e Próximos Passos

### 13.1 Definições Confirmadas

Com base na pesquisa realizada, as seguintes definições são recomendadas para o FotoBook:

1. **Upload**: multipart/form-data com drag & drop, preview, progresso e validação
2. **Organização**: Albums + Tags + Timeline + Localização
3. **Metadados**: Extrair EXIF automaticamente, solicitar IPTC do usuário
4. **Formatos**: Suporte a JPG, PNG, GIF, WEBP (AVIF futuro)
5. **Otimização**: Usar next/image com blurDataURL para placeholders
6. **Segurança**: Strip GPS por padrão, validação de tipo/tamanho, renomear para UUID
7. **IA**: Auto-tags e auto-descrição como melhorias futuras

### 13.2 Ações Imediatas

| Ação | Prioridade | Responsável |
|------|-----------|-------------|
| Implementar upload múltiplo | ⭐⭐⭐ | Desenvolvedor |
| Adicionar albums | ⭐⭐⭐ | Desenvolvedor |
| Melhorar galeria com masonry | ⭐⭐⭐ | Desenvolvedor |
| Implementar busca | ⭐⭐ | Desenvolvedor |
| Adicionar lightbox | ⭐⭐ | Desenvolvedor |
| Integrar com IA (futuro) | ⭐ | Planejamento |

---

*Documento gerado por Codebuff/Buffy em 2026-09-07*
*Pesquisa baseada em análise de 10+ plataformas, 15+ artigos técnicos e padrões de industry*
