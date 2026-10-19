# CHANGELOG — formato-curso-v72

## 7.2.0 — 19/10/2026
- Skill criada a partir do curso `do-chat-ao-agente-v72` (primeiro curso v7.2, publicado 18/10/2026).
- Motor: `gerar.py` igual ao do curso; `validar.py` lê a própria URL do `curso.json` (antes fixa) e passa a exigir `capa.jpg`, `hero/inicio.jpg` e `hero/<slug>.jpg`.
- Novos: `scripts/novo-curso.sh` (cria curso a partir do motor), `scripts/conferir-tela.cjs` (HTTP local, 1366 e 390 px, transbordo, diagrama, quiz, erros JS, capturas).
- Referências: `ESQUEMA.md`, `LICOES.md`; exemplos de aula reais em `examples/`.

## 7.2.1 — 19/10/2026
- `v71.js`: o `.ics` do gerador de plano sai como `plano-<id-do-curso>.ics` (antes fixo `plano-do-chat-ao-agente.ics`; achado no curso de Filas).
- SKILL.md: capa aceita 1400×788 (padrão do v72).

## 7.3.1 — 19/10/2026
- EN/ES: `gerar.py --lang` grava em `en/`/`es/` com os arquivos da raiz (`ativo()`), seletor PT · EN · ES no topo, `hreflang`, og:image e fotos por idioma quando existirem (`capa-en.jpg`), progresso separado por idioma.
- Novo `scripts/traduzir.py` (Codex da assinatura, por texto, com validação e cache).
- `conferir-tela.cjs` abre também `en/` e `es/` e acusa imagem quebrada; `validar.py` ignora links para o próprio site em qualquer idioma.
- Topo: nome do curso encurta com reticências em vez de passar por baixo dos botões.

## 7.4.1 — 19/10/2026
- `traduzir.py`: tradução pelo **Sonnet 5.5 da assinatura** (`claude -p --model claude-sonnet-5-5`, sem ferramentas) como padrão; `--motor codex` mantém o caminho antigo. Remove `ANTHROPIC_API_KEY` do ambiente do subprocesso (nunca API).
- `traduzir.py --publico "..."`: o público do pedido de tradução deixa de ser fixo no do-chat-ao-agente.
- `sec_video`: pôster também usa a versão por idioma quando existir (`seq1-oswork-en.jpg`).
