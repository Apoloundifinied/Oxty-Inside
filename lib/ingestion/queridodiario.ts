// Adapter do Querido Diario — UNICO ponto de acesso a API externa (AGENTS.md §2).
// Regras de ouro: docs/05-stack-e-integracoes.md §1.
import { CONFIG } from "@/lib/config";

const BASE = CONFIG.QD_API_BASE;
const DEFAULT_TIMEOUT_MS = 20_000;

export interface QDCity {
  territory_id: string;
  territory_name: string;
  state_code: string;
  publication_urls: string[];
  level: string;
}

export interface QDGazette {
  territory_id: string;
  date: string;
  url: string;
  territory_name: string;
  state_code: string;
  excerpts: string[];
  edition_number?: string;
  is_extra_edition?: boolean;
  power?: string;
}

async function get<T>(path: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`QueridoDiario ${path} -> HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function health(): Promise<{ status: string }> {
  return get("/health");
}

interface CitiesPage {
  cities: QDCity[];
}

export async function searchCities(cityName: string): Promise<QDCity[]> {
  const params = new URLSearchParams({ city_name: cityName, size: "10" });
  const data = await get<CitiesPage>(`/cities?${params}`);
  return data.cities ?? [];
}

// Sync completo para a copia local (cron semanal). Pagina ate esgotar.
export async function fetchAllCities(): Promise<QDCity[]> {
  const all: QDCity[] = [];
  const size = 100;
  for (let offset = 0; offset < 10_000; offset += size) {
    const data = await get<CitiesPage>(`/cities?size=${size}&offset=${offset}`);
    const cities = data.cities ?? [];
    all.push(...cities);
    if (cities.length < size) break;
  }
  return all;
}

export interface GazetteSearch {
  querystring: string;
  territoryIds?: string[];
  publishedSince: string; // YYYY-MM-DD
  publishedUntil?: string;
  size?: number;
  offset?: number;
}

export async function searchGazettes(q: GazetteSearch) {
  const params = new URLSearchParams({
    querystring: q.querystring,
    published_since: q.publishedSince,
    size: String(q.size ?? CONFIG.RESULTS_PAGE_SIZE),
    offset: String(q.offset ?? 0),
    sort_by: "relevance",
    excerpt_size: "500",
    number_of_excerpts: "3",
  });
  if (q.publishedUntil) params.set("published_until", q.publishedUntil);
  for (const t of q.territoryIds ?? []) params.append("territory_ids", t);
  return get<{ total_gazettes: number; gazettes: QDGazette[] }>(`/gazettes?${params}`);
}

// Sobrenomes comuns demais para serem "termos fortes" (doc 05 §1, regra 1).
const COMMON_SURNAMES = new Set([
  "silva", "santos", "oliveira", "souza", "sousa", "pereira", "ferreira", "lima",
  "costa", "rodrigues", "almeida", "nascimento", "carvalho", "araujo", "melo",
  "barbosa", "ribeiro", "alves", "cardoso", "gomes", "martins", "rocha",
]);

const NAME_PARTICLES = new Set(["da", "de", "do", "das", "dos", "e"]);

export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
    // (faixa -  = diacriticos combinantes U+0300..U+036F)
}

// Constroi 2-4 termos fortes: prenome + sobrenomes mais raros. Nunca usar aspas.
export function buildQueryTerms(fullName: string): string {
  const parts = normalizeName(fullName)
    .split(/\s+/)
    .filter((p) => p && !NAME_PARTICLES.has(p));
  if (parts.length === 0) return "";

  const firstName = parts[0];
  const rare = parts.slice(1).filter((p) => !COMMON_SURNAMES.has(p));
  const common = parts.slice(1).filter((p) => COMMON_SURNAMES.has(p));
  const chosen = [firstName, ...rare, ...common].slice(0, CONFIG.QUERY_TERMS_MAX);

  // regra: sempre pelo menos prenome + 1 sobrenome quando existir
  if (chosen.length === 1 && parts.length > 1) chosen.push(parts[parts.length - 1]);
  return [...new Set(chosen)].join(" ");
}
