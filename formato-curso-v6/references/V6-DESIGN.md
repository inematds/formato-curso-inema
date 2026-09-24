# V6-DESIGN.md — visual do v6: mostre, não simbolize

## 1. Princípio

A figura mostra **a coisa real** que o aluno vai ver ou fazer: o pedido escrito, a resposta que volta,
a pasta com os arquivos, o resultado antes e depois. Proibido o "tracinho no lugar de texto": se a figura
é sobre um pedido, ela mostra **o pedido**. Diagrama abstrato só para mecanismo que não tem tela.

Teste dos 5 segundos: tape o texto do step. Só a figura + o rótulo passam a ideia? Se não, refaça a figura.

## 2. Tokens e temas

- 3 temas: **papel** (padrão), escuro, sépia — trocados pelo `Aa`. Nunca declare cor solta: use as variáveis.
- `--accent` (verde) = certo / feito / ação. `--warm` (âmbar) = atenção / "se travou". `--bad` (vermelho suave) =
  o exemplo ruim / resposta errada. Nunca informação só por cor: sempre com rótulo ("Antes", "Depois", ✓, ✗).
- Tipografia: Newsreader (títulos), Inter (texto, 18px padrão), JetBrains Mono **só** em pedido/código.
- Texto nunca abaixo de 14px; contraste ≥4,5:1 em todo texto nos 3 temas (o auditor mede).
- Uma coluna (`.aula`, 40rem). Visuais podem usar `class="largo"` no `<figure>` para abrir até 54rem no desktop.

## 3. Catálogo de visuais (copie o markup)

### 3.1 Tela de chat simulada — `.tela`
Use para qualquer pedido/resposta. Com 2+ `.tela-caso`, o motor cria botões para alternar.
```html
<figure class="largo">
  <div class="tela">
    <div class="tela-top"><i></i><i></i><i></i><span>Chat de IA</span></div>
    <div class="tela-caso" data-rotulo="Pergunta solta">
      <div class="tela-body">
        <p class="msg eu"><span class="quem">Você</span>O pedido vago, como a pessoa escreveria.</p>
        <p class="msg ia falha"><span class="quem">IA</span>A resposta genérica real (começo dela)…</p>
      </div>
      <p class="tela-nota ruim">Por que não serve, em 1 frase.</p>
    </div>
    <div class="tela-caso" data-rotulo="Com contexto">
      <div class="tela-body">
        <p class="msg eu"><span class="quem">Você</span>O pedido completo.
Quebra de linha vale (white-space: pre-line).</p>
        <p class="msg ia ok"><span class="quem">IA</span>A resposta boa…</p>
      </div>
      <p class="tela-nota bom">O que mudou, em 1 frase.</p>
    </div>
  </div>
  <figcaption><b>Toque nos dois botões</b> e compare.</figcaption>
</figure>
```
Uma tela só (sem alternância) = uma `.tela-body` direto dentro de `.tela`.
`.msg.falha` (borda vermelha) marca a resposta ruim; `.msg.ok` (borda verde) a boa.

### 3.2 Antes e depois com o resultado real — `.lado`
```html
<figure class="largo">
  <div class="lado">
    <div class="antes"><span class="rot">Antes</span><p><b>Pedido:</b> "…"</p><p><b>Resultado:</b> …</p></div>
    <div class="depois"><span class="rot">Depois</span><p><b>Pedido:</b> …</p><p><b>Resultado:</b> …</p></div>
    <p class="saldo"><b>Saldo:</b> o ganho medido em 1 linha (tempo, rodadas, erros).</p>
  </div>
</figure>
```
Os rótulos podem mudar ("Desejo" × "Critério", "Espalhado" × "Organizado"). O saldo é opcional só quando não há número honesto.
Cores dos lados: `.antes` = vermelho (o pior/errado) · `.depois` ou `.bom` = verde · `.neutro` = sem juízo.
Quando os dois lados são corretos (ex.: "a IA confere" × "a decisão é sua"), use `.bom` + `.neutro`, nunca `.antes`.
No texto, refira-se aos lados pelo rótulo ("o cartão Critério"), nunca por "direita/esquerda" — no celular eles empilham.
Na `.janela`, `.item.botao` é ilustração (contorno tracejado), não botão de verdade.

