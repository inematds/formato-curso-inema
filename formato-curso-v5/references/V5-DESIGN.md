# V5-DESIGN.md — Design language da v5 (herda v4 + estende o repertório)

> **Dono único de:** tokens/temas (herdados, intocados), cor documentada, ícones (set fechado ≤10), registros visuais (diagrama×metáfora + repertórios), anti-poluição, visual do painel D-09, motion, nota mínima de print (D-08). **SEMPRE leia também `formato-curso-v4/references/V4-DESIGN.md`** — os tokens, a tipografia e a arquitetura do blend (cold-open + corpo de margem viva) são herdados sem alteração; este documento só acrescenta o que é novo na v5.
>
> **5 decisões visuais da Fase 7 (DV-1..5), respeitadas integralmente:** DV-1 (registros separados) · DV-2 (`.qapply` ≥2 profissões) · DV-3 (ícones ≤10) · DV-4 (âmbar nunca "resposta errada") · DV-5 (painel v4 = teto de lúdico aceitável).

---

## 1. Tokens e temas — herdados, zero alteração

Os tokens de cor (ink `#0E0D14` / creme `#ECE6D9` / acento água-menta `#7CE0C6` / âmbar `#F2B45C`), os 3 temas (dark default, papel, sépia), a tipografia (Newsreader serif / Inter sans / Space Mono) e a escala/ritmo são os mesmos do v4, **sem nenhuma variação**. A v5 não reabre o ciclo de identidade visual (D-02 — decisão humana aprovada: "evoluir o dark editorial v4, é marca já aprovada"). Toda regra nova deste documento **usa** os tokens existentes — nunca declara cor nova solta.

## 2. Cor documentada (o que cada cor SIGNIFICA)

- **Água-menta (`--accent`) = positivo / OK / conclusão.** É a cor de "certo" em todo o sistema: opção certa do quiz, progresso, cartão em dia, botão de ação primária.
- **Âmbar (`--warm`) = atenção, nunca "resposta errada".** Herdado do v4 (só figuras/segundo destaque, nunca texto de corpo) — a v5 acrescenta a regra **DV-4**: âmbar **não** pode representar a opção errada de um quiz nem qualquer estado de "falha". Motivo: sobrecarregaria semanticamente a mesma cor que já significa "erro comum" (`.qerr` usa o registro âmbar de atenção) — um aluno que vê âmbar não deve ter que decidir se é "isto é um erro de conteúdo que estou estudando" ou "você errou a pergunta". O quiz usa vermelho suave (`#E0736F`, já definido em `aula.css` `.opt.wrong` do v4) para errado — mantido sem mudança.
- **Verde-escuro nos temas claros (achado A0-7, já é comportamento nativo dos tokens v4):** nos temas papel (`--accent:#0F7A61`) e sépia (`--accent:#0F6E58`), o próprio token de acento **já** troca para um verde-escuro — não é uma regra nova da v5, é a consequência natural de reaproveitar os tokens do v4 sem alteração. Documentado aqui só para que um agente futuro não tente "corrigir" isso achando que é inconsistência.
- **Nunca informação só por cor.** Todo estado que usa cor (certo/errado do quiz, concluído/pendente da trilha, `.qerr`/`.qbefore-after`) tem também um rótulo textual ou um ícone (§3) — daltonismo e impressão P&B não podem perder informação.

## 3. Ícones — set fechado, ≤10, papéis nomeados (DV-3)

Todos CSS-only (sem raster, sem biblioteca de ícones externa), no mesmo espírito visual do resto do sistema (formas simples, geométricas, mono-peso, cor semântica via `currentColor` ou tokens). Nunca decorativos — cada um tem um papel funcional único:

