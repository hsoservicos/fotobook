---
title: 'HTML Mockup para Visualização da Proposta'
type: 'feature'
created: '2026-09-08'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: '4d650e56a9f9ad68046080ee1137cd97efc240bd'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A equipe e a cliente Vânia Rodrigues precisam visualizar a proposta atual do projeto FotoBook antes do desenvolvimento, mas não há um mockup interativo disponível para avaliação.

**Approach:** Criar um arquivo HTML estático single-page que represente a proposta visual do projeto, com seções empilhadas (Header → Upload → Galeria → Lightbox) em scroll vertical, e publicá-lo em servidor local acessível pela rede.

**Decisions:**
- Porta: 8080
- Servidor: Python HTTP Server (python3 -m http.server 8080)

</frozen-after-approval>

## Tasks & Acceptance

**Execution:**
- [x] `mockup.html` -- Criar arquivo HTML single-page com layout da proposta do FotoBook -- Seções: Header, Upload, Galeria, Lightbox (scroll vertical)
- [x] `start-server.sh` -- Criar script para iniciar servidor HTTP -- Facilitar publicação e acesso via rede
- [x] Verificar endereço IP local -- Comunicar endereço e porta para acesso
- [x] Testar responsividade em 3 viewports -- Garantir funcionamento mobile/tablet/desktop

**Acceptance Criteria:**
- Given o mockup HTML é criado, when acessado no navegador, then exibe layout responsivo com as principais telas do projeto
- Given o servidor HTTP está rodando, when acessado via IP local, then a página carrega corretamente
- Given o endereço IP e porta são informados, when a equipe acessa, then consegue visualizar o mockup completo
- Given o mockup é acessado em mobile (< 768px), when visualizado, then exibe layout adaptado em 1 coluna
- Given o mockup é acessado em tablet (768-1024px), when visualizado, then exibe layout adaptado em 2 colunas
- Given o mockup é acessado em desktop (> 1024px), when visualizado, then exibe layout adaptado em 3-4 colunas

## Design Notes

**Paleta de Cores (extraída do PRD/Architecture):**
- Primary: `#2563eb` (azul - botões, links)
- Success: `#16a34a` (verde - feedback positivo)
- Error: `#dc2626` (vermelho - erros)
- Warning: `#f59e0b` (amarelo - avisos)
- Muted: `#737373` (cinza - texto secundário)
- Border: `#e5e7eb` (cinza claro - bordas)
- Background: `#ffffff` (branco - fundo)
- Surface: `#f9fafb` (cinza muy claro - cards)

**Tipografia:**
- Fonte principal: Inter ou system-ui
- Títulos: 600-700 weight
- Corpo: 400 weight

**Navegação entre Telas:**
- Scroll vertical simples (single-page)
- Seções empilhadas: Header → Galeria → Upload (inverter ordem — mostrar valor primeiro)
- Nomes de seções como headings claros
- Sem tabs — mais intuitivo para audiência não-técnica

**Dados de Exemplo (4 fotos fictícias — incluindo edge cases):**
1. "Pôr do sol na praia" — tags: `viagem, praia, natureza` — data: 2026-08-15 — descrição: "Foto tirada durante a viagem a Porto de Galinhas"
2. "Festa de aniversário" — tags: `família, festa, aniversário` — data: 2026-07-20 — descrição: "Comemoração dos 50 anos da mamãe"
3. "Retrato do gato" — tags: `pet, gato, casa` — data: 2026-06-10 — descrição: "Mia dormindo no sofá"
4. "Sem metadados" — tags: (nenhuma) — data: — descrição: (vazia)

**Breakpoints de Responsividade:**
- Mobile: < 768px (1 coluna)
- Tablet: 768px - 1024px (2 colunas)
- Desktop: > 1024px (3-4 colunas)

**Instruções de Uso (topo do mockup):**
- Banner explicativo: "Este é um mockup visual do FotoBook. Role para baixo para ver as diferentes telas."
- Ícones de seta indicando scroll ↓

**Estados a Representar (seções empilhadas):**
- **Header:** Logo, nome "FotoBook", tagline, banner explicativo
- **Galeria:** Grid com 4 fotos de exemplo usando placeholders coloridos (substituir imagens reais)
- **Upload:** Zona de drag & drop com botão alternativo
- ~~**Lightbox:** Removido — simplificação para mockup~~

**Limites de Layout:**
- Largura máxima do conteúdo: 1200px (centrado)
- Tamanho mínimo de botão: 44x44px (acessibilidade mobile)
- Truncamento de texto: `text-overflow: ellipsis` para nomes longos
- Tags: quebra de linha automática, sem overflow

**Edge Cases de Dados:**
- Foto sem tags: exibir "Sem tags" em itálico
- Foto sem descrição: exibir "Sem descrição" em itálico
- Tags longas: quebrar linha sem quebrar layout

**Melhorias SCAMPER Aplicadas:**
- **Substitute:** Placeholders coloridos em vez de imagens reais (mais rápido, mais claro)
- **Eliminate:** Seção Lightbox removida (simplificação)
- **Reverse:** Ordem invertida — Galeria primeiro (mostrar valor), Upload depois (mostrar processo)
- **Visual:** Animação sutil de fade-in nas seções ao scrollar (polimento)