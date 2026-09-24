# TESTE-HUMANO.md — o olhar humano, simulado e real

## 1. Leitor simulado (obrigatório, uma rodada por aula)

Dispare um subagente por aula (ou um para 2–3 aulas) com este pedido, anexando as capturas de tela
do celular (390px) e o texto da aula:

> Você é **[persona]**, [idade], [profissão-alvo]. Usa WhatsApp, e-mail e às vezes um chat de IA; nunca
> programou. Está no celular, no intervalo, com 15 minutos. Leia a aula abaixo como essa pessoa.
> Para CADA step responda: (a) **5 segundos** — olhando só a figura e o rótulo, qual é a ideia? acertou?
> (b) onde você **travou** (palavra, frase, passo) e por quê; (c) o que você **pularia**.
> Depois: (d) você conseguiria fazer a prática agora, sem ajuda? o que faltaria? (e) a promessa da aula foi
> cumprida? (f) nota de 0 a 10 para "entendi e consigo usar" e a UMA mudança que mais subiria essa nota.
> Seja franca: elogio vago não ajuda.

Rode com **duas personas diferentes** no curso (uma de cada profissão-alvo; idades distantes, ex.: 34 e 58).
Todo "travei" vira correção; toda nota <9 volta para ajuste. Registre o resumo em `context/leitor-simulado.md`.

## 2. Teste humano (quando houver 2–3 pessoas iniciantes de 30+)

- **Onde:** no celular da pessoa, no lugar onde ela estudaria. **Duração:** 15–20 min por pessoa.
- **Como:** entregue só o link da aula 1. Peça para ela pensar em voz alta. Não ajude; anote.
- **Anote:** onde parou ou voltou; o que tocou esperando outra coisa; o que pulou; se chegou ao "concluir aula";
  quanto tempo levou até a primeira vitória (a prática funcionando).
- **5 perguntas no fim:** 1) Em uma frase, o que você aprendeu? 2) Qual parte foi mais clara? 3) Onde travou?
  4) Faria a próxima aula? Por quê? 5) De 0 a 10, quanto isto ajuda no seu trabalho?
- **Critério de sucesso do formato:** 2 de 3 pessoas concluem a aula 1 e fazem a prática sem ajuda,
  em ≤20 min, e respondem a pergunta 1 corretamente.

Registre em `context/teste-humano-AAAA-MM-DD.md`: pessoas (profissão e idade, sem nome), observações, e as mudanças feitas.
