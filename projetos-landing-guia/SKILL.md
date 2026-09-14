---
name: projetos-landing-guia
description: >-
  Pagina unica de LANDING + GUIA DE USO de um projeto, self-contained em guia/index.html, padrao
  INEMA dark ambar, pronta pra GitHub Pages. Gatilho: "pagina/landing/site/guia de uso do projeto",
  ou GitHub Pages para um repo.
---

# projetos-landing-guia

Gera uma **pagina unica** (`guia/index.html` self-contained, sem build) que serve como **landing + guia de uso** de um projeto, e publica no **GitHub Pages**. Visual no padrao INEMA: dark premium com acento ambar, responsivo, com light/dark toggle.

O ponto desta skill: o usuario tem um projeto (engine, CLI, ferramenta, repo) e quer **uma pagina que explica o que e + ensina a usar**, rapida de publicar. Voce nao reinventa o design — parte do template provado e so troca o conteudo.

## Regra de repositorio (nao quebrar)

**O guia e UMA pagina em `guia/index.html` DENTRO do repo do PROPRIO projeto — nunca um repo separado.**

- **Padrao de local: pasta `guia/`.** O guia mora em `guia/index.html` (com `guia/assets/` ao lado), **nao na raiz** — a raiz fica pro app/codigo/README do projeto. Isso deixa o guia coexistir com o app e torna a deteccao deterministica: `https://inematds.github.io/<repo>/guia/`.
- **Nao crie um repo so pro guia** (nada de `projeto-guia`, `projeto-landing`). **Nao crie 2 repos.** O guia mora dentro do repo do projeto, ao lado do codigo.
- **Nome do repo remoto = nome da PASTA LOCAL do projeto**, a menos que o usuario diga explicitamente outro nome. Ex.: pasta `~/projetos/videosavatar` → repo `inematds/videosavatar` (NAO `videosavatar-guia`).
- Se a pasta local ainda nao e um repo git, `git init` **nela mesma** e cria o remoto com o nome dela (`gh repo create inematds/<nome-da-pasta> --source=. ...`). Se ja e um repo, so adiciona `guia/index.html` e publica — nao clone/crie outro.
- GitHub Pages serve da **raiz** do repo (branch `main`, `/`); como o guia esta em `guia/`, a URL do card no portal e `https://inematds.github.io/<nome-da-pasta>/guia/`.
- **Compatibilidade (migracao A):** guias antigos publicados na **raiz** (`https://inematds.github.io/<repo>/`) continuam validos — nao migre em massa. O padrao `guia/` vale para guias **novos** daqui pra frente.

## Fluxo

1. **Reuna o conteudo do projeto.** Antes de escrever, junte: nome + emoji do projeto, uma frase-pitch, o que e (3 pontos fortes), como funciona (as etapas do fluxo/pipeline), pre-requisitos (servicos/comandos pra rodar), o passo a passo de uso (com comandos reais), 1-2 exemplos, o roadmap/fases, e a URL do repo GitHub. Leia o README/docs do projeto se existirem — nao invente recursos; descreva o que existe.
2. **Copie o template.** Use `assets/template.html` como base — ele ja traz todo o CSS, o nav INEMA, o theme toggle e a estrutura de secoes. **Nao reescreva o CSS.** Edite so o conteudo e os `{{PLACEHOLDERS}}`.
3. **Preencha as secoes** (veja "Estrutura" abaixo). Remova secoes que nao se aplicam; nunca remova o nav nem o footer.
4. **Banner hero (padrao desde 2026-09-14).** Gere o banner promocional com `assets/gerar-banner.sh` (ver secao "Banner hero" abaixo) — ele vai no `<figure>` da hero E no topo do README. Se falhar, o `<figure>` usa `assets/hero.png` (flux, da capa).
5. **Imagens (opcional).** Se houver imagens de exemplo, gere versoes leves (`ffmpeg -i fonte.png -vf scale=760:-1 -q:v 4 guia/assets/x.jpg`) numa pasta `guia/assets/` ao lado do `guia/index.html` (referencie-as no HTML como `assets/x.jpg`, relativo ao guia). Se nao houver, troque o `<figure>` do hero por nada ou por um bloco de codigo.
6. **Salve** o guia em **`guia/index.html`** no repo do PROPRIO projeto (e `guia/assets/` ao lado) — ver "Regra de repositorio" acima. Nunca num repo separado so pro guia.
7. **Referencie o guia no README** (veja "Referencia no README" abaixo) — obrigatorio.
8. **Publique no GitHub Pages** (veja "Publicar" abaixo).
9. **Verifique** que ficou no ar e que o nav tem o link INEMA.CLUB.

