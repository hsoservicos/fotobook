# CLAUDE.md

Ponto de entrada do Claude Code para este repositório. É o equivalente do Claude Code
do `AGENTS.md` (que o OpenCode lê). **Ambos agentes de codificação são equivalentes aqui**
e compartilham uma única fonte da verdade, as mesmas 57 skills BMAD e as mesmas ferramentas.

@AGENTS.md

---

## Paridade entre Agentes de Codificação

| Aspecto | OpenCode | Claude Code |
|---------|----------|-------------|
| Instruções | `AGENTS.md` | `CLAUDE.md` → importa `AGENTS.md` |
| Skills BMAD | `.agents/skills/` (57) via `.opencode/commands/*.md` | `.claude/skills/` (57), descoberta automática |
| Slash commands | `/bmad-*` (arquivos de comando) | `/bmad-*` (descoberta nativa de skills) |
| Allow-list de ferramentas | herda do shell | `.claude/settings.json` → `permissions.allow` |
| Compressão de tokens RTK | `~/.config/opencode/plugins/rtk.ts` | `.claude/settings.json` → hook `PreToolUse` (`rtk hook claude`) |
| Referência RTK | — | `@.claude/RTK.md` |

As árvores `.agents/skills/` e `.claude/skills/` são mantidas byte-idênticas — uma
alteração em uma deve ser espelhada na outra (o instalador do BMAD faz isso em
`npx bmad-method install`).

## Especificidades do Claude Code

- **Skills**: invoque com `/bmad-help`, `/bmad-build`, `/bmad-code-review`, os
  agentes de tecnologia (`/bmad-agent-docker`, `/bmad-agent-python314`,
  `/bmad-agent-php84`, `/bmad-agent-postgres18`), etc. — ou deixe o modelo escolher.
- **Renderização de Skills** (nunca execute arquivos de workflow diretamente):
  ```bash
  uv run _bmad/scripts/render_skill.py --project-root /media/hsantos/dev/prototipo/fotobook --skill .claude/skills/<skill-name>
  ```
  Em caso de falha (incluindo `uv` ausente), reporte a saída e PARE.
- **Ferramentas**: `uv`, `rtk`, `rg`, `gh`, `crewai`, `npx bmad-method` são
  pré-aprovados em `.claude/settings.json`. Todos ficam em `~/.local/bin`
  (exceto `node`/`npm` via nvm) e devem estar no `PATH`.
- **RTK**: A saída do Bash é comprimida automaticamente pelo hook `PreToolUse`. Veja
  `@.claude/RTK.md`. Para um comando raw: `RTK_DISABLED=1 <cmd>`.
- **Setup por máquina** para ambos agentes de uma vez:
  `rtk init -g --auto-patch --opencode`.

## Atribuição

Finalize mensagens de commit com:

```
Co-Authored-By: Humberto Santos <noreply@hsoservicos.com.br>
```
