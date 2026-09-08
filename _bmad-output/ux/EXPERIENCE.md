---
title: FotoBook — Experience Specification
status: draft
created: 2026-09-07
updated: 2026-09-07
---

# FotoBook — EXPERIENCE.md

## Foundation

**Form Factor:** Web Application (Responsive)
**UI System:** Custom com Tailwind CSS 4.x
**Design Reference:** `DESIGN.md` para tokens visuais
**Primary User:** Vânia Rodrigues (fotógrafa amadora, 45 anos)

---

## Information Architecture

```
FotoBook
├── / (Home)
│   ├── Hero: "Olá, Vânia! 📸"
│   ├── CTA: Enviar Fotos | Ver Galeria
│   ├── Features: Upload, Organize, Find
│   └── How It Works: 3 steps
│
├── /upload (Upload)
│   ├── Drop Zone (drag & drop)
│   ├── Photo Queue (multi-file)
│   │   ├── Thumbnail + Preview
│   │   ├── Description input
│   │   ├── Tags input
│   │   ├── Progress bar
│   │   └── Status (pending/uploading/success/error)
│   └── Upload All button
│
├── /galeria (Gallery)
│   ├── Controls Bar
│   │   ├── Search input
│   │   ├── Sort dropdown
│   │   └── View mode (Grid/Masonry/List)
│   ├── Tags filter
│   ├── Photo Grid
│   │   ├── Photo cards (hover effects)
│   │   └── Infinite scroll
│   └── Lightbox (modal)
│       ├── Full image
│       ├── Navigation arrows
│       ├── Info panel
│       └── Actions (Download, Copy Link)
│
└── /api/* (API Routes)
    ├── POST /api/upload
    ├── GET /api/photos
    ├── GET /api/photos/:id
    ├── PATCH /api/photos/:id
    ├── DELETE /api/photos/:id
    ├── CRUD /api/albums
    └── GET /api/tags
```

---

## Voice and Tone

### Microcopy Guidelines

| Context | Tone | Example |
|---------|------|---------|
| **Success** | Celebratório, simples | "✓ Foto enviada com sucesso!" |
| **Error** | Amigável, construtivo | "Tipo não permitido. Use JPG, PNG ou WEBP." |
| **Loading** | Informativo, calmo | "Carregando suas fotos..." |
| **Empty** | Encorajador, acolhedor | "Sua galeria está vazia. Comece enviando fotos!" |
| **Confirmation** | Direto, claro | "Tem certeza que deseja excluir?" |

### Error Messages

```
Upload Errors:
- "Tipo não permitido. Use JPG, PNG, GIF ou WEBP."
- "Arquivo muito grande (X.XMB). Máximo: 10MB."
- "O arquivo não é uma imagem válida."
- "Erro de conexão. Tente novamente."

Gallery Errors:
- "Erro ao carregar fotos."
- "Nenhuma foto encontrada para sua busca."
```

---

## Component Patterns

### Upload Zone

**States:**
```
┌─────────────────────────────────────────────┐
│ IDLE: Borda tracejada, ícone 📷            │
│ "Arraste fotos aqui ou clique para selecionar" │
│ "JPG, PNG, GIF, WEBP • Até 10MB cada"      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ DRAGGING: Borda azul, fundo azul claro      │
│ "Solte suas fotos aqui!"                    │
│ Scale: 1.02                                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ HOVER: Borda azul, fundo cinza claro        │
│ Transição: 200ms                            │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Click opens file picker
- Drag over highlights zone
- Drop triggers file processing
- Multiple files supported

---

### Photo Queue Item

**Layout:**
```
┌──────────────────────────────────────────────┐
│ ┌──────┐ Nome-do-arquivo.jpg          ✕     │
│ │      │ 2.3 MB                              │
│ │ IMG  │ ┌────────────────────────────────┐  │
│ │      │ │ ████████████░░░░░ 65%          │  │
│ └──────┘ └────────────────────────────────┘  │
│ [Descrição opcional________________]          │
│ [Tags: viagem, praia, família_____]          │
└──────────────────────────────────────────────┘
```

**States:**
- `pending`: Editable, removable
- `uploading`: Progress bar, non-editable
- `success`: Green checkmark, auto-remove after 2s
- `error`: Red X, error message, retry option

---

### Photo Card (Gallery)

**Layout:**
```
┌─────────────────┐
│                 │
│     PHOTO       │ ← 1:1 aspect ratio
│                 │
│                 │
├─────────────────┤
│ Descrição       │ ← On hover: gradient overlay
│ 12 set 2026     │
└─────────────────┘
```

**Hover Effect:**
```
┌─────────────────┐
│ ░░░░░░░░░░░░░░░ │ ← Gradient from bottom
│ ░░░░░░░░░░░░░░░ │
│ ████████████████ │ ← Photo scales 1.05
│ █ Descrição  █ │ ← Text appears
│ █ 12 set     █ │
└─────────────────┘
```

**Click:** Opens lightbox

---

### Lightbox

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ ✕ (close)                          ‹  (prev)  › (next) │
│                                                     │
│                                                     │
│                    FULL IMAGE                       │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Info Panel (desktop: right side, mobile: bottom)    │
│                                                     │
│ Título da Foto                                      │
│                                                     │
│ Arquivo: foto-123.jpg                               │
│ Data: 12 set 2026, 14:30                            │
│ Tamanho: 2.3 MB                                     │
│ Dimensões: 4032 × 3024                              │
│                                                     │
│ Tags:                                               │
│ [#viagem] [#praia] [#família]                       │
│                                                     │
│ [📥 Download] [🔗 Copiar Link]                      │
└─────────────────────────────────────────────────────┘
```

