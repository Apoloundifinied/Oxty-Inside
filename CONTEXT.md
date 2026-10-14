# CONTEXT.md — Alerta de Convocação (leia primeiro / read first)

> Fonte única de contexto. Se algo aqui conflitar com outro doc, **este vence** e você avisa o Owner.
> Este projeto roda **em paralelo** à Dozena (produto principal do Owner). A Fase 0 da Dozena tem prioridade inegociável; este projeto avança sem pressa, um passo de cada vez.

## 1. Identidade
- **Produto:** **Oxty Inside** (nome definido pelo Owner em 2026-10-14; pendências administrativas do Owner: checar domínio, redes e INPI). "Alerta de Convocação" permanece como tagline descritiva na cópia.
- **Tipo:** SaaS low ticket, mercado **Brasil**, B2C. **Fechado (não é open source)** — diferente da Dozena.
- **Tagline (PT-BR):** "Nunca perca sua nomeação porque o Diário Oficial saiu numa sexta-feira."
- **Público:** concurseiro brasileiro pós-prova, aprovado aguardando nomeação, ou em cadastro de reserva.
- **Interface:** PT-BR apenas. En campo nenhum.
- **Estratégia:** **waitlist primeiro, MVP depois** (Fase 0 mede demanda antes de escrever o produto). Depois: **um avanço por vez, guiado pelo que a comunidade pedir**.

## 2. O problema
Aprovados em concurso público perdem a nomeação porque a convocação sai **apenas no Diário Oficial** (municipal, majoritariamente) e ninguém lê diário oficial todos os dias por 2–5 anos. Tribunais (GO, MS, AL, AM e outros) já anularam eliminações assim, mas depender de juiz significa custo, tempo e risco de perder a vaga.

A dor vale dinheiro: quem paga cursinho de R$ 200/mês paga um low ticket por "um olho que lê o diário por mim".

## 3. Como funciona (30 segundos)
1. Usuário entra na **landing** e deixa o e-mail na **waitlist** (Fase 0, sem pagamento).
2. No MVP: cria conta e cadastra uma **watchlist** — nome completo, CPF parcial (3 primeiros + 2 últimos dígitos, formato publicado nos diários), órgão/concurso, UF/município.
3. Job diário consulta a **API do Querido Diário** (full-text pronto) procurando o nome nos territórios da watchlist.
4. Match com confiança suficiente → alerta por **e-mail** com o trecho, link do PDF e data (ADR-013; Telegram é Fase 2+).
5. Usuário confirma "é meu" ou "não é" para calibrar.
6. **Cobrança via Cakto** (ADR-012; low ticket, plano anual preferido porque quem espera anos não quer pensar em mensalidade).

## 4. Este produto NUNCA
- Promete encontrar 100% dos diários do Brasil (impossível; cobertura é a do Querido Diário e é dita com transparência).
- Interpreta juridicamente qualquer ato (não é assessoria jurídica — disclaimers em todo lugar).
- Guarda CPF completo em claro (apenas parcial; usado só para matching).
- Envia alerta duplicado do mesmo match (dedup por hash do trecho + diário).
- Cobre Diário Oficial da União como diferencial (o DOU já tem alerta gratuito do próprio governo — não reinventar).

## 5. Parâmetros (fonte: `lib/config.ts`, ajustáveis)
| Constante | Valor |
|---|---|
| `SCAN_FREQUENCY_HOURS` | 24 (diário sai de madrugada; varrer 1x/dia basta) |
| `QUERY_TERMS_MAX` | 4 (prenome + sobrenomes fortes; aspas estragam performance — ver §7) |
| `RESULTS_PAGE_SIZE` | 100 com paginação por `offset` (API capa total em 10.000) |
| `DEDUP_HASH_ALGORITHM` | SHA-256 (territory_id + data + hash do excerpt) |
| `MAX_WATCHLISTS_PER_USER` | 3 no MVP |
| `RESEND_FROM` | remetente do Resend (domínio próprio quando houver) |
| Preço sugerido | R$ 9,90/mês · **R$ 49/ano (recomendado)** |

