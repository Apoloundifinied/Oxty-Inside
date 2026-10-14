import { NextRequest, NextResponse } from "next/server";
import { fetchAllCities, health } from "@/lib/ingestion/queridodiario";
import { getServiceClient } from "@/lib/supabase/server";

export const maxDuration = 120;

// Sync semanal da cobertura (doc 05 §1). Protegido por CRON_SECRET.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await health();
  } catch (err) {
    return NextResponse.json(
      { error: "queridodiario indisponivel, abortando", detail: String(err) },
      { status: 502 }
    );
  }

  const cities = await fetchAllCities();
  const db = getServiceClient();
  if (!db) return NextResponse.json({ error: "supabase nao configurado" }, { status: 500 });

  // upsert em lotes; somente level >= 1 (tem fonte de dados, doc 05)
  const rows = cities
    .filter((c) => Number(c.level) >= 1 && /^\d{7}$/.test(c.territory_id))
    .map((c) => ({
      territory_id: c.territory_id,
      name: c.territory_name,
      uf: c.state_code,
      level: String(c.level),
    }));

  let upserted = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db
      .from("coverage_cities")
      .upsert(rows.slice(i, i + 500), { onConflict: "territory_id" });
    if (error) return NextResponse.json({ error: error.message, upserted }, { status: 500 });
    upserted += Math.min(500, rows.length - i);
  }

  return NextResponse.json({ ok: true, citiesFromApi: cities.length, upserted });
}
