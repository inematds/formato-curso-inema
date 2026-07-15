---
name: capa-inema
description: >-
  Gera a capa oficial INEMA (1280x720) de um repo de curso ou projeto — imagem gerada por IA (flux2-klein via inemaimg) + faixa de título/marca INEMA por cima, gravada em `capa/capa.png`. Use SEMPRE que precisar criar, gerar, refazer ou padronizar a CAPA/thumbnail/cover de um curso ou projeto INEMA — quando o usuário disser "gera a capa", "cria a capa desse curso", "faz a thumbnail", "capa do projeto", "capa split", "capa fb", ou ao criar/publicar um curso (formato-curso v1–v5) ou uma página de guia (projetos-landing-guia), que devem SEMPRE produzir a capa via esta skill. Dois layouts: split (texto à esquerda + imagem à direita, DEFAULT) e fb (full-bleed, imagem preenchendo o quadro + título por cima). Acione também para rodar capas em lote em vários repos.
---

# capa-inema

Gera a **capa oficial INEMA** de um repo de curso/projeto: uma imagem 1280×720, dark
premium âmbar, com a marca `INEMA.CLUB`, o chip da categoria e o título do curso —
sobre uma imagem gerada por IA que combina com o tema. Sempre gravada em
`<repo>/capa/capa.png`.

Existe uma engine única (`assets/gerar-capa.cjs`) pra não repetir a lógica em cada
skill de curso/guia. As skills `formato-curso` (v1–v5) e `projetos-landing-guia`
chamam esta skill como passo final da criação da página.

## Quando usar

- Pedidos diretos: "gera a capa", "cria a capa desse curso", "faz a thumbnail", "refaz a capa".
- Como **passo obrigatório** ao criar/publicar um curso (formato-curso) ou um guia (projetos-landing-guia).
- Em lote, pra padronizar a capa de vários repos.

## Dois layouts

- **`split`** (DEFAULT) — texto à esquerda (marca + categoria + título + subtítulo + barra âmbar),
  imagem gerada num card arredondado à direita (paisagem 4:3, sem distorção). É o padrão INEMA.
- **`fb`** (full-bleed) — imagem gerada preenchendo o quadro todo (16:9) + faixa de título por cima.

**Como o usuário escolhe:** o default é `split`. Se a pessoa disser **"capa fb"** (ou
"full-bleed", "imagem no meio"), use `--layout fb`. Se disser **"capa split"**, force `split`.

## Uso

```bash
node <skill>/assets/gerar-capa.cjs --repo <caminho-do-repo> \
  [--title "Título do Curso"] [--cat "Categoria"] \
  [--layout split|fb] [--cena "descrição visual da imagem"] \
  [--catalog /home/nmaldaner/projetos/inemapro-mono/apps/pro/data/catalog.json]
```

- **`--repo`** (obrigatório) — pasta do repo; a capa vai em `<repo>/capa/capa.png`.
- **`--title` / `--cat`** — se você já sabe (ex.: acabou de montar a página), passe direto.
  Senão a engine resolve pelo `catalog.json` (via slug do repo) e, em último caso, lê o
  `<h1>`/`<title>` do `index.html`.
- **`--layout`** — `split` (default) ou `fb`.
- **`--cena`** — sobrescreve a descrição visual mandada pro gerador (por padrão vem de um
  mapa por categoria; temas desconhecidos usam o próprio título como assunto).

## Dependências (checar antes)

1. **inemaimg no ar** — servidor de imagem local em `http://localhost:8000` (flux2-klein).
   Confirme com `curl -s localhost:8000/health`. Configurável via env `IMG_API`.
   O modelo de imagem padrão do ecossistema é **flux2-klein** (regra global do usuário).
2. **Playwright/chromium** — a engine tenta `node_modules` local e depois o do
   `~/projetos/timesmkt3`. Se faltar: `npm i -D playwright && npx playwright install chromium`.

## Rodar em lote

Pra padronizar vários repos, itere os slugs e chame a engine por repo, resolvendo
título/categoria pelo `catalog.json`. Lembre: cada repo é um git separado sob a conta
`inematds` — antes de commitar/pushar a capa, garanta o autor correto no repo
(`git config user.email inematds@gmail.com`), senão o deploy no Vercel Hobby trava.

## Padrão visual (não mudar sem pedir)

1280×720 · dark premium · acento âmbar `#f5a623` · fonte Montserrat · marca `INEMA.CLUB`
+ chip da categoria · imagem gerada SEM texto (o texto é a camada por cima). A imagem é
gerada na proporção certa do layout (4:3 pro card do split, 16:9 pro fb) e exibida com
`object-fit: cover` — nunca esticar/distorcer.
