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

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");

  const health = await fetch(`${BASE}/health`).then((r) => r.json());
  console.log("health:", health);

  const cities: QDCity[] = [];
  for (let offset = 0; ; offset += 100) {
    const res = await fetch(`${BASE}/cities?size=100&offset=${offset}`);
    const page = (await res.json()) as { cities: QDCity[] };
    cities.push(...page.cities);
    if (page.cities.length < 100) break;
  }
  console.log("cidades da API:", cities.length);

  const db = createClient(url, key);
  const rows = cities
    .filter((c) => Number(c.level) >= 1 && /^\d{7}$/.test(c.territory_id))
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
