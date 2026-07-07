# CHECKLIST-V5.md — Checklist expandido, greps prontos, auditoria anti-clone e o manifesto de completude

> **Dono único de:** o checklist-portão expandido com "como verificar" objetivo por item, a auditoria anti-clone passo a passo, os testes de escaneamento/metáfora/persona, e o **template verbatim + grep do manifesto de completude** (§15.1 da spec normativa). O SKILL.md carrega o checklist-portão resumido e a regra do manifesto; este documento tem o detalhe executável.
>
> **Ressalvas do gate humano final (2026-07-06) incorporadas neste documento:** a Fase 9 tentativa 3 (último teste antes da aprovação) encontrou 3 achados residuais não-bloqueantes que este checklist já nasce corrigindo — ver §4 (ambiguidade de notação do manifesto), §6 (`.gterm` sem cobertura auditada) e a nota de escopo no fim de §3 (o manifesto não substitui o resto do checklist).

---

## 1. Checklist técnico herdado (12 itens da v4 — não regredir)

Verificação idêntica à `formato-curso-v4/SKILL.md` §"Checklist de aceitação": cold-open cabe em ~1 tela · corpo lê calmo (≤60ch, serifa) · trilho troca a fig certa por seção + mapa nomeado · progresso instantâneo na trilha · teste-se com feedback elaborado · grifo→cartão→revisão espaçada · pratique-agora verificável · reflexão por seção salva · recap dispara revisão · prefs/glossário/onboarding/mapa/atalhos/a11y ligados · AAA nos 3 temas · offline em `file://`.

## 2. Checklist pedagógico — como verificar

| Item | Como verificar (grep/leitura) |
|---|---|
| `.promise` verificável em 100% das aulas | `grep -c 'class="promise"' curso.html` = número de aulas; leitura confirma que cada uma é uma frase de ação observável, não vaga |
| `data-tempo` 100% dos views + tempo no `.pgoal` 100% | `grep -o 'data-tempo="[^"]*"' curso.html` conta = nº de views de aula; `grep -c 'class="pgoal"' curso.html` = nº de práticas, e cada `.pgoal` contém um tempo por leitura |
| `.psafe` em 100% dos `.practice` | `grep -c 'class="practice"'` = `grep -c 'class="psafe"'` |
| Zero jargão-sentinela sem tratamento | `grep -iE 'JSON|terminal|\bGit\b|reposit[óo]rio|commit|branch|pipeline|arquivo de configura|instalar|\bscript\b|servidor|\bAPI\b|deploy|\bCLI\b|diret[óo]rio|plugin|encoding' curso.html` — cada ocorrência exige leitura ao redor confirmando definição-com-analogia ou que é rótulo literal de UI, não conceito explicado sem tradução |
| Rampa de acesso antes de artefato técnico opaco | leitura: toda vez que aparecer `<pre>`/print de tela/config, a frase imediatamente anterior traduz para o mundo do leitor |
| Analogia profissional + exemplos citam profissões da descoberta | grep pelos nomes das profissões registradas no metadado de descoberca; cada conceito abstrato tem 1 analogia nomeada |
| **Exemplo por profissão em 100% dos steps** | contar `<section class="step"` e contar ocorrências do padrão de exemplo (ex.: marcador `[exemplo-profissão:` ou equivalente no template) — os dois números devem bater |
| Prática sem terminal quando público não-dev | leitura + teste de persona (§5) |
| Regra de clímax | `grep -oE '[😀-🙏🌀-🗿🚀-🛿☀-➿]' curso.html` (varredura de emoji) nos blocos de fecho + leitura dedicada dos 3 pontos de clímax (fim de prática/aula/trilha) — zero ocorrência e zero `!!` |

## 3. Fixação — manifesto de completude (PORTÃO DURO, template verbatim)

**Formato emitido (obrigatório, um por aula, dentro do view daquela aula):**