**Keyboard Navigation:**
- `←` / `→`: Previous / Next photo
- `Escape`: Close lightbox
- `Tab`: Focus on actions

---

### Gallery Controls

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ 🔍 Buscar fotos...    [Mais recentes ▼]  [⊞ ⊟ ☰]  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ [Todas] [#viagem] [#praia] [#família] [#natureza]  │
└─────────────────────────────────────────────────────┘
```

**Behavior:**
- Search: Real-time filtering (debounced 300ms)
- Sort: Changes photo order
- View mode: Toggles grid/masonry/list
- Tags: Click to filter, click again to clear

---

## State Patterns

### Upload States

```
IDLE → DRAGGING → PROCESSING → UPLOADING → SUCCESS
  │                                   │        │
  │                                   │        └→ (auto-remove after 2s)
  │                                   └→ ERROR (retry option)
  └→ (drop files to start)
```

### Gallery States

```
LOADING → EMPTY → LOADED → FILTERED
   │         │        │         │
   │         │        │         └→ (search/filter applied)
   │         │        └→ (photos displayed)
   │         └→ (no photos yet)
   └→ (skeleton loading)
```

---

## Interaction Primitives

### Drag & Drop
```
onDragEnter → highlight drop zone
onDragOver → maintain highlight
onDragLeave → remove highlight
onDrop → process files
```

### Infinite Scroll
```
IntersectionObserver on sentinel element
→ when visible: load next page
→ append to existing list
→ update visible count
```

### Lightbox Navigation
```
onClickPhoto → open lightbox with index
onArrowLeft → decrement index (if > 0)
onArrowRight → increment index (if < length)
onEscape → close lightbox
onClickOutside → close lightbox
```

---

## Accessibility Floor

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators (2px blue ring)
- Tab order follows visual order
- Skip links for main content

### Screen Readers
- Alt text for all images
- ARIA labels for icons
- Status announcements for upload progress
- Modal focus trap in lightbox

### Visual
- Minimum contrast ratio: 4.5:1 (text)
- Minimum contrast ratio: 3:1 (UI components)
- Don't rely on color alone for status
- Support `prefers-reduced-motion`

---

## Key Flows

### Flow 1: Primeiro Upload (Vânia)

**Protagonista:** Vânia, 45 anos
**Cenário:** Voltou de viagem, quer organizar fotos
**Climax:** Vê as 5 fotos na galeria pela primeira vez

```
1. Vânia acessa fotobook.local
2. Vê hero: "Olá, Vânia! 📸"
3. Clica "Enviar Fotos"
4. Arrasta 5 fotos para drop zone
5. Vê previews com campos de descrição
6. Adiciona descrição na primeira foto
7. Adiciona tags "viagem, praia"
8. Clica "Enviar 5 Fotos"
9. Vê progresso individual
10. Vê confirmação "5 fotos enviadas!"
11. Clica "Ver Galeria"
12. ★ CLIMAX: Vê suas fotos na galeria
```

### Flow 2: Busca Rápida (Vânia)

**Protagonista:** Vânia
**Cenário:** Quer encontrar foto de aniversário
**Climax:** Encontra e baixa a foto desejada

```
1. Vânia acessa /galeria
2. Digita "aniversário" na busca
3. Vê fotos filtr filtr filtrored
44454
44
44
44tag
────────45══winter√44. Clica na foto desejada
5. ★ CLIMAX: Lightbox abre com foto ampliada
6. Vê data e tags no painel
7. Clica "Download"
8. Fecha lightbox
```

---

## Responsive Breakpoints

```yaml
breakpoints:
  sm: "640px"    # Mobile large
  md: "768px"    # Tablet
  lg: "1024px"   # Desktop
  xl: "1280px"   # Desktop large
```

### Mobile (< 768px)
- Single column layout
- Bottom navigation (if needed)
- Full-width drop zone
- Lightbox: image + scrollable info below

### Tablet (768px - 1024px)
- 2-3 column grid
- Sidebar navigation (if needed)
- Split lightbox (image + side panel)

### Desktop (> 1024px)
- 4 column grid
- Full lightbox with side panel
- Hover effects enabled

---

*Experience Specification v1.0*
*FotoBook — BMAD Method*
