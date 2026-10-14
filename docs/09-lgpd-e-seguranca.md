# 09 — LGPD e Segurança

> Público e produto brasileiros: LGPD (Lei 13.709/2018) se aplica desde a Fase 0 (e-mail é dado pessoal).

## 1. Dados tratados por fase
| Dado | Fase | Base legal (LGPD) | Nota |
|---|---|---|---|
| E-mail + cidade (waitlist) | 0 | Consentimento | double opt-in reforça evidência |
| Nome completo | 1 | Execução de contrato | necessário ao serviço |
| **CPF parcial** (3 primeiros + 2 últimos) | 1 | Execução de contrato | ADR-011: **nunca** CPF completo |
| Telegram chat id | 2+ | Consentimento (vínculo voluntário) | opcional — fora do MVP (ADR-013) |
| Histórico de matches | 1 | Execução de contrato | excerpts de diários são públicos |
| Dados de pagamento | 1 | Cakto é o processador (ADR-012) | não armazenamos cartão |

## 2. Decisões de minimização (já travadas)
- **CPF parcial por desenho**: o formato que diários publicam (`***.123.456-**` ou `123.***.**4-56` varia por município) não exige o CPF completo. Coletar só o necessário e documentar o formato aceito na UI (doc 03 Tela 5).
- **Sem conteúdo integral de diário** no nosso banco: só excerpt + link oficial (doc 04).
- **Sem cookies** no analítico próprio; sem banners.

## 3. Direitos do titular (implementar no MVP)
- Página `/privacidade` com: o que coletamos, por quê, onde fica (Supabase/Vercel), quem processa (Cakto, Resend; Telegram só na Fase 2+), como pedir exclusão.
- Exclusão de conta: no MVP, via e-mail de contato com SLA 7 dias (automatizar depois se pedirem). Exclusão remove `profiles`/`watchlists`; `payment_events` e `matches` históricos podem ser mantidos por obrigação legal — dizer isso na política.
- Excerpts de diário: dado público por natureza, mas se um titular pedir remoção de um match do **nosso** painel, honrar (somos hospedeiros de exibição, não a fonte — a fonte é o diário oficial).

## 4. Segurança operacional
- RLS em tudo (padrão Supabase); service role só em server.
- Webhook Cakto: assinatura verificada + idempotência (doc 07).
- Cron e rotas internas por `CRON_SECRET`.
- Segredos em env vars da Vercel; `.env` no gitignore; **credenciais deste projeto são separadas das da Dozena** (AGENTS.md §6).
- Relato de vulnerabilidade: SECURITY.md simples com e-mail de contato + compromisso de resposta (espelho da Dozena).

## 5. Disclaimers obrigatórios (aparecem em: rodapé, checkout, todo alerta)
1. "Este serviço lê e avisa sobre publicações de Diários Oficiais; **não é assessoria jurídica** e não substitui a leitura do ato na fonte oficial."
2. "A cobertura é parcial (lista em /cobertura). Não monitoramos todos os municípios do Brasil."
3. No alerta: "sempre confira o ato completo no PDF oficial linkado."
