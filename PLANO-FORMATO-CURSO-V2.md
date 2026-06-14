# Plano — Nova skill de curso INEMA "aprendizado agradável" (v2)

- **Data:** 2026-06-14
- **Autor:** Nei + Claude (sessão de brainstorming/escopo)
- **Status:** ESCOPO DEFINIDO — agendado p/ disparo às 10:00 de 2026-06-14
- **Skill de REFERÊNCIA (não editar):** `/home/nmaldaner/.claude/skills/formato-curso/` — usada só como baseline/inspiração.
- **Skill NOVA a criar:** uma skill separada (nome provisório `formato-curso-v2`, ajustável), construída como dev-source em `/home/nmaldaner/projetos/formato-curso-inema/` e depois instalável em `~/.claude/skills/` (+ espelho codex).

> ⚠️ **Regra firme:** o workflow **NÃO altera** a skill `formato-curso` atual. Ela permanece intacta. Todo o trabalho vai numa **skill nova**.

---

## 1. Objetivo

Criar uma **NOVA skill de curso** (sem mexer na `formato-curso` existente) com um formato **mais agradável e fácil de aprender**, em três frentes simultâneas:

1. **Didática / legibilidade do formato** — melhorar a experiência de *ler e aprender* (tipografia, ritmo, hierarquia, uso de gráficos, navegação) com base nos melhores formatos de curso online do estilo **texto + gráfico**.
2. **Camada interativa de aprendizado** — adicionar, dentro das páginas, um sistema para o aluno **marcar o que já leu**, **marcar dúvidas** e **fazer anotações**, tudo **gravado localmente** no navegador, com um painel **"minha jornada"** consolidando o progresso.
3. **Ótimo visual + temas trocáveis** — o curso tem que ser **visualmente excelente** por padrão E oferecer **alternativas de aparência** que o aluno escolhe e ficam salvas (mais que só light/dark): temas de leitura (ex.: dark premium, claro, sépia/foco), opções de tipografia/tamanho/largura de linha, densidade, e variação de paleta de acento — sem fugir da identidade INEMA.

Tudo isso **sem quebrar a regra de ouro INEMA**: página HTML **self-contained**, sem build, sem backend (Tailwind via CDN, JS inline).

---

## 2. Decisões travadas (respostas desta sessão)

| # | Pergunta | Decisão |
|---|----------|---------|
| Q1 | Onde o workflow para? | **B** — pesquisa + diagnóstico + **implementação**, com demo funcionando. |
| Q2 | Como grava "local"? | **B agora** — `localStorage` + Exportar/Importar `.json`. **C como v2** — sync com o portal (inema.club). Arquitetura nasce preparada para o sync, sem construir backend agora. |
| Q3 | Escopo de recursos? | **C (amplo)** — os 3 pedidos (lido / dúvida / notas) + painel "minha jornada" + os melhores extras que a pesquisa apontar, sem teto rígido. |
| Q4 | "Melhorar" inclui o quê? | **C** — melhora a **didática/legibilidade** do formato **E** a camada interativa. |
| Q5 | Onde mora o trabalho? | **Skill NOVA** — não tocar na `formato-curso` atual; criar uma skill separada usando a atual só como referência. |
| — | Constraint | **Mantém self-contained** — sem build, sem backend (Tailwind CDN, JS inline). |

---

## 3. Escopo

### Dentro (in-scope)
- Análise profunda da skill `formato-curso` atual (SKILL.md, MASTER_COMPLETO, DESIGN-SYSTEM, CHECKLIST_REVISAO, SVG-FUTURISTA) — **somente leitura**, como baseline.
- Benchmark dos melhores formatos de curso online texto+gráfico (docs interativas, textbooks modernos, plataformas de leitura/aprendizado).
- Melhorias de **didática/legibilidade** do formato de leitura.
- **Sistema de temas/aparência trocável pelo aluno** (persistido em `localStorage`):
  - Visual padrão **excelente** (refinar o dark premium INEMA atual).
  - **Temas de leitura** alternativos: ex.: dark premium, claro, sépia/foco (a pesquisa confirma o conjunto ideal).
  - Preferências de **tipografia** (família/tamanho), **largura de linha** e **densidade**.
  - Variações de **paleta de acento** dentro da identidade INEMA.
  - Seletor de tema discreto + estado salvo entre páginas e sessões.
