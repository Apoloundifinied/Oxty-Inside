"use server";

import { getServiceClient } from "@/lib/supabase/server";
import { searchCities } from "@/lib/ingestion/queridodiario";
import type { CoverageCity } from "@/lib/domains";
import { trackEvent } from "./waitlist";

// Le a copia local (coverage_cities). Em dev sem Supabase, cai para a API ao
// vivo via adapter (dev-only; producao nunca consulta a API em tempo real,
// doc 05 §1).
export async function searchCoveredCities(query: string): Promise<CoverageCity[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const db = getServiceClient();
  if (!db) {
    try {
      const cities = await searchCities(q);
      return cities
        .map((c) => ({
          territory_id: c.territory_id,
          name: c.territory_name,
          uf: c.state_code,
          level: String(c.level),
        }));
    } catch (err) {
      console.error("[coverage] fallback live falhou:", err);
      return [];
    }
  }
  const { data, error } = await db
    .from("coverage_cities")
    .select("territory_id, name, uf, level")
    .ilike("name", `%${q}%`)
    .order("name")
    .order("level", { ascending: false }) // cidades cobertas primeiro no empate
    .limit(8);
  if (error) {
    console.error("[coverage] busca falhou:", error.message);
    return [];
  }
  return (data ?? []) as CoverageCity[];
}

// Amostra de cidades cobertas para a fita "Lido hoje" da landing.
export async function marqueeCities(): Promise<string[]> {
  const fallback = [
    "Porto Alegre (RS)", "Ipiaú (BA)", "São Paulo (SP)", "Belo Horizonte (MG)",
    "Curitiba (PR)", "Recife (PE)", "Salvador (BA)", "Venâncio Aires (RS)",
  ];
  const db = getServiceClient();
  if (!db) return fallback;
  const { data, error } = await db
    .from("coverage_cities")
    .select("name, uf")
    .eq("level", "3")
    .order("name")
    .limit(8);
  if (error || !data?.length) return fallback;
  return data.map((c) => `${c.name} (${c.uf})`);
}

// Contagem publica de cidades cobertas (hero da landing + /cobertura).
export async function coveredCityCount(): Promise<number | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { count, error } = await db
    .from("coverage_cities")
    .select("territory_id", { count: "exact", head: true })
    .neq("level", "0");
  if (error) {
    console.error("[coverage] count falhou:", error.message);
    return null;
  }
  return count;
}

// Widget "sua cidade esta coberta?": coberta = level >= 1 (tem fonte, doc 05).
// level 0 entra como city_check_missing COM territory_id — melhor sinal de
// demanda do que texto livre.
export async function checkCity(city: CoverageCity | null, typedName: string) {
  const covered = city !== null && Number(city.level) >= 1;
  await trackEvent({
    kind: covered ? "city_check_covered" : "city_check_missing",
    meta: city
      ? { territory_id: city.territory_id, city: city.name, uf: city.uf, covered }
      : { typed: typedName.slice(0, 120) },
  });
  return { covered, city };
}