## Referencia no README (obrigatorio)

Sempre que gerar `guia/index.html`, adicione (ou atualize) no **`README.md`** do
proprio projeto um link para o guia publicado. Assim quem chega pelo repo acha a
pagina de uso.

- Se ja existir um `README.md`, insira uma linha/secao proxima ao topo apontando
  para a URL do Pages: `https://inematds.github.io/<nome-da-pasta>/guia/`.
  Nao duplique se ja houver o link; atualize a URL se estiver diferente.
- Se **nao** existir README, crie um minimo com titulo do projeto + a linha do guia.
- **Banner no topo do README (padrao):** se `guia/assets/banner.jpg` existe, a primeira
  linha depois do `# titulo` e o banner clicavel apontando pro guia:
  `[![<titulo>](guia/assets/banner.jpg)](https://inematds.github.io/<nome-da-pasta>/guia/)`.
- Formato sugerido:

  ```markdown
  ## 📖 Guia de uso

  Guia completo (landing + passo a passo): **https://inematds.github.io/<nome-da-pasta>/guia/**
  ```

## Invariantes de design (nao quebrar)

Estes elementos sao a identidade do padrao — mantenha sempre:

- **Acento ambar** `#E2A23B` (`--amb`) como cor primaria; **sky** `#38bdf8` (`--sky`) so para o link INEMA.CLUB.
- **Nav INEMA**, identico em qualquer pagina: `logo ambar (emoji + nome)` + separador `|` + **`INEMA.CLUB` em sky** (`target="_blank"` → `https://inema.club`) + separador `-` + **`PRO` em dourado/prateado** (`target="_blank"` → `https://inema.pro`) + itens de secao + **theme toggle** (🌙/☀️, preferencia salva no `localStorage`) + botao GitHub. Os links **INEMA.CLUB e PRO no nav sao obrigatorios** (mesmo padrao do formato-curso v1/v2).
- **Cor do PRO**: variavel `--pro` — `#cbd5e1` (prateado) no dark (`:root`), `#b45309` (dourado) no light (`body.light`). Classe `.pro` no nav (ja no `template.html`, ao lado de `.inema`).
- **Light/dark** via `body.light` sobrescrevendo as variaveis CSS — nunca hard-code cores fora das variaveis.
- **Fontes Google**: Sora (titulos), Inter (corpo), JetBrains Mono (codigo).
- **Responsivo**: o template ja colapsa grids e esconde itens de secao no mobile. Mantenha.
- **Self-contained**: tudo inline (CSS + JS no proprio `guia/index.html`). So as imagens em `guia/assets/` sao externas (referenciadas como `assets/...`, relativo ao guia). Isso e o que faz funcionar em GitHub Pages sem build.

## Estrutura (secoes do template)

Preencha cada uma; escale o conteudo ao projeto.

| Secao | O que vai |
|-------|-----------|
| **nav** | logo, INEMA.CLUB, PRO, itens de secao (ancoras), toggle, GitHub. So troca nome/emoji e URL do repo. |
| **hero** | `chip` (subtitulo curto), `h1` (pitch com 1 palavra em `.amb`), `lead` (1-2 frases), 2 CTAs (ex.: "Comecar o guia" → `#guia`; "Ver no GitHub"), e uma `<figure>` com imagem (ou remova). |
| **O que e** | 3 `.card` com os pontos fortes (emoji + titulo + 1 frase). |
| **Como funciona** | um `.flow` (chips com `→`) mostrando o fluxo/pipeline + opcional grid de cards agrupando etapas. |
| **Pre-requisitos** | cards com o que precisa estar instalado/no ar, com `<pre>` de comandos. |
| **Guia de uso** | `.step` numerados (b = numero) com titulo, 1 frase e um `<pre>` de comando/codigo **real**. Este e o coracao — passos concretos e copiaveis. |
| **Exemplos** | `.ex` com figuras + legenda do que foi feito com o projeto. |
| **Roadmap** | `.phase` (tag da fase + titulo + descricao). |
| **footer** | `.pill`s de stack + linha com link do repo e **INEMA.CLUB**. |