- **Camada interativa** persistida em `localStorage`:
  - **Marcar lido** (por tópico e por módulo) + barra de progresso (tópico → módulo → trilha → curso).
  - **Marcar dúvida** (flag por tópico/trecho).
  - **Anotações** locais (por tópico; idealmente também por trecho/seleção = highlight com nota).
  - **Exportar / Importar** todas as anotações como `.json` (backup + portabilidade manual).
  - Painel **"minha jornada"** — agrega lidos, dúvidas, notas e progresso num lugar só.
  - Extras de alto valor que a pesquisa apontar (ex.: "continuar de onde parei", índice flutuante/scrollspy, busca no curso, estimativa de tempo de leitura, atalhos de teclado) — implementar os que couberem.
- **Construção da skill NOVA** (separada): seu próprio SKILL.md + references (MASTER, design-system, checklist, SVG) + módulo JS reusável + CSS + convenções de markup (IDs estáveis). A skill atual serve de ponto de partida copiado, não editado.
- **Curso-demo** funcionando, provando todos os recursos.

### Fora (out-of-scope agora)
- ⛔ **Editar/alterar a skill `formato-curso` existente** — ela fica intacta; tudo vai na skill nova.
- Backend / autenticação / banco de dados.
- Sync automático entre dispositivos (= **v2**, ver §8).
- Build step / bundler / framework (segue self-contained).
- Migração/retrofit automático de cursos antigos já publicados (avaliar depois; o foco é o gerador novo).

---

## 4. Arquitetura do workflow (a rodar depois)

Workflow multi-agente em 5 fases. Padrões de qualidade: leitura paralela, varredura multi-ângulo, **verificação adversarial** de afirmações, **crítico de completude** ao fim de cada fase, e síntese por **painel de juízes**.

### F0 — Baseline (análise da skill atual, **só leitura**)
- Leitores paralelos sobre os arquivos da skill `formato-curso` (sem editar) → **mapa estruturado**: o que a skill faz hoje, componentes, didática atual, lacunas de "learnability", ausência de progresso/notas.
- Crítico de completude lista o que está faltando / frágil.
- Define o **nome e a estrutura da skill NOVA** (default `formato-curso-v2`) e copia o baseline pra dev-source em `/home/nmaldaner/projetos/formato-curso-inema/`.

### F1 — Benchmark / pesquisa
- Varredura web multi-ângulo dos **melhores formatos texto+gráfico**, cada agente cobrindo um ângulo distinto:
  - Docs/learning interativos (ex.: estilo web.dev, MDN, freeCodeCamp, "Just JavaScript", Execute Program, Stripe docs, Brilliant — a pesquisa confirma os melhores).
  - **Leitura/tipografia** (comprimento de linha, espaçamento, hierarquia, foco).
  - **Tracking de progresso** (padrões de "lido", barras, retomar).
  - **Note-taking / highlight** (UX de anotação no texto).
  - **Acessibilidade** (teclado, contraste, `prefers-reduced-motion`, ARIA).
  - **Visual & temas** — o que torna um curso visualmente "ótimo"; padrões de **theme switcher** (light/dark/sépia/foco), tokens de cor, tipografia trocável, densidade — e como implementar isso só com CSS variables + classes no `<html>` (sem framework).
- Verificação adversarial das alegações; **relatório citado** mapeando cada achado → aplicabilidade num HTML self-contained.

### F2 — Síntese / design das melhorias
- Painel de juízes gera propostas independentes (frente **didática** + frente **interativa** + frente **visual/temas**) → escolhe/funde a melhor.
- Entrega **spec de design**:
  - Modelo de dados `localStorage` (ver §6).
  - Schema de **export/import** `.json` (forward-compatible com sync v2).
  - **API do módulo JS** (progresso/dúvida/notas/jornada).
  - Componentes de UI + convenções de markup (IDs estáveis por módulo/tópico).
  - **Sistema de temas** baseado em CSS variables + classe no `<html>` (ex.: `data-theme`), com seletor e preferências persistidas — extensível para novos temas sem reescrever as páginas.
  - Melhorias de leitura/didática a aplicar no MASTER.

### F3 — Implementação (na skill NOVA)
- Criar a **skill nova** (dev-source no projeto): próprio **SKILL.md**, **MASTER_COMPLETO** (baseado no atual + novas seções), **módulo JS** reusável (inline), **CSS** (incl. sistema de temas), convenções de markup. Pode apoiar-se na skill `skill-creator`.
- **Curso-demo** completo provando todos os recursos.
- **CHECKLIST_REVISAO.md** e **SKILL.md** próprios da skill nova.
- ⛔ A `formato-curso` original **não é tocada**.
- Isolamento por worktree se houver edição paralela de arquivos.

