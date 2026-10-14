# 07 — Monetização: Cakto (low ticket)

> **ADR-012 (2026-10-13): gateway travado = Cakto.** Substitui a ADR-006 (AbacatePay). Este doc é a referência; consultar a documentação oficial da Cakto no dia da implementação (APIs de checkout e webhooks podem evoluir).
> Alertas e avisos de cobrança vão **só por e-mail** (ADR-013).

## 1. Por que Cakto
| Critério | Peso no low ticket BR |
|---|---|
| PIX nativo, sem fricção | Público concurseiro paga por PIX; cartão barra conversão |
| Taxas adequadas a ticket R$ 9,90 | Gateway gringo corrói low ticket |
| Checkout hospedado simples | MVP sem página de pagamento própria |
| Burocracia de entrada baixa | Owner solo, sem CNPJ complexo no início |
| Familiaridade do Owner | Decisão do Owner (2026-10-13) substituiu AbacatePay |

## 2. Planos
| Plano | Preço | Uso esperado |
|---|---|---|
| **Anual** (recomendado) | R$ 49/ano | Maioria: quem espera nomeação espera anos; inibe churn mensal bobo |
| Mensal | R$ 9,90/mês | Porta de entrada e quem está "quase sendo chamado" |
- Sem trial no MVP (ADR-009 backlog Fase 2).
- A venda só é habilitada para watchlist de município coberto (doc 02 §3).

## 3. Fluxo de cobrança (MVP)
1. Usuário logado escolhe plano → back-end cria cobrança na Cakto → redireciona para o **checkout hospedado** (PIX QR / cartão).
2. Cakto confirma → **webhook** `app/api/webhooks/cakto`:
   - Verificar assinatura com `CAKTO_WEBHOOK_SECRET`.
   - **Idempotente:** `payment_events.cakto_event_id` é unique — evento repetido = 200 e ignora.
   - Atualiza `profiles.plan` e `subscription_status`.
3. Falha/estorno → `past_due` → aviso por e-mail (ADR-013).
4. Cancelamento MVP: se a Cakto não oferecer portal do assinante self-service na época, aceitar cancelamento por e-mail/painel com SLA 24h manual e registrar a dívida técnica (ver `03` Tela 7).

## 4. Regra de acesso
- `subscription_status = active` → job diário varre as watchlists do usuário.
- `canceled`/`past_due` > 7 dias → watchlists pausadas, dados mantidos (volta fácil), sem novo alerta.
- **Nunca cobrar quem tem só município não coberto.** Essa pessoa vive em `coverage_waitlist`, de graça.

## 5. Testes obrigatórios (Vitest + teste manual)
- Webhook: assinatura inválida → 401; evento duplicado → 200 idempotente; evento válido → plano atualizado.
- E2E manual em produção com valor real baixo pagando por PIX (o próprio Owner assina o produto — dogfooding).
- Renovação anual: simular evento de recorrência (se suportado) ou registrar lembrete manual no backlog da dívida.

## 6. Nota fiscal / contábil (fora do código, Owner decide)
Low ticket B2C: avaliar MEI e emissão de nota conforme faturamento real. Não bloqueia o MVP; registrar como pendência administrativa no CONTEXT §12 quando o primeiro pagamento cair.
