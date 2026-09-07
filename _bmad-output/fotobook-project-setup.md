# FotoBook — Resumo da Auditoria e Configuração

**Data**: 2026-09-07
**Autor**: Humberto Santos (via Codebuff/Buffy)

---

## 1. Auditoria do Repositório de Referência

### Repositório Analisado
- **URL**: https://github.com/hsoservicos/aprendizado_em_ia
- **Framework**: BMAD Method v6.11.0
- **Descrição**: Framework de desenvolvimento ágil com IA (57 skills, ciclo de vida de 5 fases)

### Ferramentas e Configurações Identificadas

| Ferramenta | Versão | Função |
|------------|--------|--------|
| BMAD Method | 6.11.0 | Framework de desenvolvimento ágil com IA |
| OpenCode | 1.18.27 | Agente de codificação |
| Claude Code | 2.1.260 | Agente de codificação |
| CrewAI | 1.15.18 | Orquestração multi-agente |
| RTK | 0.47.0 | Compressão de tokens |
| Node.js | 24.20.0 | Runtime JavaScript |
| Python | 3.12.3 | Scripts BMAD |
| uv | 0.12.9 | Gerenciador de pacotes Python |
| ripgrep | 14.1.1 | Busca rápida |
| GitHub CLI | 2.73.0 | Operações Git |

### Skills BMAD Identificadas (57 total)

**Core Skills (24)**: bmad-help, bmad-build, bmad-build-auto, bmad-brainstorming, bmad-forge-idea, bmad-create-prd, bmad-architecture, bmad-ux, bmad-create-epics-and-stories, bmad-sprint-planning, bmad-code-review, bmad-retrospective, bmad-docker, bmad-python314, bmad-php84, bmad-postgres18, etc.

**Agentes de Tecnologia (4)**: Docker, Python 3.14, PHP 8.4, PostgreSQL 18

### Ciclo de Vida do Projeto (5 Fases)

1. **Clarify** — Validação de ideia
2. **Plan** — PRD + Arquitetura + UX + Stories
3. **Build** — Implementação de código
4. **Review** — Code review + testes
5. **Learn** — Retrospectiva + deploy

---

## 2. Configuração do Projeto FotoBook

### Informações do Projeto

| Campo | Valor |
|-------|-------|
| **Nome** | FotoBook |
| **Descrição** | Aplicação Web para Registro de Fotos Pessoais |
| **Usuária Principal** | Vânia Rodrigues |
| **Desenvolvedor / Gestor** | Humberto Santos |
| **Diretório** | /media/hsantos/dev/prototipo/fotobook |

### Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js | 15.x (App Router) |
| UI Library | React | 19.x |
| CSS Framework | Tailwind CSS | 4.x |
| Linguagem | TypeScript | 5.x |
| Runtime | Node.js | >= 20.12 |
| Armazenamento | Local (uploads/) | — |
| Deploy | Coolify | 4.3.14 |

### Arquivos de Configuração Criados

| Arquivo | Descrição |
|---------|-----------|
| `AGENTS.md` | Instruções para OpenCode |
| `CLAUDE.md` | Instruções para Claude Code (importa AGENTS.md) |
| `.claude/settings.json` | Allow-list de ferramentas + hook RTK |
| `_bmad/custom/config.toml` | Configuração da equipe (commitada) |
| `_bmad/config.user.toml` | Configuração pessoal (gitignored) |
| `package.json` | Dependências do projeto |
| `tsconfig.json` | Configuração TypeScript |
| `next.config.ts` | Configuração Next.js |
| `postcss.config.mjs` | Configuração PostCSS + Tailwind |
| `.gitignore` | Regras de ignore |

### Estrutura da Aplicação

```
src/
├── app/
│   ├── page.tsx              # Página inicial
│   ├── layout.tsx            # Layout raiz
│   ├── globals.css           # Estilos globais
│   ├── upload/
│   │   └── page.tsx          # Página de upload
│   ├── galeria/
│   │   └── page.tsx          # Página da galeria
│   └── api/
│       ├── upload/
│       │   └── route.ts      # API de upload
│       └── photos/
│           └── route.ts      # API de listagem
├── components/               # Componentes React
├── lib/                      # Utilitários
└── types/                    # Tipos TypeScript
```

---

## 3. Próximos Passos

### Instalação do BMAD Method

```bash
cd /media/hsantos/dev/prototipo/fotobook
npx bmad-method install
```

### Instalação das Dependências

```bash
npm install
```

### Iniciar Desenvolvimento

```bash
# Opção 1: Usar OpenCode
opencode
/bmad-help

# Opção 2: Usar Claude Code
claude
/bmad-help
```

### Ciclo de Vida Recomendado

Para o FotoBook, o ciclo de vida recomendado é:

1. **Clarify** (30 min)
   - `/bmad-help` — Orientação inicial
   - `/bmad-brainstorming` — Explorar funcionalidades
   - `/bmad-forge-idea` — Validar a ideia

2. **Plan** (1-2h)
   - `/bmad-create-prd` — Documento de requisitos
   - `/bmad-architecture` — Arquitetura do sistema
   - `/bmad-ux` — Design UX
   - `/bmad-create-epics-and-stories` — Dividir em stories