### F4 — Verificação
- Review adversarial do demo:
  - Persiste no reload? Export → Import faz **round-trip** sem perda?
  - Acessível (teclado, contraste, reduced-motion, ARIA)?
  - **Self-contained** (nenhuma dependência externa além do CDN permitido)?
  - Funciona em **light e dark**, e a **troca de tema** (claro/sépia/foco/etc.) aplica e **persiste** entre páginas e reloads?
  - Progresso agrega corretamente (tópico → módulo → trilha → curso)?
- Crítico de completude: o que foi prometido e não entregue.

---

## 5. Entregáveis

1. **Relatório** de pesquisa + diagnóstico (citado).
2. **Spec de design** dos recursos (didática + interativa + visual/temas).
3. **Skill NOVA completa** — SKILL.md, MASTER_COMPLETO, módulo JS, CSS, CHECKLIST_REVISAO, references próprios (a `formato-curso` original fica intacta).
4. **Curso-demo** funcionando com todos os recursos.
5. **Backlog** — sync v2 com portal + extras não implementados, priorizados.

---

## 6. Rascunho do modelo de dados (`localStorage`)

> Detalhe final sai na F2; este é o ponto de partida.

- **Isolamento por curso:** `courseId` derivado de um `<meta>` ou do nome da pasta do curso, para cada curso ter seu próprio estado.
- **Âncoras estáveis:** cada módulo/tópico precisa de `id`/`data-*` estável (ex.: `modulo-1-1#topico-3`) para progresso e notas grudarem no lugar certo.

Chaves (namespace `inema.<courseId>.*`):

| Chave | Conteúdo |
|-------|----------|
| `…read` | `{ "modulo-1-1#topico-3": true, … }` — tópicos/módulos marcados como lidos |
| `…doubts` | `{ "modulo-1-1#topico-3": { ts, nota? }, … }` — dúvidas sinalizadas |
| `…notes` | `{ "modulo-1-1#topico-3": [ { id, ts, texto, anchor? } ], … }` — anotações (e highlights) |
| `…meta` | `{ lastVisited, lastScroll, … }` — "continuar de onde parei" |
| `inema.prefs` | `{ theme, font, fontSize, lineWidth, density, accent }` — preferências visuais (global ao aluno, não por curso) |

**Schema de export/import (`.json`):**
```json
{
  "schemaVersion": 1,
  "courseId": "fep",
  "exportedAt": "<iso>",
  "read": { },
  "doubts": { },
  "notes": { },
  "meta": { }
}
```
> Mesmo formato poderá ser enviado ao portal no **v2** (sync), sem reescrever o modelo.

---

## 7. Regra de ouro (constraints inegociáveis)

- ⛔ **NÃO editar a skill `formato-curso` existente** — todo trabalho vai numa skill nova.
- Página **HTML self-contained** — abre clicando, funciona offline.
- **Sem build / sem backend / sem framework** — Tailwind via CDN, JS inline.
- Novos recursos respeitam **light/dark**, **acessibilidade** (`prefers-reduced-motion`, teclado, ARIA, contraste).
- Não quebra os **Erros Críticos #1–#17** já existentes na skill (nav completo, SVG futurista, mapa da trilha, profundidade dos módulos etc.).
- Link **INEMA.CLUB** preservado em todas as páginas.

---

## 8. Backlog / v2

- **Sync com portal (inema.club)** — usar o mesmo schema de export/import via API (Next.js/Vercel) + auth, para estado entre dispositivos automático.
- Extras pesquisados e não implementados na primeira leva (priorizados pela pesquisa).
- Retrofit de cursos já publicados para a v2 do formato.

---

## 9. Critérios de sucesso

- O **curso-demo** marca lido/dúvida/notas, persiste no reload, exporta e reimporta sem perda.
- O painel **"minha jornada"** mostra progresso real agregado.
- A leitura ficou comprovadamente **mais agradável/legível** (mudanças justificadas pela pesquisa citada).
- O **visual padrão** ficou excelente E o aluno consegue **trocar de tema/aparência**, com a escolha salva entre páginas e sessões.
- Nada quebrou da regra de ouro nem dos Erros Críticos herdados do baseline.
- A skill `formato-curso` original ficou **byte-a-byte intacta**.
- A **skill nova** tem SKILL.md + CHECKLIST próprios — qualquer curso gerado por ela já nasce com os recursos.

---

## 10. Execução

Agendado para **disparo automático às 10:00 de 2026-06-14** (timer local nesta sessão). Ao disparar, o plano vira um **Workflow** (orquestração multi-agente) seguindo as 5 fases acima, **criando uma skill nova** e deixando a `formato-curso` intacta.
