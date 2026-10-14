# 05 — Stack e Contratos de Integração

> Contratos descritos em prosa/tabelas. O agente implementador lê isto + a doc oficial do serviço no dia da implementação.

## Stack travada
Next.js (App Router, TS strict) · Tailwind · Supabase (Auth, Postgres, RLS) · Vercel (host + Cron) · **AbacatePay** · Resend · Telegram Bot API · Cloudflare Turnstile · Zod · Vitest · Playwright. (Detalhes da cobrança: `07-monetizacao-abacatepay.md`.)

## 1. Querido Diário (`lib/ingestion/queridodiario` — ÚNICO ponto de acesso)
Base: `https://api.queridodiario.org.br` — OpenAPI em `/openapi.json`. Leitura sem auth.

| Uso | Endpoint | Contrato |
|---|---|---|
| Listar cobertura | `GET /cities?city_name=` | alimenta autocomplete e a página `/cobertura`. Campo `level` ≥ 1 = tem fonte; `level 3` = mais ativo |
| Buscar matches | `GET /gazettes` | params: `querystring`, `territory_ids[]`, `published_since`, `published_until`, `size`, `offset`, `sort_by=relevance`, `excerpt_size≈500`, `number_of_excerpts≈3` |
| Health | `GET /health` | checar antes do job; se down, abortar e logar em `scan_runs.errors` |

### Regras de ouro (validadas na auditoria de 2026-10-13)
1. **Nunca** query com nome completo entre aspas (timeout ~30s). Construir `querystring` com **2–4 termos fortes**: prenome + 1–2 sobrenomes mais raros. Ex.: "João Carlos da Silva" → `João Silva` é fraco; `Marivaldo Bittencourt` é forte. Heurística: preferir sobrenomes menos comuns (lista de stopwords de nomes comuns: Silva, Santos, Oliveira, Souza…).
2. **Sempre paginar:** resposta capa `total_gazettes` em 10.000; usar `offset`/`size` até esgotar ou atingir teto razoável por watchlist (100 resultados/dia).
3. **Janela de tempo:** `published_since = última varredura - 1 dia` (sobreposição intencional; o dedup protege). Evita perder diário que atrasa a indexação.
4. **Timeout/retry:** chamada >20s = abortar, logar, retry com backoff simples no próprio run (máx. 2). Falha de território não derruba os demais.
5. **Score do match:** começar simples e determinístico: match no nome completo normalizado (sem acentos, caixa baixa) dentro do excerpt = alerta direto; match parcial (só termos da query) = alerta marcado "possível homônimo" se CPF parcial não aparecer no excerpt. Sem ML.
6. **Atribuição:** link para Querido Diário no rodapé (boa relação com a OKBR + transparência).

### Estado de cobertura (sync)
- Tabela/vista de territórios cobertos = sync semanal do `/cities` (cron separado), gravando `territory_id`, nome, UF, level. Tela `/cobertura` e o autocomplete leem **essa cópia local**, não a API ao vivo (latência + gentileza com a API).

## 2. Resend (e-mail)
- API REST direta (sem SDK, padrão Dozena): post de `{from, to, subject, html}` com `RESEND_API_KEY`.
- Templates PT-BR listados no doc 03 §8.
- E-mail de **confirmação de waitlist** é obrigatório (double opt-in — qualidade da lista + reputação do remetente).

## 3. Telegram Bot
- Criar bot via BotFather; token em `TELEGRAM_BOT_TOKEN`.
- Vínculo: usuário logado gera link `t.me/<bot>?start=<token-opaco>`; webhook/endpoint `/app/api/telegram` recebe `/start <token>` e grava `telegram_chat_id` em `profiles`.
- Envio: `sendMessage` simples com excerpt + botão inline com o `pdf_url`.
- Falha de Telegram **nunca** impede o e-mail (e vice-versa): dois envios independentes.

## 4. Cloudflare Turnstile
- Todo formulário público (waitlist, "avisar quando cobrir", login magic link) renderiza o widget e valida o token server-side (mesmo padrão da Dozena — smoke test existente lá como referência).

## 5. Vercel Cron
- `vercel.json` agenda `app/api/cron/scan` 1x/dia (06:00 UTC ≈ madrugada BR, pós-indexação do QD) e `sync-cities` semanal.
- Rotas protegidas por `CRON_SECRET` (header Authorization).

## 6. Env vars (criar `.env.example` com esta lista)
`NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `SUPABASE_SERVICE_ROLE_KEY` · `RESEND_API_KEY` · `EMAIL_FROM` · `TELEGRAM_BOT_TOKEN` · `NEXT_PUBLIC_TURNSTILE_SITE_KEY` · `TURNSTILE_SECRET_KEY` · `ABACATEPAY_API_KEY` · `ABACATEPAY_WEBHOOK_SECRET` · `CRON_SECRET` · `NEXT_PUBLIC_SITE_URL`
