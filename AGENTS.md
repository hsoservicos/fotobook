# AGENTS.md

FotoBook — Aplicação Web para Registro de Fotos Pessoais.
Este arquivo é lido pelo **OpenCode**; o **Claude Code** lê `CLAUDE.md`, que importa este arquivo.
Os dois agentes de codificação são equivalentes e compartilham uma configuração, conjunto de skills e ferramentas.

## Informações do Projeto

- **Nome**: FotoBook
- **Descrição**: Aplicação web para registro e upload de fotos pessoais de forma simples e direta
- **Usuária Principal**: Vânia Rodrigues
- **Desenvolvedor / Gestor do Projeto**: Humberto Santos
- **Idioma de Comunicação**: Português do Brasil (PT-BR)
- **Idioma dos Documentos**: Português do Brasil (PT-BR)
- **Artefatos de Saída**: `_bmad-output/`
- **Conhecimento do Projeto**: `docs/`
- **Arquivos de Configuração**: `_bmad/config.toml`, `_bmad/config.user.toml` (não editar; re-executar `npx bmad-method install` para alterar)
- **Instruções dos Agentes**: `AGENTS.md` (OpenCode) + `CLAUDE.md` (Claude Code — importa `AGENTS.md`)
- **Configurações do Claude Code**: `.claude/settings.json` (allow-list de ferramentas + hook RTK `PreToolUse`)
- **Registry de Ferramentas**: `_bmad-output/tools-registry.md` (atualizar ao instalar novas ferramentas)

## Agentes de Codificação

| Aspecto | OpenCode | Claude Code |
|---------|----------|-------------|
| Instruções | `AGENTS.md` | `CLAUDE.md` → `@AGENTS.md` |
| Fonte de Skills | `.agents/skills/` (57) | `.claude/skills/` (57) |
| Invocação de Skills | `.opencode/commands/*.md` wrappers (`/bmad-*`) | descoberta nativa (`/bmad-*`, ou seleção do modelo) |
| Allow-list de Ferramentas | herda do shell | `.claude/settings.json` → `permissions.allow` |
| Compressão de Tokens RTK | `~/.config/opencode/plugins/rtk.ts` | `.claude/settings.json` → hook `PreToolUse` (`rtk hook claude`), ref `.claude/RTK.md` |

`.agents/skills/` e `.claude/skills/` são mantidos byte-idênticos — `npx bmad-method install`
regenera ambos; uma alteração manual em um deve ser espelhada no outro.

## Stack Tecnológico do Projeto

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | Next.js | 15.x (App Router) |
| UI | React | 19.x |
| Estilo | Tailwind CSS | 4.x |
| Linguagem | TypeScript | 5.x |
| Runtime | Node.js | >= 20.12 |
| Armazenamento | Local (uploads/) | — |
| Deploy | Coolify | 4.3.14 |

## Funcionalidades Principais

1. **Upload de Fotos**: Interface simples e direta para upload de fotos pessoais
2. **Galeria**: Visualização das fotos em layout de grade responsivo
3. **Detalhes da Foto**: Visualização ampliada com informações (data, descrição, tags)
4. **Organização**: Categorias e tags para organizar as fotos
5. **Busca**: Pesquisa por nome, data, categoria ou tags

## Onboarding — Primeiros Passos

Qualquer pessoa usando este repositório para **iniciar um novo projeto** deve
executar o pré-flight em **`_bmad-output/getting-started.md`** primeiro (ambiente + ambos agentes + verificação RTK
+ configuração do projeto), depois seguir a Trilha A:

- **Trilha A — Novo Projeto (Greenfield)**: `/bmad-help` → ciclo de vida de 5 fases
  (`_bmad-output/bmad-project-lifecycle-guide.md`).

## BMAD Skills

57 skills, instaladas uma vez e expostas aos dois agentes via as duas árvores de skills.
Os pontos de entrada são idênticos em ambos agentes (`/bmad-help`, `/bmad-build`, …).

### Entry Points