| # | Ícone | Papel | Onde aparece |
|---|---|---|---|
| 1 | **fundamento** | marca step/bloco como conceito estável | badge no `<h2>` do step, `data-kind="fundamento"` |
| 2 | **ferramenta** | marca step/bloco como dependente de interface volátil | badge no `<h2>` do step, ao lado do carimbo `data-versao` |
| 3 | **modo prompt** | indica prática tipo "colar num chat de IA" | `.practice[data-mode="prompt"] .pk` |
| 4 | **modo tarefa** | indica prática tipo "faça no seu trabalho" | `.practice[data-mode="tarefa"] .pk` |
| 5 | **modo análise** | indica prática tipo "leia o caso e decida" | `.practice[data-mode="analise"] .pk` |
| 6 | **modo código** | indica prática técnica (herança v4) | `.practice[data-mode="codigo"] .pk` |
| 7 | **concluída** | estado positivo, reforça sem festejar | card de aula na trilha, painel D-09 |
| 8 | **em andamento** | estado neutro de progresso parcial | card de aula na trilha |
| 9 | **pendente-neutro** | estado neutro de "ainda não começou" — nunca "atrasado"/"faltando" | card de aula, revisões pendentes do painel |
| 10 | **psafe** | marca visual do bloco de reassurance | dentro de `.practice`, antes do texto de `.psafe` |

**Regra de contenção:** este set está fechado em 10. Um 11º ícone proposto exige remover um existente (mesma regra AD-7 dos componentes de conteúdo) — o objetivo é manter o repertório visual pequeno e memorizável, não crescer sem limite.

## 4. Registros visuais — metáfora × diagrama, nunca híbridos (DV-1)

A v5 formaliza **dois registros visuais distintos e nunca misturados** (achado L9, Fase 3: o v4 já executa bem o registro diagrama-de-mecanismo, mas não tem um segundo registro para leigos):

- **Registro diagrama-de-mecanismo** (herdado do trilho vivo do v4) — vive **só no trilho** (`.figstage`/`.fig`) e nas figuras conceituais por step. É abstrato, funcional, explica "como o mecanismo funciona por dentro" (setas, caixas, engrenagens conceituais, medidores). **Nunca** aparece no cold-open.
- **Registro metáfora-do-mundo-real** — vive **só no cold-open** (`.herofig`) e em figuras inline da coluna quando servirem de âncora. É concreto, do cotidiano do profissional (um estagiário recém-chegado, um molde de costura, uma gaveta de ferramentas). **Nunca** aparece no trilho.

**Por que nunca misturar:** um único visual tentando ser os dois ao mesmo tempo (ex.: um "robô com engrenagens girando dentro do peito, vestido de estagiário") não cumpre nenhum dos dois papéis direito — não ensina o mecanismo com precisão nem ancora emocionalmente no mundo real. Mantenha os registros em locais fixos da página; a separação espacial (cold-open vs. trilho) já impõe a separação de registro por construção.

**Zero itens da lista proibida de metáfora:** robô humanoide, cérebro-circuito, matrix-rain (chuva de código), aperto de mão humano-robô — são os clichês visuais de IA que não passam no "teste de metáfora" (um profissional de 50 anos se reconhece nessa imagem? não, se reconhece num estagiário, numa gaveta de ferramentas, num molde de costura).

**Repertório de metáforas candidatas** (adaptar ao tema do curso, nunca copiar verbatim entre cursos): estagiário novo que não conhece a empresa · molde de costura reutilizável · gaveta de ferramentas organizada · receita de bolo com variações · assistente que precisa de contexto para ajudar bem · caderno de receitas de família · placa de sinalização num caminho conhecido. Banco completo de analogias por profissão vive em `EXEMPLOS-PROFISSOES.md`.

## 5. Anti-poluição — réguas que medem coisas diferentes, nunca se substituem

Três réguas numéricas independentes, todas obrigatórias ao mesmo tempo (nenhuma dispensa a outra):

