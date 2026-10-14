// Parametros do produto (fonte: CONTEXT.md §5). Ajustaveis via env quando fizer sentido.
export const CONFIG = {
  SCAN_FREQUENCY_HOURS: 24,
  QUERY_TERMS_MAX: 4,
  RESULTS_PAGE_SIZE: 100,
  MAX_WATCHLISTS_PER_USER: 3,
  DEDUP_HASH_ALGORITHM: "sha256" as const,
  QD_API_BASE: "https://api.queridodiario.org.br",
  PRICE_MONTHLY_BRL: 9.9,
  PRICE_ANNUAL_BRL: 49,
  COVERAGE_COUNT_APPROX: 800, // auditoria 2026-10-13; atualizar quando sync-cities rodar
} as const;
