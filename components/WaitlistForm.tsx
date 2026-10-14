"use client";

import { useState, useTransition } from "react";
import { joinWaitlist, resendConfirmation, type WaitlistResult } from "@/app/actions/waitlist";
import { Turnstile } from "./Turnstile";

const SOURCES = [
  { value: "reddit", label: "Reddit" },
  { value: "whatsapp", label: "Grupo de WhatsApp" },
  { value: "telegram", label: "Grupo de Telegram" },
  { value: "indicacao", label: "Indicação de alguém" },
  { value: "outro", label: "Outro" },
];

interface Props {
  cityName?: string;
  cityTerritoryId?: string;
  compact?: boolean;
}

export function WaitlistForm({ cityName, cityTerritoryId, compact }: Props) {
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("outro");
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<WaitlistResult | null>(null);
  const [pending, start] = useTransition();

  const utm =
    typeof window !== "undefined"
      ? Object.fromEntries(
          [...new URLSearchParams(window.location.search).entries()].filter(([k]) =>
            k.startsWith("utm_")
          )
        )
      : undefined;

  function submit(e: React.FormEvent) {
    e.preventDefault();
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
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="font-medium text-green-900">
          {result.status === "duplicate"
            ? "Esse e-mail já está na lista. 😉"
            : "Quase lá! Mandamos um e-mail de confirmação."}
        </p>
        <p className="mt-1 text-sm text-green-800">
          Clique no link do e-mail pra garantir sua vaga. Não chegou?{" "}
          <button
            className="underline"
            onClick={() => start(async () => void (await resendConfirmation(email)))}
          >
            reenviar
          </button>{" "}
          (e confere o spam).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-3 sm:flex-row"}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-brand focus:outline-none"
          aria-label="Seu e-mail"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-3 text-base text-gray-700 focus:border-brand focus:outline-none"
          aria-label="Como conheceu"
        >
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Quero ser avisado na minha cidade"}
        </button>
      </div>
      <Turnstile onToken={setToken} />
      {result?.status === "error" && (
        <p className="mt-2 text-sm text-red-600">{result.message}</p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        De graça, sem spam. Você confirma o e-mail antes de entrar na lista.
      </p>
    </form>
  );
}
