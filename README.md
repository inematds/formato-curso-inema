# formato-curso-v2 — curso INEMA.CLUB com camada de aprendizagem

Evolução da skill `formato-curso` (páginas HTML de curso INEMA.CLUB) com uma **camada de aprendizagem** e **temas trocáveis**, mantendo a regra de ouro: **self-contained** (Tailwind via CDN + JS inline), sem build, sem backend, estado em `localStorage`.

## 🔗 Demo ao vivo

➡️ **https://inematds.github.io/formato-curso-v2/** (redireciona para o curso-demo)

## O que tem de novo

- **Progresso** marcável por tópico, agregando tópico → módulo → trilha → curso (via manifesto do curso).
- **Marcar dúvida** e **anotações / highlight** no próprio texto.
- Painel **"minha jornada"** consolidando progresso, dúvidas e notas.
- **Export / Import** das anotações em `.json` (backup/portabilidade; base do sync v2).
- **5 temas trocáveis** que transformam a página inteira: INEMA Dark (padrão), Claro, Sépia, Foco, Alto-contraste — + preferências de leitura (largura de linha, entrelinha, fonte, acento).
- Acessibilidade: skip link, foco preso na jornada, `prefers-reduced-motion`, ARIA.

## Estrutura

```
formato-curso-v2/      # a skill (SKILL.md + references/ + assets/learn.js,learn.css)
demo/                  # curso-demo (1 trilha, 2 módulos) — é o que o Pages serve
verify/                # harness Playwright (smoke / temas / contrato)
DESIGN-SPEC.md         # design da camada de aprendizagem
VERIFICACAO.md         # relatório de verificação (45/45 em navegador real)
```

Verificado em navegador real: **smoke 23/23 · temas 10/10 · contrato 12/12**.