```html
<!-- COMPLETUDE aula-N | tipo=FUNDAMENTO|FERRAMENTA|PRATICA | steps=K
  [OK] promise            .promise no cold-open (1)
  [OK] why                .why após a promessa (1)
  [OK] tempo              data-tempo no view + render no cold-open (1)
  [OK] exemplo-profissao  exemplo aplicado em 100% dos steps (K/K)
  [OK] apoio-visual       figura conceitual legendada em 100% dos steps (K/K)
  [OK] practice           .practice[data-mode] (exatamente 1)
  [OK] psafe              .psafe dentro da prática (1)
  [OK] pgoal-tempo        .pgoal com tempo declarado (1)
  [OK] recap-autor        .recap-autor no fecho (1)
  [OK] next-action        .next-action no fecho (1)
  [OK] cards              <script id="cards-N"> presente (1)
  [OK] anti-duplicacao    §11.3 — 3 testes passam (substring / forma / operação)
  [OK] teste-se-FUND      SE tipo=FUNDAMENTO: ≥1 quiz data-fb  | SE não-FUNDAMENTO: N/A
-->
```

**Grep de auditoria:** `grep -c '<!-- COMPLETUDE aula-' curso.html` = número de aulas (1 manifesto por aula, nunca 0, nunca 2). `grep -c '\[AUSENTE\]' curso.html` **deve ser 0** — qualquer ocorrência é reprovação automática em Fixação, e a própria linha nomeia o item ausente.

**⚠️ Nota crítica sobre o item condicional `teste-se-FUND` (ressalva do gate humano final, achado da Fase 9-T3):** em 2 de 3 pilotos testados, o marcador `[OK]` foi usado incorretamente em aulas FERRAMENTA que tinham um teste-se **opcional** presente — a regra correta é: **o marcador da linha reflete a OBRIGAÇÃO, não a presença.** Se `tipo=FUNDAMENTO`, o teste-se é obrigatório e a linha correta é `[OK]` (presente, cumpre a obrigação) ou `[AUSENTE]` (falta, reprova). Se `tipo` é FERRAMENTA ou PRÁTICA/INTEGRAÇÃO, a obrigação **não existe** — a linha correta é sempre `[N/A]`, **mesmo que a aula tenha, por vontade própria, um teste-se opcional presente**. Escreva o fato do teste-se opcional como texto livre depois do marcador, nunca troque o marcador em si:

```
  [N/A] teste-se-FUND     aula é FERRAMENTA (obrigação não se aplica); teste-se opcional presente (1 pergunta)
```

Nunca:
```
  [OK] teste-se-FUND      SE tipo=FUNDAMENTO: N/A (aula é FERRAMENTA) | teste-se opcional presente (1 pergunta)   ← ERRADO, marcador não pode ser [OK] fora de FUNDAMENTO
```

**Nota de escopo (a mesma ressalva, generalizada):** o manifesto cobre só os 13 itens de espinha+Fixação — ele **não** audita densidade visual, dosagem do pool, jargão-sentinela ou qualquer outro item do checklist técnico/visual/pedagógico. Achado real (Fase 9-T3): um piloto declarou conformidade de densidade visual num checklist livre de fim de documento, mas a densidade real violava o teto — o manifesto §15.1, sendo uma lista fechada e auditada item a item, não cometeu esse erro nos mesmos pilotos; a autoavaliação livre (fora do manifesto), sim. **Conclusão prática: aplique a mesma disciplina do manifesto (conferir contra o conteúdo real, nunca apenas declarar) a TODO o checklist, não só aos 13 itens formais.**

## 4. Fixação — demais itens do portão duro

- Pool dosado ≤5 por aula (contagem por tipo, `RETENCAO-V5.md` §3); espinha estrutural completa em 100% das aulas.
- Aula FUNDAMENTO tem ≥1 teste-se (`data-fb`) — item autônomo, não embutido só na contagem da matriz.
- Anti-duplicação recap↔cartão — os 3 testes de `RETENCAO-V5.md` §6.3 (substring/forma/operação). Qualquer falha ⇒ reprova em Fixação.

## 5. Visual — como verificar

