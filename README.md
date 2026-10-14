# Oxty Inside (Alerta de Convocação)

> "Nunca perca sua nomeação porque o Diário Oficial saiu numa sexta-feira."

SaaS low ticket (BR, B2C, fechado) que lê o Diário Oficial municipal todos os dias e avisa o
concurseiro por e-mail quando o nome dele aparecer (ADR-012: cobrança Cakto · ADR-013: e-mail no MVP).

**Leia primeiro:** [`CONTEXT.md`](./CONTEXT.md) (fonte única) · depois [`AGENTS.md`](./AGENTS.md).

## Estado: Fase 0 (landing + waitlist)

Escopo implementado:

- Landing PT-BR (`/`) com hero, widget "sua cidade está coberta?" (autocomplete contra cópia
  local de cobertura), como funciona, prova real (excerto de diário), preço-âncora e FAQ.
- Waitlist com validação Zod, Turnstile, dedup por e-mail (case-insensitive), confirmação por
  e-mail via Resend (double opt-in, link tokenizado → `/confirmar` → `/obrigado`).
- Página `/cobertura` ("O que cobrimos") com contagem honesta e lista por UF.
- Analítico próprio sem cookies (`events`: `page_view`, `cta_click`, `city_check_*`).
- Adapter `lib/ingestion/queridodiario` — único ponto de acesso à API do Querido Diário
  (com `buildQueryTerms`, a regra de ouro dos 2–4 termos fortes sem aspas).
- Sync de cobertura: `app/api/cron/sync-cities` (Vercel Cron semanal) ou
  `npm run sync-cities` (manual).
- Páginas `/termos` e `/privacidade` com disclaimers LGPD/jurídico.

## Rodar

```bash
npm install
cp .env.example .env.local   # preencher chaves (não reusar as da Dozena)
# aplicar supabase/migrations/20261013000001_fase0.sql no projeto Supabase
npm run sync-cities           # popula coverage_cities
npm run dev
npm test                      # Vitest
npm run test:e2e              # Playwright
```

Sem Supabase/Turnstile configurados, as actions degradam com aviso no log (modo dev) — a
jornada da landing continua navegável.

## Regras de ouro

- Nenhuma decisão nova sem ADR em `DECISIONS.md`.
- Stack travada: Next.js + TS strict + Tailwind + Supabase + Vercel + Cakto + Resend +
  Turnstile + Zod + Vitest + Playwright. Sem IA no produto. (Telegram: Fase 2+, ADR-013.)
- PT-BR em toda interface e copy. Código e comentários em inglês exceto domínio.
- Nunca prometer cobertura total. Nunca interpretar ato público juridicamente.