## 6. Decisões travadas (detalhe em `DECISIONS.md`)
- **ADR-001:** SaaS low ticket pago (R$ 9,90/mês ou R$ 49/ano) — travada.
- **ADR-002:** Fonte de dados = **API do Querido Diário**, sem scraping próprio, sem IA. Full-text vem pronto da API (substitui o `ts_vector` na Fase 1). — travada.
- **ADR-003:** Alertas por **e-mail (Resend) + Telegram Bot**. — **substituída pela ADR-013 (só e-mail no MVP)**.
- **ADR-004:** Cobertura = só o que a API cobrir hoje (~800 municípios), **declarado com transparência na landing e no painel**. — travada.
- **ADR-005:** Público = concurseiro pós-prova/aguardando nomeação. — travada.
- **ADR-006:** **Cobrança exclusivamente via AbacatePay** — **substituída pela ADR-012 (Cakto)**.
- **ADR-007:** **Fase 0 = landing + waitlist antes de qualquer produto.** Só construir o MVP se a waitlist atingir o piso (ver §11). — travada.
- **ADR-008:** Distribuição = Reddit (subs BR de concursos, com voz humana — sem assinatura de IA, ver lição da Dozena) + grupos de WhatsApp/Telegram de concurseiros + indicação. Sem ads no início. — travada.
- **ADR-009:** Evolução pós-MVP = **um passo por vez, guiado pela comunidade** (feature requests votadas). Roadmap longo não é promessa. — travada.
- **ADR-012:** **Cobrança via Cakto** (PIX + cartão, checkout hospedado), substitui ADR-006. — travada.
- **ADR-013:** **Alertas só por e-mail (Resend) no MVP**, substitui ADR-003. Telegram volta como candidato de Fase 2+. — travada.

## 7. Risco #1: Cobertura (auditoria concluída — GATE PASSOU 🟢)
> O produto só é vendável se declarar exatamente **onde cobre e onde não cobre**.

### Auditoria técnica da API Querido Diário (2026-10-13)
| Item | Resultado |
|---|---|
| API pública | ✅ `https://api.queridodiario.org.br` (v0.19.0), OpenAPI em `/openapi.json`; leitura **sem auth** |
| Health | ✅ `/health` = `healthy` |
| Cobertura | 🟡 **~800 municípios** indexados (~63 nível 3) — parcial; exige transparência |
| Frescor | ✅ coleta **no mesmo dia**; 1.563 diários nos últimos 7 dias |
| Formato | ✅ PDF + **TXT extraído** (`txt_url`) — não parseamos PDF |
| Busca | ✅ `querystring` OpenSearch + `territory_ids` + datas + excerpts — validada end-to-end |
| End-to-end | ✅ nome real (`MARIVALDO BITTENCOURT DA SILVA`, Ipiaú-BA 08/10/2026) encontrado via API |
| Rate limit | ✅ 6 requisições simultâneas OK, <1s cada; margem folgada pro job diário |
| Capitais | ✅ SP (nível 1), BH (nível 3), RJ (nível 3) |
| Termos de uso OKBR | 🟡 página carrega via JS (não extraível por bot). **Leitura humana pendente antes do lançamento.** Se monetizar, considerar contribuição à OKBR. |

### Descobertas operacionais (críticas para quem implementar)
- `total_gazettes` capa em **10.000** → sempre paginar com `offset`/`size`.
- Query entre aspas (`"Nome Completo"`) pode estourar 30s → usar **2–4 termos fortes** (prenome + sobrenomes distintivos), ordenar por relevância.
- Excerpts já vêm com nomes reais de nomeações → ótimos **fixtures** para testes do matching.
- Se um dia a API pública mudar/ficar cara → o projeto é open source; **self-host é o plano B documentado** (não implementar agora).

## 8. Prioridades
- **Fase 0 (agora, ~2–3 dias): medir demanda**
  - Landing PT-BR com proposta clara + seção "O que cobrimos" (lista de municípios)
  - Waitlist (e-mail) com anti-bot (Turnstile) + confirmação por e-mail (Resend)
  - Analítico próprio simples (page_view / cta_click, sem cookies)
  - Distribuição: Reddit + grupos de WhatsApp (ver `docs/08-canais-e-voz.md`)
- **Fase 1 — MVP (só se waitlist ≥ piso do §11; ~7 dias):**
  - Cadastro/login (Supabase Auth, e-mail + magic link)
  - CRUD de watchlist (nome, CPF parcial, órgão, UF/município — com autocomplete de município via `/cities`)
  - Job diário de varredura (Vercel Cron) → adapter `lib/ingestion/queridodiario`
  - Match + dedup + alerta por e-mail (ADR-013)
  - Checkout **Cakto** (PIX + cartão), plano mensal e anual (ADR-012)
  - Painel: watchlists ativas, últimos matches, status da assinatura
  - Página "O que cobrimos" + disclaimer jurídico