| Comando | Propósito |
|---------|-----------|
| `bmad-help` | Comece aqui — orientar ao workflow, recomendar próximo passo |
| `bmad-build` | Implementação principal de código: correção, feature, refatoração |
| `bmad-build-auto` | Loop de build autônomo e desatendido |
| `bmad-brainstorming` | Ideação e exploração criativa |
| `bmad-forge-idea` | Pressionar/testar uma ideia através de interrogatório de persona |
| `bmad-create-prd` | Documento de requisitos do produto |
| `bmad-architecture` | Design da arquitetura do sistema |
| `bmad-ux` | Padrões UX e especificações de design |
| `bmad-create-epics-and-stories` | Dividir trabalho em stories rastreáveis |
| `bmad-sprint-planning` | Prontidão e status do sprint |
| `bmad-code-review` | Code review adversarial |
| `bmad-retrospective` | Retrospectiva de épico com veredicto baseado em evidências |
| `bmad-docker` | Containerização Docker: Dockerfile, Compose, BuildKit, segurança |
| `bmad-agent-docker` | Agente Arquiteto Docker — especialista em infraestrutura de containers |
| `bmad-python314` | Python 3.14+: free-threading, subinterpreters, t-strings, compression |
| `bmad-agent-python314` | Agente Arquiteto Python — especialista em Python moderno |
| `bmad-php84` | PHP 8.4: Property Hooks, Asymmetric Visibility, DOM API, array functions |
| `bmad-agent-php84` | Agente Arquiteto PHP — multi-role (Arch-PHP, CodeRefactor-PHP, WebSec-PHP) |
| `bmad-postgres18` | PostgreSQL 18: AIO, Skip Scan, UUIDv7, pgvector, RETURNING OLD/NEW |
| `bmad-agent-postgres18` | Agente Arquiteto PostgreSQL — 5 SKILLs (DDL, OPT, VEC, CONC, SEC) |

### Regra de Invocação de Skills

As skills devem ser renderizadas via script compartilhado — **não** invoque arquivos de workflow diretamente:

```bash
# Claude Code
uv run _bmad/scripts/render_skill.py --project-root /media/hsantos/dev/prototipo/fotobook --skill .claude/skills/<skill-name>
# OpenCode
uv run _bmad/scripts/render_skill.py --project-root /media/hsantos/dev/prototipo/fotobook --skill .agents/skills/<skill-name>
```

Em caso de falha (incluindo `uv` ausente), reporte a saída e PARE. Não execute nenhuma fonte de workflow diretamente.

### Fases do Workflow BMAD

1. **Clarify** — `bmad-help`, `bmad-brainstorming`, `bmad-forge-idea`
2. **Plan** — `bmad-create-prd`, `bmad-architecture`, `bmad-ux`, `bmad-create-epics-and-stories`
3. **Build** — `bmad-build`, `bmad-build-auto`
4. **Review** — `bmad-code-review`, `bmad-checkpoint-preview`
5. **Learn** — `bmad-retrospective`

Mudanças pequenas podem ir direto para build. Trabalho complexo segue o caminho completo.

## Pré-requisitos

- **Node.js** >= 20.12
- **Python** >= 3.10, < 3.14
- **uv** (0.12.9) — necessário para renderizar skills; instalar em `~/.local/bin/uv`
- **Git** — necessário para atualizações e módulos externos
- **GitHub CLI** (`gh`, 2.73.0) — operações de repo / PR / release; `~/.local/bin/gh`
- **ripgrep** (14.1.1) — busca rápida, dependência do RTK; `~/.local/bin/rg`
- **CrewAI** (1.15.18) — orquestração multi-agente; `~/.local/bin/crewai`
- **RTK** (0.47.0) — proxy de compressão de tokens; `~/.local/bin/rtk`. Conectado aos
  **ambos** agentes — OpenCode via `~/.config/opencode/plugins/rtk.ts`, Claude Code
  via hook `PreToolUse` em `.claude/settings.json`. Setup por máquina para
  ambos de uma vez: `rtk init -g --auto-patch --opencode`.
- **Agente de codificação**: OpenCode (>= 1.18) e/ou Claude Code (>= 2.1)

Todas as ferramentas acima estão disponíveis em **ambos** agentes OpenCode e Claude Code.

## Atualizando BMAD

```bash
npx bmad-method install
```

Detecta instalação existente e oferece update/modificação.

## Instalação Automatizada

Para novos ambientes, use os scripts de instalação:

```bash
# Linux (Ubuntu/Debian)
chmod +x _bmad-output/scripts/install-linux.sh
./_bmad-output/scripts/install-linux.sh

# Windows (PowerShell como Administrador)
powershell -ExecutionPolicy Bypass -File _bmad-output/scripts/install-windows.ps1
```

Ambos os scripts instalam a toolchain completa, ambos agentes e conectam o RTK ao OpenCode
e Claude Code (`rtk init -g --auto-patch --opencode`). Veja
`_bmad-output/scripts/README.md` para instruções detalhadas.

## Estado do Projeto

Este é um **projeto novo (greenfield)** — nenhuma aplicação existe ainda. Novo aqui? Execute
o pré-flight em `_bmad-output/getting-started.md`, depois `/bmad-help` para começar.
