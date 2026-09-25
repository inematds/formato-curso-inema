---
name: formato-curso-v6
disable-model-invocation: true
description: >-
  curso INEMA v6 para INICIANTE 30+ — página única (trilha + aulas curtas de ~15 min, sem teto de aulas, agrupáveis em módulos),
  tema papel por padrão, uma coluna, visual colado ao texto: tela de chat simulada com o pedido
  e a resposta reais, antes/depois com resultado real, passo a passo sobre a tela, cena ilustrada
  (flux2-klein, sem texto na imagem) e "cola da aula". Barra com 3 botões, sem modal, progresso
  automático, prática sem terminal (exceto perfil técnico: jargão ensinado com .gterm + glossário, visual de terminal),
  material complementar opcional sem teto, "Em 1 minuto", "Se travou aqui, é normal". Portão = rubrica
  de 10 critérios medida por script (auditar-curso.cjs) + leitor simulado. Use quando o usuário
  pedir "formato de curso v6", curso para iniciante/leigo, ou evoluir um curso v5 para v6.
  v5 (40+) e v2 continuam existindo e não são alterados por esta skill.
---

# Formato Curso v6 — INEMA (iniciante 30+)

**Uma frase:** o aluno entende cada ideia **olhando** (a figura mostra a coisa real, não um símbolo),
lê pouco (≤900 palavras por aula), faz algo que funciona em menos de 15 minutos, e nunca é
recebido por uma parede de botões.

Leia antes de escrever qualquer aula:
1. `references/CONTEUDO-INICIANTE.md` — voz, estrutura da aula, linguagem, fecho e cartões.
2. `references/V6-DESIGN.md` — os visuais (markup pronto para copiar) e a cena ilustrada.
3. `references/CHECKLIST-V6.md` — a rubrica 9/10 e como o script mede.
Consulte `references/TESTE-HUMANO.md` na etapa de verificação e `references/EXEMPLOS-PROFISSOES.md` para repertório.

## Passo 0 — descoberta (pergunte, não suponha)

1. Quem é o aluno (profissão e momento)? 2. **Duas profissões-alvo** que os exemplos vão citar.
3. O que ele já usa de tecnologia? 4. O que ele **sai fazendo** no fim? 5. Quanto tempo tem por sessão.
Registre em `context/curriculo.md` do curso, com a promessa, o tipo e o gancho de cada aula.

## Estrutura do curso (pasta do repo)

```
<curso>/
  curso.json            título, lead, id do estado (meta curso), imagem da trilha
  aulas/aula-N.html     UMA <section class="view" id="v-aula-N" data-aula="N" data-tempo="15min"> por arquivo
  assets/aula.css       copiado desta skill, sem editar
  assets/curso.js       copiado desta skill, sem editar
  assets/img/aula-N.webp  cena de cada aula (e trilha.webp)
  curso.html            MONTADO — não editar à mão
  landing.html          a partir de assets/landing-template.html
  context/curriculo.md
```

Montar: `python3 ~/.claude/skills/formato-curso-v6/scripts/montar-curso.py <curso>` (gera a trilha sozinho).
Auditar: `node ~/.claude/skills/formato-curso-v6/scripts/auditar-curso.cjs <curso>/curso.html`.
Testar o motor: `node ~/.claude/skills/formato-curso-v6/scripts/testar-motor.cjs <curso>/curso.html`.
Gerar cena: `python3 ~/.claude/skills/formato-curso-v6/scripts/gerar-cena.py <curso>/assets/img/aula-N.webp "<cena>"`
— **padrão = Codex image_gen (imagem 2.5 da conta OpenAI)**; sem crédito ou com erro, cai sozinho no inemaimg
com o modelo padrão (flux2-klein). `--gerador flux --seed N` força o local. Olhe cada imagem antes de aceitar.
**Opcionais do `curso.json` (6.2):** `"modulos"` (agrupa a trilha), `"perfil": "tecnico"` + `"termos"` (curso que ensina
terminal/Git/servidor: jargão permitido desde que definido com `.gterm` em cada aula, glossário gerado — ver
`CONTEUDO-INICIANTE.md` §2b), `"glossario": true` (glossário sem perfil técnico). Sem teto de número de aulas.
Aprofundamento vai no `details.complementar` depois do fecho (`V6-DESIGN.md` §3.7), fora do tempo e das 900 palavras.
Traduzir (EN/ES): `python3 ~/.claude/skills/formato-curso-v6/scripts/traduzir-curso.py <curso> en es` — depois de montar;
gera `en/` e `es/` (GPT-5.4 nano via OpenRouter, cache em `i18n/`, custo em `i18n/usage.jsonl`) e o seletor de idioma.
Sempre na ordem: montar → traduzir (a montagem reescreve o `curso.html` PT e apaga os links de idioma). Depois audite e
teste também `en/curso.html` e `es/curso.html`. Glossário do curso: `i18n/glossario.json`.

## A aula (ordem fixa)