Realce sintaxe nos `<pre>` com `<span class="c">` (comentario), `<span class="k">` (comando/keyword), `<span class="s">` (string/URL).

## Publicar no GitHub Pages (via GitHub Actions)

> ⚠️ **NAO use o build "legacy" (Deploy from a branch).** A fila legacy do GitHub Pages **trava** (builds presos em `building` por horas/dias; o passo de deploy retorna `##[error]Deployment failed, try again later.`). Publique por **GitHub Actions** (`build_type=workflow`): o `upload-pages-artifact` **nao roda Jekyll**, entao `{{ }}` sobe **literal** (sem depender de `.nojekyll`), o deploy tem fila propria + logs visiveis, e nao empanca junto com os builds legacy.

GitHub Pages no plano gratuito **so funciona em repo publico**. Passos (via `gh`):

```bash
cd <repo>

# 1. garanta que nao ha segredos versionados
git grep -nIiE "api[_-]?key|secret|password|token|bearer " -- . | head

# 2. NAO deixe placeholder do template sem preencher
git grep -nE "\{\{[A-Z_]+\}\}" -- guia index.html 2>/dev/null && echo "!! placeholders soltos — preencha antes" || echo "ok"

# 3. workflow de deploy estatico (path:'.', serve da raiz — guia fica em .../<repo>/guia/)
mkdir -p .github/workflows
cat > .github/workflows/pages.yml <<'YML'
name: Deploy static site to Pages
on:
  push: { branches: [main, master] }   # cobre repos com branch default master
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: false }
jobs:
  deploy:
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: '.' }
      - id: deployment
        uses: actions/deploy-pages@v4
YML
touch .nojekyll   # cinto+suspensorio: inofensivo; cobre se alguem voltar pro legacy

# 4. commit + push (add -A cobre guia/, raiz/migracao A, .nojekyll e .github/)
git add -A && git commit -m "site: landing + guia (GitHub Pages via Actions)" && git push

# 5. repo publico (confirme com o usuario antes — e uma acao de publicacao)
gh repo edit <owner>/<repo> --visibility public --accept-visibility-change-consequences

# 6. aponta o source do Pages pro GitHub Actions (IDEMPOTENTE: POST cria; se ja existe, PUT)
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow 2>/dev/null \
  || gh api -X PUT  repos/<owner>/<repo>/pages -f build_type=workflow

# 7. acompanhe o run e pegue a URL
gh run list --repo <owner>/<repo> --limit 3
gh api repos/<owner>/<repo>/pages -q .html_url   # -> https://<owner>.github.io/<repo>/  (guia em .../<repo>/guia/)
```

**Se ja havia um build legacy preso** (`gh run list` mostra "pages build and deployment" em `queued`/`in_progress` ha muito tempo, ou `.../pages/builds/latest` em `building` com `duration:0`): cancele-o (`gh run cancel <id> --repo <owner>/<repo>`) e mude pro Actions (passo 6). Enquanto houver deploy legacy preso, os novos falham com "Deployment failed, try again later" — **empty-commit NAO resolve**, so enfileira outro build travado.

**Importante:** tornar um repo privado em publico e uma acao de publicacao (vira mundo-visivel, pode ser indexado). **Confirme com o usuario** e **verifique que nao ha segredos** antes. O primeiro run leva ~1 min; ate la a URL pode responder 404.

Para verificar o conteudo publicado quando `curl` estiver bloqueado no ambiente, use `fetch` dentro de uma ferramenta de execucao de codigo (ex.: context-mode `ctx_execute`), nao Bash inline.

## Checklist final

1. Nav tem logo ambar + **INEMA.CLUB em sky** (`target="_blank"`) + **PRO em dourado(claro)/prateado(dark)** (`target="_blank"` → `https://inema.pro`) + theme toggle + GitHub.
2. Toggle dark/light funciona e salva preferencia.
3. Footer tem **INEMA.CLUB**.
4. Passo a passo usa **comandos reais** do projeto (nao placeholders).
5. So o que existe no projeto e descrito (sem features inventadas).
6. `guia/index.html` + `guia/assets/`; **deploy via GitHub Actions** (`.github/workflows/pages.yml` + `build_type=workflow`) — NAO legacy. `.nojekyll` na raiz por garantia. Nenhum `{{PLACEHOLDER}}` solto no HTML.
7. Pages no ar (HTTP 200, run do Actions verde) e repo publico (com consentimento + sem segredos).
8. **README do projeto tem link para o guia** (`https://inematds.github.io/<nome-da-pasta>/guia/`).