- **Teste de escaneamento:** cronometrar (ou simular) achar "erro comum" e "resumo" de qualquer aula em <30s — se depender de ler a aula inteira para achar, falhou.
- **Legenda-que-ensina 100%:** toda figura tem `data-cap`/`figcaption` que diz o que olhar e o que significa, não só um título decorativo.
- **Apoio visual por step 100% (contável):** `grep -o 'data-fig="[0-9]*"'` no trilho deve cobrir o mesmo intervalo do número de steps da aula.
- **Teste de metáfora:** para cada metáfora usada, perguntar "um profissional de 50 anos se reconhece nesta imagem?" — zero item da lista proibida (robô humanoide, cérebro-circuito, matrix-rain, aperto de mão humano-robô).
- **Registros separados (DV-1):** grep visual/leitura confirmando que nenhuma figura do trilho usa linguagem de metáfora-do-mundo-real e vice-versa.
- **Densidade ≤1 quadro funcional/2 steps:** contar `.qerr`+`.qbefore-after`+`.qapply`+`.qsteps`+`.qanchor` por aula e mapear a posição de cada um contra os steps — não bastam os números totais, confira também a posição (ver `V5-DESIGN.md` §5).
- **`.qapply` ≥2 profissões:** `grep -A5 'class="qapply"'` e contar nomes de profissão distintos dentro do bloco — menos de 2 é falha.

## 6. `.gterm` — cobertura do glossário (item herdado do v4, auditoria explícita)

**Ressalva do gate humano final (achado Fase 9-T3):** um piloto testado não usou `.gterm` nenhuma vez em todo o curso — item herdado do contrato v4 (glossário sob demanda para reforço de jargão de domínio) que nenhum manifesto formal cobria até agora. **Verificação obrigatória a partir desta versão do checklist:** `grep -c 'class="gterm"' curso.html` deve ser ≥1 sempre que houver jargão de domínio no curso (o que é quase sempre — todo curso tem ao menos 1 termo específico do assunto). Zero `.gterm` num curso inteiro é sinal de alerta: ou o curso não tem nenhum jargão de domínio (raro) ou o reforço de glossário foi esquecido.

## 7. Auditoria anti-clone — passo a passo

1. Liste a sequência de blocos do curso novo (ordem de componentes por aula: quais quadros, em que steps).
2. Liste a mesma sequência do último curso gerado (se existir).
3. Compare: se a sequência de tipos de quadro e a ordem dos opcionais forem idênticas entre os dois cursos, é sinal de clonagem estrutural.
4. Compare os exemplos por profissão: se as mesmas situações (não só as mesmas profissões, mas a mesma situação narrativa) aparecerem nos dois cursos, é sinal de clonagem de conteúdo.
5. Se a similaridade for alta em (3) ou (4): regenere variando a ordem dos opcionais escolhidos e trocando as situações dos exemplos (mantendo as profissões do protocolo de descoberta, que são do curso atual, não do anterior).
6. Verifique zero placeholder ("imagine uma empresa X") e máx. 1 exemplo verbatim do banco `EXEMPLOS-PROFISSOES.md` por curso.

## 8. Teste de persona — como aplicar

Para cada prática e cada trecho técnico opaco, pergunte: **"a gestora de 52 anos, sem base técnica, sem tempo sobrando, completa isto sem travar?"** Leia o trecho como se fosse a primeira vez que essa pessoa vê um chat de IA ou uma tela de automação. Se a resposta depende de conhecimento prévio não ensinado no próprio curso, ou de um passo tecnicamente opaco sem rampa de acesso antes, o trecho falha o teste de persona — mesmo que passe todos os greps automatizados.

## 9. Processo — checklist final antes de entregar o curso

- [ ] Protocolo de descoberta respondido ANTES da geração, registrado como metadado/comentário no curso.
- [ ] Auditoria anti-clone (§7) executada contra o último curso gerado (se existir).
- [ ] Manifesto de completude (§3) emitido em CADA aula, zero `[AUSENTE]`, notação `teste-se-FUND` correta (§3, nota crítica).
- [ ] Checklist técnico herdado (§1), pedagógico (§2), Fixação (§3–4), visual (§5–6) todos conferidos **contra o conteúdo real**, não apenas declarados — a mesma disciplina do manifesto se estende ao documento inteiro.
