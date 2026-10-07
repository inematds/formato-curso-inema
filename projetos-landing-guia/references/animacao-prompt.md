# Molde de prompt para animação de site

Pedir "faz um rodapé animado bonito" dá um resultado genérico. Este molde faz a IA entregar uma peça
com acabamento profissional: você descreve **a aparência**, **o movimento passo a passo** e **as regras
técnicas**. Use com Claude, Codex ou qualquer modelo que escreva código.

## O molde

```text
Construa <O QUE É, em uma frase: a peça + o que a pessoa faz com ela>.

Aparência:
- Fundo, cores e tipografia com valores exatos (hex, fonte, peso, tamanho relativo).
- Layout: onde fica cada bloco e quanto da área ele ocupa (%).
- Detalhes que dão personalidade (contorno, sombra, textura, ícones).

Movimento:
1. <O que acontece ao entrar na tela> — duração em ms, ordem, atraso entre itens.
2. <O que acontece quando a pessoa interage> — passar o mouse, clicar, arrastar, teclar.
3. <A resposta física> — mola, quique, inércia, o "peso" das coisas.
4. <O estado final / de repouso>.
5. Modo demonstração: até alguém tocar, um cursor fantasma demonstra a interação sozinho.

Regras:
- JavaScript puro e CSS, sem biblioteca (ou: "<biblioteca> só para <função>").
- Um único loop requestAnimationFrame, pausado quando a peça sai da tela (IntersectionObserver).
- Animar só transform e opacity; limitar devicePixelRatio a 2 em canvas.
- Nunca capturar a rolagem da página; atalhos de teclado só com a peça em foco ou sob o mouse.
- Acessível: elementos reais (button, a, input) com foco visível; teclado faz o mesmo que o mouse.
- prefers-reduced-motion: mostrar o estado final, parado (descreva qual é).
- Um arquivo HTML autocontido.
```

## Por que cada parte importa

| Parte | Sem ela | Com ela |
|---|---|---|
| Aparência com valores exatos | cores e fontes "padrão de IA" | a peça já sai com a cara da marca |
| Movimento numerado com tempos | animação vaga, rápida demais ou lenta demais | ritmo intencional, fácil de ajustar ("passo 2 mais lento") |
| Modo demonstração | ninguém descobre que dá para interagir | a peça se explica sozinha e vira vídeo sem esforço |
| Pausar fora da tela | página pesada, bateria gasta | custo zero quando ninguém está vendo |
| Não capturar rolagem | a página "trava" quando o mouse passa por cima | a peça convive com o resto do site |
| Movimento reduzido | quem tem enjoo de movimento sofre | todos veem o conteúdo |

## Como ajustar depois

Peça mudanças pelo número do passo: "no passo 1, atraso de 80 ms em vez de 120", "no passo 3, menos
quique". A estrutura numerada vira um painel de controle.

## Exemplos

Cinco prompts reais escritos com este molde (e as peças que geraram): https://github.com/inematds/inema-motion-lab/tree/main/pecas