- **Fase 2 (comunidade pedir):**
  - Telegram como canal de alerta (ADR-013 o tirou do MVP; volta se a comunidade pedir)
  - Confirmação "é meu / não é" calibrando matches
  - Resumo semanal "0 matches, tudo ok" (anti-churn silencioso)
  - Watchlists múltiplas ilimitadas, trial 7 dias
  - Cobertura complementar (Diários estaduais se comunidade pedir muito)

## 9. Stack
Next.js (App Router, TS strict) · Tailwind · Supabase (Postgres, Auth, RLS, migrations) · Vercel (+ Cron) · **Cakto** (checkout/webhooks — ADR-012) · Resend · Cloudflare Turnstile · Zod · Vitest · Playwright. (Telegram Bot API sai do MVP — ADR-013.) **Nenhuma dependência nova sem ADR.**

## 10. Estrutura de pastas (alvo)
```
app/                    landing (waitlist), app autenticado, painel
app/api/cron/           job diário (protegido por CRON_SECRET)
app/api/webhooks/       webhook Cakto (ADR-012)
lib/config.ts           parâmetros
lib/ingestion/          adapter Querido Diário (único ponto de acesso à API)
lib/matching/           query builder + score + dedup
lib/notify/             e-mail (Resend; ADR-013)
lib/billing/            adapter Cakto (ADR-012)
supabase/migrations/    SQL
docs/                   esta documentação (ver §13)
```

## 11. Métricas e critério de parada
- **Fase 0 passa se:** waitlist ≥ **150 e-mails em 21 dias** OU ≥ 50 em 14 dias com ≥ 10% vindo de indicação orgânica. (Público BR é denso nos canais certos; abaixo disso, a dor não converte em lista.)
- **Pivô se:** waitlist não converte, ou levantamento manual mostrar concorrente estabelecido cobrindo as mesmas cidades. Pivô documentado: abrir ferramenta de graça como portfolio open source OU pivotar para "alerta de licitações para MEI" (mesma infra de matching).
- Detalhe: `docs/10-metricas-e-criterio-de-parada.md`.

