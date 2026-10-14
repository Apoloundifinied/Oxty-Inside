"use server";

import { getServiceClient } from "@/lib/supabase/server";
import type { CoverageCity } from "@/lib/domains";
import { trackEvent } from "./waitlist";

// Le a copia local (coverage_cities), nunca a API ao vivo (doc 05 §1).
export async function searchCoveredCities(query: string): Promise<CoverageCity[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const db = getServiceClient();
  if (!db) return [];
  const { data, error } = await db
    .from("coverage_cities")
    .select("territory_id, name, uf, level")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(8);
  if (error) {
    console.error("[coverage] busca falhou:", error.message);
    return [];
  }
  return (data ?? []) as CoverageCity[];
}

// Widget "sua cidade esta coberta?": registra demanda (doc 06 §1).
export async function checkCity(city: CoverageCity | null, typedName: string) {
  await trackEvent({
    kind: city ? "city_check_covered" : "city_check_missing",
    meta: city
      ? { territory_id: city.territory_id, city: city.name, uf: city.uf }
      : { typed: typedName.slice(0, 120) },
  });
  return { covered: city !== null, city };
}