## Capa oficial + imagem hero — SEMPRE gerar (via skill `capa-inema`)

**Invoque direto, não por linguagem natural** — rode o comando abaixo (ou
`Skill(skill="capa-inema", args="<repo>")`), sem descrever o pedido em prosa.

Rode isto **antes** de escrever `guia/index.html`. A capa continua obrigatoria (o portal e
o PRO leem `capa/capa.png`). O `hero.png` que sai junto e o **fallback** da hero: desde
2026-09-14 a hero usa o **banner promocional** (secao seguinte); so use `hero.png` no
`<figure>` se o banner falhar. Nunca invente SVG ilustrativo nem troque por bloco de codigo.

```bash
node ~/.claude/skills/capa-inema/assets/gerar-capa.cjs --repo <pasta-do-repo> \
  --title "<título do projeto>" --cat "<categoria>" \
  --save-raw <pasta-do-repo>/guia/assets/hero.png
```

Isso grava **duas coisas na mesma chamada** (uma única geração de imagem, sem desperdiçar
uma segunda chamada ao gerador):
- `<repo>/capa/capa.png` — a capa oficial do catálogo (com marca/título por cima).
- `<repo>/guia/assets/hero.png` — a MESMA imagem, sem texto, pra usar no `<figure>` da
  hero da própria página de guia (o template já referencia esse caminho).

- **Layout default = `split`** (texto à esquerda + imagem à direita). Se o usuário pediu **"capa fb"** (full-bleed), acrescente `--layout fb`.
- Requer o **inemaimg** no ar (`localhost:8000`).
- Detalhes, opções e uso em lote: skill `capa-inema`.

## Banner hero + README — padrao desde 2026-09-14 (via Codex CLI)

A hero do guia e o topo do README usam um **banner promocional 16:9 no estilo INEMA.PRO**
(fundo preto-azulado, tipografia 3D dourada + ciano, tiles com icones neon, faixa
`INEMA.CLUB · inematds.github.io/<repo>`). E gerado pelo **Codex CLI** (`codex exec` +
`image_gen`), porque ele escreve texto em portugues corretamente — o flux2-klein nao, por
isso a capa continua sem texto. **A capa do catalogo NAO muda** (segue `capa-inema`).

Rode **depois** da capa e **antes** de escrever o `guia/index.html`:

```bash
bash ~/.claude/skills/projetos-landing-guia/assets/gerar-banner.sh \
  --repo <pasta-do-repo> \
  --title "<TITULO CURTO EM CAIXA ALTA>" \
  --sub "<SUBTITULO / PROMESSA>" \
  --line "<uma frase de apoio>" \
  --tiles "<4 a 6 legendas separadas por virgula, tiradas das secoes do guia>" \
  [--sides "<o que vai a esquerda | a direita | no centro>"]
```

- Saida: `<repo>/guia/assets/banner.jpg` (1400px, JPG leve). O template ja aponta
  `<figure><img src="assets/banner.jpg">` na hero.
- **README:** logo abaixo do `# titulo`, insira `[![<titulo>](guia/assets/banner.jpg)](<url do guia>)`.
- **Confira a imagem** (Read no arquivo) antes de publicar: o Codex acerta o texto principal,
  mas pode inventar frases decorativas pequenas nas bordas. Se algum texto principal saiu
  errado, rode de novo ajustando `--title/--sub/--tiles`.
- **Fallback:** o script sai com 1 e nao cria arquivo se o `codex` nao existir ou a geracao
  falhar. Nesse caso troque o `<figure>` pra `assets/hero.png` (a imagem crua da capa) e nao
  ponha banner no README.
- **Custo:** uma geracao de imagem na conta OpenAI do Codex por chamada (autorizado pelo
  usuario em 2026-09-14 como custo padrao por guia).
- Exemplo real: `inematds/agente-claude-codex` (guia + README).
