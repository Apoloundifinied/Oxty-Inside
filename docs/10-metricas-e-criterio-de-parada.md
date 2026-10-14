# 10 — Métricas e Critério de Parada

> Medir coisa pouca, mas decisiva. Ferramenta: tabelas `waitlist` + `events` (Fase 0) e consultas SQL diretas — nada de stack de analytics nova no MVP.

## 1. Funil da Fase 0
```
visita (page_view)
  → confere cidade (city_check_*)
    → deixa e-mail (cta_click + insert waitlist)
      → confirma (confirmed_at preenchido)   ← único número que conta pro piso
```
| Métrica | Alvo Fase 0 |
|---|---|
| Waitlist **confirmada** | ≥ 150 em 21 dias (ou ≥ 50 em 14 dias com ≥ 10% via indicação) |
| Taxa de confirmação (double opt-in) | ≥ 60% (abaixo = e-mail caindo em spam ou tráfego ruim) |
| `city_check_missing / city_check` | número claramente < 100% — se ~tudo der missing, a cobertura é vendável? repensar |
| Canal vencedor (`source`) | 1 canal com ≥ 40% das confirmações (sinal de onde dobrar a aposta) |

## 2. Piso e pivô (CONTEXT §11)
- **Passa:** piso batido → autoriza MVP (ADR-007).
- **Pivô A (demanda fraca):** abrir a ferramenta de graça como projeto open source de portfolio e focar energia na Dozena. Sem apego — o custo foi uma landing.
- **Pivô B (concorrente estabelecido descoberto cobrindo melhor):** reusar a infra de matching para segmento adjacente (alerta de licitações para MEI). Documentar antes de executar.
- Revisão obrigatória nos dias 7, 14 e 21 da Fase 0 (anotar no CONTEXT §12).

## 3. Métricas do MVP (quando chegar)
| Métrica | Por quê |
|---|---|
| Conversão waitlist→assinatura | ≥ 8% das confirmadas convertendo na 1ª semana = oferta certa |
| % vendas PIX vs cartão | valida a tese do gateway |
| Matches enviados / semana | métrica de vida do produto (0 não é ruim — ruim é job parado!) |
| `scan_runs` sem erro | saúde operacional; checar diariamente nas 2 primeiras semanas |
| Cancelamentos com motivo "fui nomeado" | churn positivo: transformar em depoimento/print social (com permissão) |
| Chargebacks/estornos | low ticket não tolera taxa alta de contestação |

## 4. Cadência
- Fase 0: olhar números 2x/semana; post-mortem curto no CONTEXT §12 a cada revisão.
- MVP: revisão semanal de 15 min; decidir a próxima feature **só** com votação da comunidade (ADR-009, IDEIAS-FUTURAS).