1. **Teto de dosagem** (`RETENCAO-V5.md`) — quantos *tipos* de mecanismo de fixação por aula (≤5).
2. **Densidade visual** — quantos quadros funcionais por *posição* (`≤1 a cada 2 steps`, nunca 2 colados sem prosa entre eles). Uma aula pode respeitar o teto de dosagem inteiro (≤5 tipos) e **ainda assim** violar a densidade se os poucos tipos escolhidos se concentrarem nos mesmos 2 steps (achado real, Fase 9-T3: piloto com 4 quadros funcionais empilhados em 4 steps, mesmo com o pool tecnicamente dentro do teto).
3. **≥60% de prosa por seção** — quanto do step é texto corrido vs. blocos/quadros, medido por proporção de caracteres, não por contagem de blocos.

**Regra prática de verificação:** ao terminar uma aula, percorra os steps em ordem e marque onde cada quadro funcional cai. Se dois caírem em steps adjacentes (ex.: fim do step 3 e início do step 4) sem um step de prosa pura entre eles, a densidade violou — mesmo que a contagem total esteja dentro do teto.

## 6. Visual do painel D-09 (jornada estendida)

O painel de jornada do v4 **já é** o teto do que é aceitável de "lúdico" nesta linha visual (DV-5) — não adicionar nada acima dele. Guardrails visuais:

- **Serifa grande para números** (o mesmo `.stat` do v4: `font-family:var(--serif); font-size:30px`), **mono para labels** (`.lbl`) — nunca ícone decorativo do tipo troféu/medalha/confete/mascote.
- **1 barra fina única** por métrica (`.pbar`, já existente) — nunca anel de progresso, nunca múltiplas barras competindo por atenção na mesma tela.
- Revisões pendentes: teto de exibição **"9+"** (nunca um número de 3 dígitos alarmando o aluno) e tom textual acolhedor ("sem pressa — N esperando por você"), nunca urgência ("VOCÊ TEM 47 PENDÊNCIAS!").
- Progresso em **capacidade**, não em métrica abstrata: mostrar "o que você já consegue fazer" (as promessas das aulas concluídas, em lista) pesa mais para o aluno do que "62% concluído".
- Síntese de fim de trilha: 1–2 frases em prosa serifada, no mesmo tom do resto do sistema — nunca uma tela de "parabéns" separada com estética de conquista.

## 7. Motion — herdado sem alteração

Os tokens e regras de movimento do v4 (durations 250–600ms, easing suave, tipos permitidos: drift do fundo, cross-fade do trilho, breathe sutil, reveal fade+rise; proibido bounce/rotate/scale/confete/streak/parallax pesado) valem integralmente. Nenhum componente novo da v5 introduz motion novo — todos são HTML+CSS estáticos, sem animação própria além do que os tokens já definem (ex.: hover states usam as mesmas transições do v4).

`prefers-reduced-motion: reduce` zera/encurta tudo e preserva o estado final — regra herdada, sem exceção para os componentes novos.

## 8. Nota mínima de print (D-08 — adiado como melhoria futura)

**Obrigação mínima, não suporte real:** o CSS não pode quebrar **grosseiramente** ao imprimir — nenhuma sobreposição ilegível de texto, nenhum corte de conteúdo essencial no meio da página, cor de texto que não vire ilegível em fundo branco de impressora. Isso é satisfeito por uma regra `@media print` simples que esconde elementos de chrome/interação (barra, painéis, botões) e força texto escuro sobre fundo claro — nada além disso. Suporte de paginação, quebra de página cuidadosa ou PDF dedicado ficam fora de escopo (projeto futuro separado, conforme D-08).

## 9. Zero-raster (D-01 — herdado)

Motion e figuras em CSS/SVG inline, sem exceção no corpo da aula. Raster (PNG/JPG) é permitido **apenas** em hero de landing, com regra de peso (<200KB) e licença aberta registrada — nunca em curso comercial do INEMA.PRO com modelo non-commercial (ex.: FLUX klein/dev). Ver `EXEMPLOS-PROFISSOES.md` e SKILL.md §17 herdado da spec para o detalhe de licenciamento.
