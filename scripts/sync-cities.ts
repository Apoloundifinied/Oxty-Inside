// Sync manual da cobertura: tsx scripts/sync-cities.ts
// Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.
import { createClient } from "@supabase/supabase-js";

const BASE = "https://api.queridodiario.org.br";

interface QDCity {
  territory_id: string;
  territory_name: string;
  state_code: string;
  level: string;
}

// Timeout/429: retry com backoff simples, max 2 (mesma regra do adapter, doc 05 §1.4).
async function fetchWithRetry(url: string, attempt = 0): Promise<{ cities: QDCity[] }> {
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  if (res.status === 429 || res.status >= 500) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1_500 * (attempt + 1)));
      return fetchWithRetry(url, attempt + 1);
    }
    throw new Error(`HTTP ${res.status} apos retries: ${url}`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<{ cities: QDCity[] }>;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");

  const health = await fetch(`${BASE}/health`).then((r) => r.json());
  console.log("health:", health);

  const cities: QDCity[] = [];
  for (let offset = 0; ; offset += 100) {
    const page = await fetchWithRetry(`${BASE}/cities?size=100&offset=${offset}`);
    cities.push(...page.cities);
    console.log(`pagina offset=${offset}: ${page.cities.length} cidades`);
    // /cities pode ignorar offset e devolver tudo de uma vez: para se a pagina
    // nao tem exatamente 100 (evita loop infinito — observado 2026-10).
    if (page.cities.length !== 100) break;
    await new Promise((r) => setTimeout(r, 400)); // gentileza com a API publica
  }
  console.log("cidades da API:", cities.length);

  const db = createClient(url, key);
  // Todas as cidades, nao so as cobertas: level 0 = "ainda nao cobrimos" e vira
  // sinal de demanda no widget. Deduplica por territory_id (defensivo).
  const seen = new Set<string>();
  const rows = cities
    .filter((c) => {
      if (!/^\d{7}$/.test(c.territory_id) || seen.has(c.territory_id)) return false;
      seen.add(c.territory_id);
      return true;
    })
    .map((c) => ({
      territory_id: c.territory_id,
      name: c.territory_name,
      uf: c.state_code,
      level: String(c.level),
    }));

  let n = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db
      .from("coverage_cities")
      .upsert(rows.slice(i, i + 500), { onConflict: "territory_id" });
    if (error) throw error;
    n += Math.min(500, rows.length - i);
  }
  console.log("upserted:", n);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
