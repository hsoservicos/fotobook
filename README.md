# 📷 FotoBook

**Aplicação Web para Registro de Fotos Pessoais**

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![React](https://img.shields.io/badge/React-19.x-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4)

---

## Sobre

FotoBook é uma aplicação web desenvolvida para a **Vânia Rodrigues** por **Humberto Santos**, projetada para ser uma forma simples e direta de registrar e organizar fotos pessoais.

### Funcionalidades Principais

- 📤 **Upload Simples**: Arraste e solte ou selecione fotos para enviar
- 🖼️ **Galeria Responsiva**: Visualize suas fotos em layout de grade adaptativo
- 📝 **Organização**: Adicione descrições e tags para organizar suas fotos
- 🔍 **Busca**: Encontre fotos rapidamente por data, descrição ou tags
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop e mobile

---

## Equipe

| Papel | Pessoa |
|-------|--------|
| **Usuária Principal** | Vânia Rodrigues |
| **Desenvolvedor / Gestor** | Humberto Santos |

---

## Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js | 15.x (App Router) |
| UI Library | React | 19.x |
| CSS Framework | Tailwind CSS | 4.x |
| Linguagem | TypeScript | 5.x |
| Runtime | Node.js | >= 20.12 |
| Armazenamento | Local (uploads/) | — |
| Deploy | Coolify | 4.3.14 |

---

## Início Rápido

### Pré-requisitos

- Node.js >= 20.12
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/hsoservicos/fotobook.git
cd fotobook

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar no navegador
# http://localhost:3000
```

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm start` | Iniciar em produção |
| `npm run lint` | Verificar código com ESLint |
| `npm run type-check` | Verificar tipos TypeScript |

---

## Estrutura do Projeto

```
fotobook/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── page.tsx           # Página inicial
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── globals.css        # Estilos globais
│   │   ├── upload/            # Página de upload
│   │   ├── galeria/           # Página da galeria
│   │   └── api/               # Rotas de API
│   │       ├── upload/        # API de upload
│   │       └── photos/        # API de listagem
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilitários
│   └── types/                 # Tipos TypeScript
├── public/
│   └── uploads/               # Diretório de uploads
├── docs/                      # Documentação
├── _bmad/                     # Framework BMAD Method
├── _bmad-output/              # Artefatos de saída
├── AGENTS.md                  # Instruções OpenCode
├── CLAUDE.md                  # Instruções Claude Code
└── package.json
```

---

## API

### Upload de Foto

**POST** `/api/upload`

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "photo=@minha-foto.jpg" \
  -F "description=Férias na praia" \
  -F "tags=férias,praia,família"
```

### Listar Fotos

**GET** `/api/photos`

```bash
curl http://localhost:3000/api/photos
```

---

## Deploy

### Coolify

O projeto está configurado para deploy com Coolify. Veja os guias:

- `_bmad-output/coolify-deploy-guide.md` — Visão geral
- `_bmad-output/coolify-github-deploy-guide.md` — Deploy via GitHub
- `_bmad-output/coolify-local-deploy-guide.md` — Deploy local

### Docker

```bash
# Build da imagem
docker build -t fotobook .

# Executar
docker run -p 3000:3000 fotobook
```

---

## Desenvolvimento com BMAD Method

Este projeto utiliza o **BMAD Method v6.11.0** para desenvolvimento ágil com IA.

### Pré-requisitos para Desenvolvimento

- Node.js >= 20.12
- Python >= 3.10, < 3.14
- uv (0.12.9)
- Git
- GitHub CLI (gh)
- ripgrep (rg)
- RTK (0.47.0)
- OpenCode (>= 1.18) e/ou Claude Code (>= 2.1)

### Instalação Automatizada

```bash
# Linux
chmod +x _bmad-output/scripts/install-linux.sh
./_bmad-output/scripts/install-linux.sh

# Windows
powershell -ExecutionPolicy Bypass -File _bmad-output/scripts/install-windows.ps1
```

### Iniciar Desenvolvimento

```bash
# Iniciar agente
opencode  # ou: claude

# No agente
/bmad-help
```

### Ciclo de Vida do Projeto

1. **Clarify** — `/bmad-help`, `/bmad-brainstorming`, `/bmad-forge-idea`
2. **Plan** — `/bmad-create-prd`, `/bmad-architecture`, `/bmad-ux`, `/bmad-create-epics-and-stories`
3. **Build** — `/bmad-build`, `/bmad-build-auto`
4. **Review** — `/bmad-code-review`, `/bmad-checkpoint-preview`
5. **Learn** — `/bmad-retrospective`

📖 **Guias detalhados**: `_bmad-output/getting-started.md`

---

## Licença

MIT License © 2026

---

## Contato

- **Desenvolvedor**: Humberto Santos
- **Repositório**: https://github.com/hsoservicos/fotobook

---

*Feito com ❤️ para Vânia Rodrigues*
