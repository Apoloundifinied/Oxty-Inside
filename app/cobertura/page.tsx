import { getServiceClient } from "@/lib/supabase/server";
import { trackEvent } from "@/app/actions/waitlist";
import { WaitlistForm } from "@/components/WaitlistForm";
import { CONFIG } from "@/lib/config";
import type { CoverageCity } from "@/lib/domains";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O que cobrimos — Alerta de Convocação",
  description: "Lista completa e pesquisável dos municípios monitorados pelo Alerta de Convocação.",
};

export const dynamic = "force-dynamic";

export default async function CoberturaPage() {
  await trackEvent({ kind: "page_view", meta: { page: "/cobertura" } });

  let cities: CoverageCity[] = [];
  const db = getServiceClient();
  if (db) {
    const { data } = await db
      .from("coverage_cities")
      .select("territory_id, name, uf, level")
      .order("name")
      .limit(6000);
    cities = (data ?? []) as CoverageCity[];
  }

  const byUf = new Map<string, CoverageCity[]>();
  for (const c of cities) {
    const list = byUf.get(c.uf) ?? [];
    list.push(c);
    byUf.set(c.uf, list);
  }
  const ufs = [...byUf.keys()].sort();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">O que cobrimos</h1>
      <p className="mt-3 max-w-2xl text-gray-700">
        Não adianta prometer o Brasil inteiro: hoje monitoramos{" "}
        <strong>{cities.length || `~${CONFIG.COVERAGE_COUNT_APPROX}`} municípios</strong>, os
        mesmos cobertos pelo Querido Diário. O Brasil tem 5.570 — estamos expandindo junto
        com o projeto. Aqui não tem letra miúda: se a sua cidade não está na lista, a gente
        ainda não lê o diário dela.
      </p>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="font-medium text-amber-900">Sua cidade não está aqui?</p>
        <p className="mt-1 text-sm text-amber-800">
          Deixe o e-mail. Ela entra na nossa fila de expansão e você é avisado quando começarmos.
        </p>
        <div className="mt-3 max-w-xl">
          <WaitlistForm compact />
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {ufs.map((uf) => (
          <section key={uf}>
            <h2 className="border-b border-gray-200 pb-1 text-xl font-semibold">
              {uf} <span className="text-sm font-normal text-gray-500">({byUf.get(uf)!.length})</span>
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-gray-700 sm:grid-cols-3">
              {byUf.get(uf)!.map((c) => (
                <li key={c.territory_id}>{c.name}</li>
              ))}
            </ul>
          </section>
        ))}
        {cities.length === 0 && (
          <p className="text-gray-600">
            A lista completa é carregada assim que o banco estiver configurado e o sync de
            cobertura rodar.
          </p>
        )}
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Fonte: API pública do Querido Diário (Open Knowledge Brasil), sincronizada semanalmente.
      </p>
    </main>
  );
}
