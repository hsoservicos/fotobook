# FotoBook — Documentação do Projeto

## Visão Geral

FotoBook é uma aplicação web para registro e upload de fotos pessoais de forma simples e direta. Desenvolvida com Next.js 15 e React 19, oferece uma interface intuitiva para que os usuários possam organizar e acessar suas fotos favoritas.

## Equipe

| Papel | Pessoa | Contato |
|-------|--------|---------|
| **Usuária Principal** | Vânia Rodrigues | — |
| **Desenvolvedor / Gestor** | Humberto Santos | — |

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

## Funcionalidades

1. **Upload de Fotos**: Interface simples e direta para upload de fotos pessoais
2. **Galeria**: Visualização das fotos em layout de grade responsivo
3. **Detalhes da Foto**: Visualização ampliada com informações (data, descrição, tags)
4. **Organização**: Categorias e tags para organizar as fotos
5. **Busca**: Pesquisa por nome, data, categoria ou tags

## Estrutura do Projeto

```
fotobook/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página inicial
│   │   ├── layout.tsx            # Layout raiz
│   │   ├── globals.css           # Estilos globais
│   │   ├── upload/
│   │   │   └── page.tsx          # Página de upload
│   │   ├── galeria/
│   │   │   └── page.tsx          # Página da galeria
│   │   └── api/
│   │       ├── upload/
│   │       │   └── route.ts      # API de upload
│   │       └── photos/
│   │           └── route.ts      # API de listagem
│   ├── components/               # Componentes React
│   ├── lib/                      # Utilitários
│   └── types/                    # Tipos TypeScript
├── public/
│   └── uploads/                  # Diretório de uploads
├── docs/                         # Documentação
├── _bmad/                        # Framework BMAD
├── _bmad-output/                 # Artefatos de saída
├── AGENTS.md                     # Instruções OpenCode
├── CLAUDE.md                     # Instruções Claude Code
└── package.json
```

## Como Rodar

### Pré-requisitos

- Node.js >= 20.12
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar no navegador
# http://localhost:3000
```

### Build para Produção

```bash
# Build
npm run build

# Iniciar em produção
npm start
```

## API

### Upload de Foto

**POST** `/api/upload`

- **Content-Type**: multipart/form-data
- **Campos**:
  - `photo`: Arquivo de imagem (JPG, PNG, GIF, WEBP, max 10MB)
  - `description`: Descrição (opcional)
  - `tags`: Tags separadas por vírgula (opcional)

### Listar Fotos

**GET** `/api/photos`

- **Resposta**: Lista de fotos com metadados

## Deploy com Coolify

O projeto está configurado para deploy com Coolify. Veja `_bmad-output/coolify-deploy-guide.md` para instruções detalhadas.

## Framework BMAD

Este projeto utiliza o BMAD Method v6.11.0 para desenvolvimento ágil com IA. Para mais informações:

- `_bmad-output/getting-started.md` — Primeiros passos
- `_bmad-output/implementation-playbook.md` — Manual de implementação
- `_bmad-output/bmad-project-lifecycle-guide.md` — Ciclo de vida do projeto

## Licença

MIT License
