"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { joinWaitlist, resendConfirmation } from "@/app/actions/waitlist";
import { searchCoveredCities, checkCity } from "@/app/actions/coverage";
import type { CoverageCity } from "@/lib/domains";
import { Turnstile } from "./Turnstile";

const SOURCES = [
  { value: "reddit", label: "Reddit" },
  { value: "whatsapp", label: "Grupo de WhatsApp" },
  { value: "telegram", label: "Grupo de Telegram" },
  { value: "indicacao", label: "Indicação de alguém" },
  { value: "outro", label: "Outro / não lembro" },
];

type CityState =
  | { status: "idle" }
  | { status: "covered"; city: CoverageCity }
  | { status: "missing"; label: string };

function CheckIcon() {
  return (
    <svg className="inline-block h-4 w-4 align-[-2px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Formulario unico da landing: cidade (autocomplete) + e-mail (referencia v2).
export function SignupForm() {
  const [cityQuery, setCityQuery] = useState("");
  const [picked, setPicked] = useState<CoverageCity | null>(null);
  const [options, setOptions] = useState<CoverageCity[]>([]);
  const [open, setOpen] = useState(false);
  const [cityState, setCityState] = useState<CityState>({ status: "idle" });
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("outro");
  const [token, setToken] = useState<string | null>(null);
  const [done, setDone] = useState<"ok" | "duplicate" | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (cityQuery.trim().length < 2) {
      setOptions([]);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setOptions(await searchCoveredCities(cityQuery));
      setOpen(true);
    }, 200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [cityQuery]);

  async function pick(city: CoverageCity) {
    setPicked(city);
    setCityQuery(`${city.name} - ${city.uf}`);
    setOpen(false);
    const covered = Number(city.level) >= 1;
    setCityState(
      covered ? { status: "covered", city } : { status: "missing", label: `${city.name} - ${city.uf}` }
    );
    await checkCity(city, city.name);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      if (!picked && cityQuery.trim().length >= 2) await checkCity(null, cityQuery.trim());
      const utm =
        typeof window !== "undefined"
          ? Object.fromEntries(
              [...new URLSearchParams(window.location.search).entries()].filter(([k]) =>
                k.startsWith("utm_")
              )
            )
          : undefined;
      const r = await joinWaitlist({
        email,
        source,
        turnstileToken: token ?? undefined,
        cityName: picked ? picked.name : cityQuery.trim() || undefined,
        cityTerritoryId: picked?.territory_id,
        utm: utm && Object.keys(utm).length ? utm : undefined,
      });
      if (r.status === "error") setError(r.message);
      else setDone(r.status);
    });
  }

  if (done) {
    return (
      <div className="form-card max-w-[440px]">
        <p className="font-semibold" style={{ color: "var(--color-ok)" }}>
          {done === "duplicate"
            ? "Esse e-mail já está na lista."
            : "Quase lá! Mandamos um e-mail de confirmação."}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--color-mudo)" }}>
          Clique no link do e-mail pra garantir sua vaga. Não chegou?{" "}
          <button className="underline" onClick={() => void resendConfirmation(email)}>
            reenviar
          </button>{" "}
          — e confere o spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="form-card mt-6 max-w-[440px]" noValidate>
      <label className="block font-semibold text-[0.95rem]">
        Cidade do concurso
        <div className="relative">
          <input
            className="form-input"
            type="text"
            autoComplete="off"
            placeholder="Digite o município"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              setPicked(null);
              setCityState({ status: "idle" });
            }}
            onFocus={() => options.length && setOpen(true)}
          />
          {open && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[10px] border border-gray-200 bg-white shadow-lg">
              {options.map((c) => (
                <li key={c.territory_id}>
                  <button
                    type="button"
                    onClick={() => pick(c)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {c.name} <span style={{ color: "var(--color-mudo)" }}>— {c.uf}</span>
                  </button>
                </li>
              ))}
              {options.length === 0 && (
                <li className="px-4 py-2 text-sm" style={{ color: "var(--color-mudo)" }}>
                  Nenhuma cidade encontrada com esse nome.
                </li>
              )}
            </ul>
          )}
        </div>
      </label>

      <p className={`form-status mt-1 ${cityState.status === "covered" ? "ok" : ""}`} aria-live="polite">
        {cityState.status === "covered" && (
          <>
            <CheckIcon /> Já monitoramos {cityState.city.name}.
          </>
        )}
        {cityState.status === "missing" &&
          `Ainda não monitoramos ${cityState.label}. Entre na lista e avisamos quando ela for incluída.`}
      </p>

      <label className="mt-2 block font-semibold text-[0.95rem]">
        Seu e-mail
        <input
          className="form-input"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="mt-3 block text-sm font-semibold" style={{ color: "var(--color-mudo)" }}>
        Como conheceu a gente? <span className="font-normal">(opcional)</span>
        <select
          className="form-input mt-1"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <Turnstile onToken={setToken} />

      <button className="btn-main mt-4" type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Quero ser avisado na minha cidade"}
      </button>

      <p role="alert" className="mt-2 min-h-[1.3em] text-sm font-semibold" style={{ color: "var(--color-erro)" }}>
        {error}
      </p>
      <p className="text-[0.88rem]" style={{ color: "var(--color-mudo)" }}>
        Entrar na lista é grátis, sem cartão. Você confirma o e-mail antes de entrar.
      </p>
    </form>
  );
}
