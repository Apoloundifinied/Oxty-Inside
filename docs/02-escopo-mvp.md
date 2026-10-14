# 02 — Escopo do MVP (Fase 1)

> O MVP só começa depois da Fase 0 bater o piso (CONTEXT §11). Este doc define o que entra e — mais importante — o que NÃO entra.

## 1. Entra no MVP
| # | Funcionalidade | Notas de aceite |
|---|---|---|
| 1 | Cadastro/login | Supabase Auth, magic link por e-mail (sem senha = menos suporte) |
| 2 | Checkout Cakto (ADR-012) | 2 planos: mensal R$ 9,90 e anual R$ 49. PIX em destaque. Webhook ativa a assinatura (ver `07`) |
| 3 | CRUD de watchlist | Nome completo, CPF parcial, órgão (texto livre), municípios via autocomplete da API `/cities`. Máx. 3 por usuário |
| 4 | Validação de cobertura no cadastro | Se o município não está na API, o usuário é avisado **antes de pagar** e entra numa "lista de espera de cobertura" (ver §3) |
| 5 | Job diário | Vercel Cron 1x/dia. Para cada watchlist: consulta a API do QD com 2–4 termos fortes, território e janela desde o último scan |
| 6 | Match + dedup | Score mínimo + hash SHA-256 (território+data+excerpt) impede alerta repetido |
| 7 | Alerta | **Só e-mail (Resend)** — ADR-013. Conteúdo: trecho, data, edição, município, link PDF oficial, botão "ver diário" |
| 8 | Painel | Watchlists ativas, assinatura (status/renovação), últimos matches, histórico simples |
| 9 | Página "O que cobrimos" | Lista pública e pesquisável dos municípios cobertos (gerada da API) — linkada de tudo |
| 10 | Disclaimers | "Não é assessoria jurídica", "cobertura parcial", em rodapé, checkout e alertas |

## 2. NÃO entra no MVP (não negociável sem ADR)
- ❌ Diários estaduais e DOU
- ❌ Trial grátis
- ❌ Confirmação "é meu/não é" e calibração (Fase 2)
- ❌ Resumo semanal "0 matches" (Fase 2)
- ❌ App, push, WhatsApp Business
- ❌ Busca histórica retroativa (o job só olha "de hoje em diante"; usuário assina e passa a ser coberto — dizer isso na copy!)
- ❌ Admin dashboard sofisticado (consultas SQL no Supabase bastam)
- ❌ Qualquer IA

## 3. Caso de borda decisivo: município não coberto
É o caso mais comum (contexto: ~800 de 5.570). O MVP trata assim:
1. Usuário escolhe município ≠ coberto → UI avisa na hora: "Ainda não monitoramos este diário".
2. Botão: **"Avisar quando cobrir"** → salva em `coverage_waitlist` (município + e-mail), sem cobrar.
3. Essa tabela vira métrica de expansão **e** argumento para pedir cobertura/contribuir com o Querido Diário.
4. Nunca vender assinatura para município não coberto. Nunca.

## 4. Critérios de aceite do MVP (DoD)
1. Pessoa real paga via PIX (Cakto em produção) e o webhook marca a assinatura ativa.
2. Pessoa cadastra watchlist de município coberto.
3. No dia seguinte ao menos um scan rodou (log visível); se houve match falso/verdadeiro, alerta chegou por e-mail sem duplicar.
4. "O que cobrimos" pública e atualizada.
5. Build + vitest + playwright verdes; migration aplicada; CONTEXT §12 atualizado.
