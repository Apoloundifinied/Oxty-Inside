"use client";

import { useEffect, useRef, useState } from "react";
import { searchCoveredCities, checkCity } from "@/app/actions/coverage";
import type { CoverageCity } from "@/lib/domains";
import { WaitlistForm } from "./WaitlistForm";

type State =
  | { status: "idle" }
  | { status: "covered"; city: CoverageCity }
  | { status: "missing"; typed: string };

// Coracao da landing (doc 03, Tela 1 bloco 2): autocomplete contra a copia
// local de cobertura + registro de demanda city_check_*.
export function CityCheck() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<CoverageCity[]>([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ status: "idle" });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setOptions([]);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setOptions(await searchCoveredCities(query));
      setOpen(true);
    }, 200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  async function pick(city: CoverageCity) {
    setQuery(`${city.name} - ${city.uf}`);
    setOpen(false);
    setState({ status: "covered", city });
    await checkCity(city, city.name);
  }

  async function notFound() {
    setOpen(false);
    setState({ status: "missing", typed: query });
    await checkCity(null, query);
  }

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <label htmlFor="city-check" className="mb-2 block font-semibold">
        Confere se já monitoramos a sua cidade 👇
      </label>
      <div className="relative">
        <input
          id="city-check"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setState({ status: "idle" });
          }}
          onFocus={() => options.length && setOpen(true)}
          placeholder="Digite o município…"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none"
          autoComplete="off"
        />
        {open && (
          <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {options.map((c) => (
              <li key={c.territory_id}>
                <button
                  type="button"
                  onClick={() => pick(c)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  {c.name} <span className="text-gray-500">— {c.uf}</span>
                </button>
              </li>
            ))}
            {options.length === 0 && (
              <li>
                <button
                  type="button"
                  onClick={notFound}
                  className="block w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50"
                >
                  “{query}” não apareceu — conferir assim mesmo
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {state.status === "covered" && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-900">
            ✅ Monitoramos {state.city.name}! Entre na lista e seja dos primeiros avisados.
          </p>
          <div className="mt-3">
            <WaitlistForm
              compact
              cityName={state.city.name}
              cityTerritoryId={state.city.territory_id}
            />
          </div>
        </div>
      )}

      {state.status === "missing" && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-900">
            🟡 Ainda não chegamos em “{state.typed}”. Sem enrolação: deixe seu e-mail que a
            gente te avisa quando começar.
          </p>
          <div className="mt-3">
            <WaitlistForm compact cityName={state.typed} />
          </div>
        </div>
      )}
    </div>
  );
}