3. **Build** (Variável)
   - `/bmad-sprint-planning` — Planejar sprint
   - `/bmad-build` — Implementar story por story

4. **Review** (30 min)
   - `/bmad-code-review` — Revisão adversarial
   - `/bmad-qa-generate-e2e-tests` — Testes E2E

5. **Learn** (30 min)
   - `/bmad-retrospective` — Retrospectiva
   - Deploy via Coolify

---

## 4. Funcionalidades Implementadas

### Página Inicial (`/`)
- Mensagem de boas-vindas para Vânia
- Botões de ação rápida (Upload e Galeria)
- Seção "Como funciona" com 3 passos

### Página de Upload (`/upload`)
- Zona de upload com drag & drop
- Preview da imagem selecionada
- Campos de descrição e tags
- Validação de tipo e tamanho
- Mensagens de status (sucesso/erro)

### Página da Galeria (`/galeria`)
- Grid responsivo de fotos
- Modal de visualização ampliada
- Informações detalhadas (data, tamanho, tags)
- Estado de loading e erro

### API de Upload (`/api/upload`)
- Recebe multipart/form-data
- Valida tipo (JPG, PNG, GIF, WEBP) e tamanho (max 10MB)
- Salva arquivo em `public/uploads/`
- Cria metadados em JSON
- Retorna dados da foto criada

### API de Listagem (`/api/photos`)
- Lista todas as fotos com metadados
- Ordena por data (mais recente primeiro)
- Verifica existência do arquivo

---

## 5. Configuração dos Agentes de IA

### OpenCode
- **Instruções**: `AGENTS.md`
- **Skills**: `.agents/skills/` (57 skills)
- **Comandos**: `.opencode/commands/*.md`
- **RTK**: `~/.config/opencode/plugins/rtk.ts`

### Claude Code
- **Instruções**: `CLAUDE.md` → `@AGENTS.md`
- **Skills**: `.claude/skills/` (57 skills, descoberta nativa)
- **Settings**: `.claude/settings.json`
- **RTK**: Hook `PreToolUse` (`rtk hook claude`)
- **Referência RTK**: `.claude/RTK.md`

### Comando de Invocação de Skills

```bash
# Claude Code
uv run _bmad/scripts/render_skill.py \
  --project-root /media/hsantos/dev/prototipo/fotobook \
  --skill .claude/skills/<skill-name>

# OpenCode
uv run _bmad/scripts/render_skill.py \
  --project-root /media/hsantos/dev/prototipo/fotobook \
  --skill .agents/skills/<skill-name>
```

---

## 6. Deploy com Coolify

### Pré-requisitos
- Coolify v4.3.14 instalado
- GitHub CLI configurado
- Repositório pushado

### Comandos de Deploy

```bash
# Instalar Coolify CLI
curl -fsSL https://raw.githubusercontent.com/coollabsio/coolify-cli/main/scripts/install.sh | bash

# Configurar contexto
coolify context add -d production https://coolify.seudominio.com <TOKEN>

# Deploy
./_bmad-output/scripts/coolify-deploy.sh \
  --name fotobook \
  --repo https://github.com/hsoservicos/fotobook \
  --port 3000
```

### Guias de Deploy
- `_bmad-output/coolify-deploy-guide.md` — Visão geral
- `_bmad-output/coolify-github-deploy-guide.md` — Via GitHub
- `_bmad-output/coolify-local-deploy-guide.md` — Local

---

## 7. Checklist de Onboarding

```
Pré-flight (uma vez)
[ ] Passo 0  Pré-requisitos instalados (node, python, uv, git, gh, rg, rtk)
[ ] Passo 1  Repositório clonado + branch criada
[ ] Passo 2  npx bmad-method install executado
[ ] Passo 3  diff .agents/skills .claude/skills == idêntico
[ ] Passo 3  rtk init --show → OpenCode plugin + Claude hook OK
[ ] Passo 4  _bmad/custom/config.toml e config.user.toml ajustados
[ ] Passo 4  Chaves de API do agente configuradas
[ ] Passo 5  Agente aberto e /bmad-help executado

Trilha A — FotoBook (novo projeto)
[ ] Fase 1 Clarify concluída (ideia validada)
[ ] Fase 2 Plan concluída (PRD + Arquitetura + UX + Stories)
[ ] Fase 3 Build — stories implementadas uma a uma
[ ] Fase 4 Review — code review + testes E2E
[ ] Fase 5 Learn — retrospectiva + deploy
```

---

## Conclusão

O projeto FotoBook está completamente configurado e pronto para iniciar o desenvolvimento utilizando o framework BMAD Method. A estrutura inclui:

✅ **Framework BMAD** copiado e configurado
✅ **Agentes de IA** (OpenCode e Claude Code) configurados
✅ **Aplicação Next.js** com funcionalidades básicas de upload e galeria
✅ **APIs** de upload e listagem de fotos
✅ **Documentação** completa
✅ **Configuração de deploy** via Coolify

**Próximo passo**: Executar `npx bmad-method install` e iniciar o ciclo de vida com `/bmad-help`.

---

*Documento gerado por Codebuff/Buffy em 2026-09-07*