### 3.3 Passo a passo sobre a tela — `.janela` + `.pin`
Para "onde clicar", pastas, organização de arquivos. Os números em círculo (`.pin`) ficam **na tela** e na lista.
```html
<figure class="largo">
  <div class="janela">
    <div class="tela-top"><i></i><i></i><i></i><span>Meus arquivos</span></div>
    <div class="janela-body">
      <div class="item pasta"><span class="pin">1</span> Treinamento de segurança</div>
      <div class="item doc dentro"><span class="pin">2</span> norma-2026.pdf</div>
      <div class="item doc dentro">lista-de-presença.xlsx</div>
      <div class="item botao"><span class="pin">3</span> Nova pasta</div>
    </div>
  </div>
  <ol class="passos">
    <li><span class="pin">1</span><span>Uma pasta por frente de trabalho, com nome que você reconhece.</span></li>
    <li><span class="pin">2</span><span>Dentro dela, só o material que a IA precisa ler.</span></li>
    <li><span class="pin">3</span><span>Frente nova? Pasta nova.</span></li>
  </ol>
</figure>
```
Classes de item: `.pasta`, `.doc`, `.botao`, `.dentro` (recuo). Não imite a marca de nenhum programa — é uma tela genérica.

### 3.4 Cena ilustrada — `figure.cena` (1 por aula, na abertura)
```html
<figure class="cena"><img src="assets/img/aula-N.webp" width="1280" height="720"
  alt="Frase que descreve a situação e ensina (quem, onde, o que está acontecendo)."></figure>
```
- Gerada com `scripts/gerar-cena.py`: **padrão Codex image_gen** (imagem 2.5; ~1 min por imagem; rode até 4 em paralelo),
  com **fallback automático** para o inemaimg local (flux2-klein) quando o Codex falha ou fica sem crédito. Estilo
  "editorial" fixo no curso. No piloto OSWork o Codex manteve até os mesmos personagens entre aulas (sem seed).
  Magnific com imagem de referência continua como opção para personagem recorrente exato.
- **Nenhum texto dentro da imagem** (o PT/EN/ES traduz só o HTML). Telas na imagem = formas borradas.
- Mostra uma pessoa da profissão-alvo na situação do exemplo principal da aula. Adultos de 30 a 60, brasileiros, diversos.
- Proibido: robô, cérebro brilhante, circuito, holograma, aperto de mão com robô.
- WebP 1280×720, ≤150 KB (o script já comprime), `alt` com >20 caracteres.
- A trilha usa `assets/img/trilha.webp` (as duas profissões-alvo juntas).

### 3.5 Diagrama de mecanismo — `.diag` (só quando não existe tela)
SVG inline simples, rótulos em palavras comuns dentro do SVG (`<text>` herda Inter 15px), no máximo 4 elementos.
```html
<figure class="diag"><svg viewBox="0 0 640 220" role="img" aria-label="…">…</svg>
  <figcaption>O que olhar e o que significa.</figcaption></figure>
```
Use `fill="var(--accent)"` / `stroke="var(--line2)"` para seguir o tema.

## 4. Quadros de texto

| Classe | Uso | Limite |
|---|---|---|
| `.em1min` | 3 linhas na abertura | 1 por aula (obrigatório) |
| `.calma` | "Se travou aqui, é normal" + saída | ≥1 por aula |
| `.qerr` | erro comum real | ≤1 por aula |
| `details.mais` | "Quer saber mais?" — nuance, analogia extra | ≤2 por aula |
| `.quiz` | teste-se com feedback | 1 em aula de fundamento |
| `.cola` | síntese de 3 itens no fecho | 1 por aula (obrigatório) |

Estrutura da `.cola`:
```html
<div class="cola"><p class="k">Cola da aula</p><h3>Nome curto</h3>
  <ol><li><span><b>Item</b>explicação em 1 linha.</span></li>…(3 itens)</ol></div>
```

## 5. Movimento e impressão

Transições curtas (≤250ms), sem bounce/confete. `prefers-reduced-motion` desliga tudo.
Impressão: esconde barra, painéis e botões; mostra todos os casos das telas.
