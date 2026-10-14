"use server";

import { z } from "zod";
import { waitlistSchema, eventSchema } from "@/lib/domains";
import { getServiceClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail, waitlistConfirmEmail } from "@/lib/notify/resend";

export type WaitlistResult =
  | { status: "ok" }
  | { status: "duplicate" }
  | { status: "error"; message: string };

export async function joinWaitlist(raw: unknown): Promise<WaitlistResult> {
  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const input = parsed.data;

  if (!(await verifyTurnstile(input.turnstileToken ?? null))) {
    return { status: "error", message: "Verificação anti-robô falhou. Tenta de novo?" };
  }

  const db = getServiceClient();
  if (!db) {
    console.warn("[waitlist] Supabase não configurado — inscrição descartada (somente dev)");
    return { status: "ok" };
  }

  const { error } = await db.from("waitlist").insert({
    email: input.email,
    city_name: input.cityName ?? null,
    city_territory_id: input.cityTerritoryId ?? null,
    source: input.source,
  });

  if (error) {
    if (error.code === "23505") return { status: "duplicate" }; // unique lower(email)
    console.error("[waitlist] insert falhou:", error.message);
    return { status: "error", message: "Não conseguimos salvar agora. Tenta de novo em instantes." };
  }

  // E-mail de confirmacao (double opt-in). Falha do Resend nao quebra a inscricao (doc 06 §3.5).
  const { data: row } = await db
    .from("waitlist")
    .select("confirm_token")
    .eq("email", input.email)
    .single();

  if (row?.confirm_token) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const tpl = waitlistConfirmEmail(`${siteUrl}/confirmar?token=${row.confirm_token}`);
    const sent = await sendEmail({ to: input.email, ...tpl });
    if (!sent.ok) console.error("[waitlist] e-mail de confirmação falhou:", sent.error);
  }

  if (input.utm) {
    await db.from("events").insert({ kind: "cta_click", meta: { utm: input.utm, place: "waitlist" } });
  }

  return { status: "ok" };
}

export async function resendConfirmation(raw: unknown): Promise<{ ok: boolean }> {
  const email = z.string().trim().toLowerCase().pipe(z.string().email()).safeParse(raw);
  if (!email.success) return { ok: false };
  const db = getServiceClient();
  if (!db) return { ok: true };
  const { data: row } = await db
    .from("waitlist")
    .select("confirm_token")
    .eq("email", email.data)
    .is("confirmed_at", null)
    .maybeSingle();
  if (row?.confirm_token) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const tpl = waitlistConfirmEmail(`${siteUrl}/confirmar?token=${row.confirm_token}`);
    await sendEmail({ to: email.data, ...tpl });
  }
  return { ok: true }; // nao revela existencia do e-mail
}

export async function trackEvent(raw: unknown): Promise<{ ok: boolean }> {
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { ok: false };
  const db = getServiceClient();
  if (!db) return { ok: true };
  const { error } = await db.from("events").insert({ kind: parsed.data.kind, meta: parsed.data.meta });
  if (error) console.error("[events] insert falhou:", error.message);
  return { ok: !error };
}
