# Brief: Gestão e Persistência de Fotos no FotoBook

## Contexto do Projeto

FotoBook é uma aplicação web pessoal para registro e organização de fotos pessoais. Stack: Next.js 15, React 19, Tailwind CSS 4, TypeScript 5, Node.js >= 20.12. Deploy via Coolify 4.3.14.

## Decisão

**Banco de Dados vs. Pastas Distribuídas** para gestão e persistência de fotos.

## Cenário

1. **Fotos com álbum definido** — Organização por coleções temáticas
2. **Fotos sem álbum** — Fotos gerais sem organização específica
3. **Metadados** — Descrição, tags, data, EXIF
4. **Busca** — Por texto, tags, data, álbum
5. **Performance** — Upload < 5s, galeria < 3s, busca < 500ms
6. **Escala** — Suporte a 1000+ fotos sem degradação

## Opções

### Opção A: Banco de Dados (PostgreSQL/SQLite)
- Metadados em tabelas estruturadas
- Arquivos em sistema de arquivos
- Busca via SQL (LIKE,全文索引)

### Opção B: Pastas Distribuídas (JSON + Filesystem)
- Metadados em arquivos JSON
- Organização por pastas (albums/, general/)
- Busca via leitura de JSON

### Opção C: Híbrido (Banco + Filesystem)
- Metadados em banco de dados
- Arquivos em sistema de arquivos
- Índices para busca

## Dimensões de Avaliação

1. **Maturidade** — Abordagens dominantes, o que está consolidando
2. **Integração** — Protocolos, formatos, padrões de auth
3. **Padrões de Arquitetura** — Padrões dominantes por escala
4. **Realidade de Implementação** — Curva de aprendizado, tooling
5. **Saúde do Ecossistema** — Vitalidade, risco a 5 anos

## Perguntas de Pesquisa

1. Qual abordagem é mais adequada para um projeto pessoal de média escala?
2. Quais são as trade-offs de performance entre as opções?
3. Como lidar com busca avançada (texto, tags, data)?
4. Qual a melhor estratégia para migração futura?
5. Quais são as armadilhas comuns em cada abordagem?