1. **Abertura** — `.kicker` "Aula N de M" (o motor soma o tempo) → `h1` → `figure.cena` →
   `.promise` ("Você consegue…", verificável) → `.why` (2–3 frases, a dor de hoje) → `.em1min` (3 linhas).
2. **Núcleo** — **3 a 4 steps** (máx. 5). Cada step: `h2` com `.n` (título que afirma a ideia) → 1–2
   parágrafos curtos → `p[data-ex="<profissão>"]` (exemplo real) → **um visual que mostra a coisa**
   (`.tela`, `.lado`, `.janela` ou, só para mecanismo sem tela, `.diag`). Opcionais: `.gterm`,
   `details.mais`, `.qerr`, `.quiz`, `.calma`.
3. **Prática** — exatamente 1 `.practice[data-mode="prompt|tarefa|analise"]`, 5–12 min, com `.pgoal`
   (tempo), `.psafe`, passos com checkbox e `.pdone`. Nunca terminal, nunca código para iniciante (perfil técnico: terminal permitido, CONTEUDO-INICIANTE.md §2b).
4. **Fecho** (`div.fecho`) — `.cola` (3 itens) → `.next-action` (vitória nomeada, microação, gancho).
   O motor acrescenta sozinho a reflexão única e o botão **concluir aula**.
   Opcional: `details.complementar` logo depois da `.fecho` (aprofundamento sem teto; `V6-DESIGN.md` §3.7).
5. `<script type="application/json" id="cards-N">` com **3 ou 4** perguntas (sempre terminando em "?").

Molde copiável: `assets/aula-template.html`. Exemplo completo e aprovado (10/10): `examples/aula-1-oswork.html`.

## Limites que o script cobra

~15 min por aula (máx. 18) · prosa ≤900 palavras (aula 1 ≤700) · ≤5% das frases com mais de 22 palavras
e nenhuma com mais de 30 · ≥2 visuais reais + 1 cena por aula · todo step com visual · texto ≥14px,
contraste ≥4,5:1 nos 3 temas, fonte mono só em pedido/código · zero jargão da lista-sentinela (perfil técnico:
todo termo técnico definido com `.gterm` na aula) ·
≥1 `.calma` por aula · 3 controles na barra, sem modal · nunca "à direita/à esquerda" (no celular empilha) ·
no teste-se a alternativa certa não é a mais longa. Leia também as regras 9–17 de `CONTEUDO-INICIANTE.md` §1b
(tela "boa" nunca inventa fato, um nome por conceito, aula que se sustenta sozinha, copiar-colar antes de anexar).

## O que o motor faz (e o aluno não precisa aprender antes)

- Tema **papel** por padrão; `Aa` troca tamanho, entrelinha e tema; `☰` abre revisar, jornada, práticas e tema.
- Primeira visita: uma dica de uma linha no lugar do modal. Nenhum contador aparece antes da hora.
- Progresso **automático** (ler o fim de cada step conta). "Concluir aula" marca a aula e só então
  coloca os cartões no revisar; o botão "revisar N" aparece na barra apenas quando há pergunta vencida.
- `.gterm` abre a definição **abaixo do parágrafo** (funciona no celular); `.tela` com 2+ `.tela-caso`
  ganha botões para alternar (ex.: "Pergunta solta" × "Com contexto").
- Grifo → pergunta de revisão, jornada com "o que você já consegue fazer", exportar/importar progresso.
- Todos os textos do motor ficam no objeto `L` no topo de `curso.js` (para EN/ES, traduzir só ele).

## Portão (antes de entregar)

1. `auditar-curso.cjs` → **toda aula ≥9/10** e sem falha nos critérios 7, 8 e 10.
2. `testar-motor.cjs` → todos os comportamentos OK, zero erro de JavaScript.
3. **Leitor simulado** (`TESTE-HUMANO.md` §1) em cada aula → nenhum ponto "travei" sem correção.
4. Quando houver pessoas disponíveis: teste humano com 2–3 iniciantes 30+ (`TESTE-HUMANO.md` §2).

## Publicação e capa

Publicar = commit + push do repo do curso (GitHub Pages na raiz). Capa: skill `capa-inema` usando a arte da trilha
(já gerada pelo Codex, no estilo do curso): converta `assets/img/trilha.webp` para PNG e rode
`node ~/.claude/skills/capa-inema/assets/gerar-capa.cjs --repo <pasta> --title "<Nome vN: título>" --cat "<categoria>" --raw-in trilha.png`.
Sem `--raw-in` a capa inventa a própria cena (já saiu mão de robô — proibido no v6).
**Versão no nome:** o curso mostra a versão (ex.: "OSWork v6") no `<title>`, na barra (`curso_curto`), no kicker da trilha,
na landing e no rodapé das aulas — igual ao card do portal.
Portal: skill `atualiza-portal` (e, para EN/ES, a seção "Versão traduzida" dela).
Rodapé da landing com o backlink do inema.club (já no template).
