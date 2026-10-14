# 04 — Modelo de Dados (especificação, sem SQL final)

> Supabase/Postgres. Toda tabela tem `id uuid`, `created_at timestamptz`. Tudo com RLS: usuário só lê o próprio dado; escrita de waitlist é insert-only anônima (mesmo padrão da Dozena, validado em produção).

## Fase 0 (waitlist)

### `waitlist`
| Coluna | Tipo | Regra |
|---|---|---|
| `email` | text | único (case-insensitive), validado com Zod antes do insert |
| `city_name` | text null | município informado no widget da landing |
| `city_territory_id` | text null | código IBGE de 7 dígitos quando coberto |
| `source` | text | reddit / whatsapp / telegram / indicacao / outro (rastreia canal) |
| `confirmed_at` | timestamptz null | preenchido quando clica no link do e-mail |
- RLS: anon pode **insert**; ninguém lê (padrão Dozena: leitura só via serviço).

### `events` (analítico próprio, sem cookies)
| `kind` | text | `page_view` / `cta_click` / `city_check_covered` / `city_check_missing` |
| `meta` | jsonb | referrer, cidade consultada, utm |
- RLS: insert-only. `city_check_*` é nossa métrica de demanda por município — alimenta a decisão de expansão.

## Fase 1 (MVP)

### `profiles`
| Coluna | Notas |
|---|---|
| `id` | = `auth.users.id` |
| `email` | denormalizado para suporte |
| `telegram_chat_id` | **Fase 2+** (ADR-013): null até vincular via `/start` com token |
| `plan` | `none` / `monthly` / `annual` |
| `subscription_status` | `active` / `past_due` / `canceled` — espelho do webhook Cakto (ADR-012) |
| `cakto_customer_id` / `cakto_subscription_id` | referências do gateway |

### `watchlists` (máx. 3/usuário, enforced no server)
| `user_id`, `full_name` (como sai no diário), `cpf_partial` (formato `123.**.***-45` ou equivalente — ver docs/09), `organ` text, `territory_ids text[]` (1–3), `active bool` |

### `coverage_waitlist`
| `email`, `territory_id`, `city_name` | o município-não-coberto vira lead de expansão (doc 02 §3) |

### `matches` (1 alerta = 1 linha)
| `watchlist_id`, `territory_id`, `gazette_date`, `edition`, `excerpt`, `pdf_url`, `score numeric`, `dedup_hash text unique`, `notified_at`, `status` (`new`/`seen`) |
- `dedup_hash` = SHA-256(`territory_id` + `gazette_date` + `edition` + excerpt normalizado). Unique index = dedup físico.

### `payment_events` (auditoria do gateway)
| `user_id`, `cakto_event_id unique` (idempotência — ADR-012), `kind`, `payload jsonb` |

### `scan_runs` (observabilidade do job)
| `started_at`, `finished_at`, `watchlists_scanned int`, `api_calls int`, `matches_found int`, `errors jsonb` |
- Job que não registra `scan_runs` é silêncio mortal: checar diariamente em produção nas primeiras 2 semanas.

## Decisões embutidas
- Nada de soft delete no MVP: cancelou/excluiu watchlist, some (menos `matches` históricos e `payment_events`, que ficam por auditoria).
- Nenhuma tabela armazena conteúdo integral de diário: guardamos excerpt + link. Texto completo mora no `txt_url` da API.
