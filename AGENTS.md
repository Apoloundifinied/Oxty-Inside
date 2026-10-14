# AGENTS.md — Regras para agentes de IA neste repositório

> Leia `CONTEXT.md` PRIMEIRO. Depois este arquivo. Depois o doc específico da sua tarefa.
> Este projeto é irmão da Dozena e herda a disciplina dela: documentação antes de código, decisões como ADR, nada fora do escopo.

## 1. Lei maior
1. **`CONTEXT.md` é a fonte única.** Conflito entre docs? CONTEXT vence. Avise o Owner.
2. **Nenhuma decisão nova sem ADR** em `DECISIONS.md` (dependência nova, serviço novo, mudança de preço, mudança de escopo — tudo vira ADR).
3. **Nenhuma linha de código de produto antes de a Fase 0 estar definida e autorizada.** A ordem é: docs → landing/waitlist → (se waitlist bater o piso) → MVP.
4. **PT-BR em toda interface, copy e e-mails.** Código e comentários em inglês, como de costume.

## 2. Stack travada (não inventar)
Next.js App Router + TS strict · Tailwind · Supabase (Auth/Postgres/RLS) · Vercel + Cron · **Cakto** (ADR-012) · Resend · Cloudflare Turnstile · Zod · Vitest · Playwright. (Telegram Bot API saiu do MVP — ADR-013.)
- Nenhuma IA/LLM no produto.
- Nenhum scraping próprio: **toda leitura de diários passa pelo adapter `lib/ingestion/queridodiario`** — único ponto de contato com a API externa.
- Nenhum gateway de pagamento alternativo sem ADR (Cakto é travado; ver `docs/07`).

## 3. Regras de implementação
- **Querido Diário:** seguir `docs/05-stack-e-integracoes.md`. Nunca query com o nome completo entre aspas; sempre 2–4 termos fortes; sempre paginar (`offset`/`size`, total capa em 10.000); tratar timeout como "retry depois", nunca falha fatal do job.
- **Dados sensíveis:** CPF apenas **parcial** (3 primeiros + 2 últimos dígitos). Qualquer campo novo com dado pessoal precisa de atualização em `docs/09-lgpd-e-seguranca.md`.
- **E-mails:** Resend via API REST; templates PT-BR; e-mail é o canal de entrega do MVP (ADR-013).
- **Anti-bot:** todo formulário público (waitlist, cadastro) exige Turnstile.
- **Testes:** toda regra de negócio (matching, dedup, elegibilidade de plano) com teste Vitest; fluxo waitlist→confirmação com teste Playwright.
- **Webhooks Cakto:** idempotentes (chave = id do evento), assinatura verificada, handler em `app/api/webhooks/`.

## 4. Regras de comunicação externa (aprendidas com a Dozena)
- **Voz humana, sempre.** Proibido "tricolon" (três frases paralelas curtas), proibido texto com cara de IA em posts de comunidade. Ver `docs/08-canais-e-voz.md`.
- Nunca prometer cobertura total do Brasil. Sempre linkar/listar a página "O que cobrimos".
- Nunca interpretar ato público juridicamente em nenhum texto (disclaimer obrigatório).

## 5. Definição de pronto (DoD) por fase
- **Fase 0 pronta:** landing no ar em produção, waitlist salvando com Turnstile + e-mail de confirmação, analítico gravando, smoke test manual documentado.
- **MVP pronto:** usuário real consegue pagar via Cakto (PIX), cadastrar watchlist, e receber (ou não) alerta no dia seguinte — tudo verificável em produção.
- Em ambos: build verde, `vitest` verde, migration aplicada em produção, `CONTEXT.md` §12 atualizado.

## 6. Estado e sessões
- Ao fechar qualquer sessão de trabalho: atualizar `CONTEXT.md` §12 (Estado atual).
- Ao travar qualquer decisão: criar ADR em `DECISIONS.md` e referenciar no CONTEXT.
- Projeto roda em paralelo à Dozena — não "roubar" deploys, env vars nem contas; credenciais próprias.
