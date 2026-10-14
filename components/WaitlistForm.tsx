"use client";

import { useState, useTransition } from "react";
import { joinWaitlist, resendConfirmation, type WaitlistResult } from "@/app/actions/waitlist";
import { Turnstile } from "./Turnstile";

const SOURCES = [
  { value: "reddit", label: "Reddit" },
  { value: "whatsapp", label: "Grupo de WhatsApp" },
  { value: "telegram", label: "Grupo de Telegram" },
  { value: "indicacao", label: "Indicação de alguém" },
  { value: "outro", label: "Outro / não lembro" },
];

interface Props {
  cityName?: string;
  cityTerritoryId?: string;
}

// Formulario simples de e-mail (usado fora da landing, ex.: /cobertura).
export function WaitlistForm({ cityName, cityTerritoryId }: Props) {
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("outro");
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<WaitlistResult | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const utm =
      typeof window !== "undefined"
        ? Object.fromEntries(
            [...new URLSearchParams(window.location.search).entries()].filter(([k]) =>
              k.startsWith("utm_")
            )
          )
        : undefined;
    start(async () => {
      setResult(
        await joinWaitlist({
          email,
          source,
          turnstileToken: token ?? undefined,
          cityName: cityName || undefined,
          cityTerritoryId: cityTerritoryId || undefined,
          utm: utm && Object.keys(utm).length ? utm : undefined,
        })
      );
    });
  }

  if (result?.status === "ok" || result?.status === "duplicate") {
    return (
      <div className="rounded-xl border p-4" style={{ borderColor: "#bfdec9", background: "#eef7f0" }}>
        <p className="font-medium" style={{ color: "var(--color-ok)" }}>
          {result.status === "duplicate"
            ? "Esse e-mail já está na lista."
            : "Quase lá! Mandamos um e-mail de confirmação."}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--color-mudo)" }}>
          Clique no link do e-mail pra garantir sua vaga. Não chegou?{" "}
          <button
            className="underline"
            onClick={() => start(async () => void (await resendConfirmation(email)))}
          >
            reenviar
          </button>{" "}
          — e confere o spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          className="form-input mt-0 sm:flex-1"
          aria-label="Seu e-mail"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="form-input mt-0 sm:max-w-[180px]"
          aria-label="Como conheceu"
        >
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={pending} className="btn-main mt-0 sm:w-auto sm:px-6">
          {pending ? "Enviando…" : "Entrar na lista"}
        </button>
      </div>
      <Turnstile onToken={setToken} />
      {result?.status === "error" && (
        <p className="mt-2 text-sm font-semibold" style={{ color: "var(--color-erro)" }}>
          {result.message}
        </p>
      )}
      <p className="mt-2 text-xs" style={{ color: "var(--color-mudo)" }}>
        De graça, sem spam. Você confirma o e-mail antes de entrar na lista.
      </p>
    </form>
  );
}