## 12. Estado atual (atualize ao fim de cada sessão)
- **2026-10-13:** auditoria da API Querido Diário concluída — **GATE PASSOU 🟢** (detalhes no §7). Descoberta-chave: full-text da API substitui o `ts_vector` na Fase 1.
- **2026-10-13:** estrutura documental completa criada (CONTEXT, AGENTS, DECISIONS, ROADMAP, docs/01–10, IDEIAS-FUTURAS).
- **2026-10-13:** **Fase 0 implementada** (código): Next.js 15 App Router + TS strict + Tailwind v4. Landing `/` (hero, widget de cidade com autocomplete contra `coverage_cities`, prova real, FAQ), `/cobertura`, `/obrigado`, `/termos`, `/privacidade`, `/confirmar` (double opt-in). Server actions com Zod + Turnstile + Resend; tabelas `waitlist`, `events`, `coverage_cities` com RLS (insert-only anônimo); adapter `lib/ingestion/queridodiario` com `buildQueryTerms`; cron semanal `sync-cities` + script manual. **Build verde, Vitest 10/10, Playwright 3/3** (testados em modo degradado dev, sem Supabase). Em dev sem Supabase, o widget de cidade cai para a API ao vivo via adapter (validado com Porto Alegre-RS, level 3); em produção o caminho normal continua sendo `coverage_cities`.
- **2026-10-14 (Owner):** gateway muda de AbacatePay → **Cakto** (ADR-012) e alertas do MVP passam a **só e-mail** (ADR-013; Telegram vira candidato de Fase 2+). Docs alinhados (CONTEXT, AGENTS, ROADMAP, 01/02/03/04/05/06/09, doc 07 rescrito como `07-monetizacao-cakto.md`, antigo virou histórico). Copy da landing não promete mais Telegram.
- **2026-10-14:** **Banco ligado.** `.env.local` criado com credenciais do projeto Supabase `fkjxfryronarpyfrgtwc` + Resend. Tabelas Fase 0 já existiam; `sync-cities` rodou: **955 municípios com fonte (level ≥ 1)** em `coverage_cities` (de 5.570 na API). Achado operacional: **`/cities` ignora `offset`** — devolve a lista inteira; adapter/script param quando a página ≠ 100. Retry/backoff em 429/timeout adicionado ao adapter (doc 05 §1.4). **Smoke test no banco:** busca "Porto Alegre" `level 3` ✅, insert na waitlist 201 ✅, confirmação por token (lógica de `/confirmar`) ✅, registro de teste removido ✅. Widget de cidade em dev usa fallback live quando o app local não tem env; com `.env.local` ele lê `coverage_cities`.
- **2026-10-14 (Owner):** `coverage_cities` guarda **todas as 5.570 cidades**, não só as cobertas — sync refeito (5.570 upserts; 955 com level ≥ 1). O widget distingue ✅ level ≥ 1 ("monitoramos") de 🟡 level 0 ("ainda não", já com nome+código certos no evento `city_check_missing`). `/cobertura` lista só level ≥ 1. Vitest 10/10, build verde. (Build: erro intermitente `/_not-found` no Next 15.5.27 acontece com dev server simultâneo no `.next`; rebuild limpa resolve.)
- **2026-10-14 (Owner):** **nome definitivo = Oxty Inside** (logo em `public/oxty-inside.{png,svg}`; pendências do Owner: domínio/redes/INPI). Landing redesenhada a partir de `docs/re-design/alerta-convocacao-landing-v2.html`: hero navy + cena 3D do diário (CSS puro), fita marquee "Lido hoje" com cidades reais do banco, cards/planos com tilt, seção nova **"Esse número não para de crescer"** (explica que a cobertura aumenta sozinha via sync semanal), formulário único cidade+e-mail ([SignupForm](components/SignupForm.tsx)), **zero emojis** (ícones SVG), `prefers-reduced-motion` respeitado, tokens de motion/design em `app/globals.css`. E2E adaptado: 3/3 ✅; build verde; Vitest 10/10. Observação: em dev o E2E grava na waitlist real (linha de teste removida após o run); Resend respondeu 403 com `onboarding@resend.dev` para e-mail externo — esperado até configurar domínio próprio no Resend.
- **Pendente para lançar a Fase 0 em produção:** (1) Owner ler termos de uso da OKBR (único item 🟡 da auditoria); (2) criar projeto Supabase e aplicar migration `20261013000001_fase0.sql`; (3) configurar envs (`.env.example`) — chaves próprias, não reusar as da Dozena; (4) rodar `npm run sync-cities`; (5) deploy Vercel + smoke test E2E real (waitlist → e-mail → confirma) e documentar aqui; (6) post de divulgação seguindo `docs/08`.

## 13. Mapa de docs
- `AGENTS.md` — regras para agentes de IA trabalharem neste repo (leia segundo).
- `DECISIONS.md` — ADRs (jamais editar decisão sem ADR nova).
- `ROADMAP.md` — fases; datas são metas, não promessas.
- `docs/01-problema-e-personas.md` — dor, personas, jornada do concurseiro.
- `docs/02-escopo-mvp.md` — o que entra e (importante) o que NÃO entra.
- `docs/03-fluxos-e-telas.md` — telas e fluxos, descritos sem código.
- `docs/04-modelo-de-dados.md` — tabelas, colunas, RLS (especificação, sem SQL final).
- `docs/05-stack-e-integracoes.md` — contratos: Querido Diário, Resend, Turnstile (Telegram: Fase 2+, ADR-013).
- `docs/06-landing-e-waitlist.md` — Fase 0 detalhada (copy, campos, anti-bot).
- `docs/07-monetizacao-cakto.md` — planos, fluxo de checkout, webhooks, testes (ADR-012; o antigo doc AbacatePay virou histórico).
- `docs/08-canais-e-voz.md` — Reddit/WhatsApp, regras de autopromoção, voz humana (lição da Dozena).
- `docs/09-lgpd-e-seguranca.md` — CPF parcial, consentimento, disclaimers.
- `docs/10-metricas-e-criterio-de-parada.md` — funil, números-alvo, pivôs.
- `IDEIAS-FUTURAS.md` — backlog pós-MVP, guiado pela comunidade.
