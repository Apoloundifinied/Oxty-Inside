import { z } from "zod";

export const WAITLIST_SOURCES = ["reddit", "whatsapp", "telegram", "indicacao", "outro"] as const;

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase()) // dedup case-insensitive (doc 06 §4)
    .pipe(z.string().email("Esse e-mail não parece válido. Confere aí?").max(320)),
  cityName: z.string().trim().max(120).optional(),
  cityTerritoryId: z.string().trim().regex(/^\d{7}$/, "código IBGE inválido").optional(),
  source: z.enum(WAITLIST_SOURCES).default("outro"),
  turnstileToken: z.string().optional(),
  utm: z.record(z.string(), z.string().max(200)).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export const EVENT_KINDS = ["page_view", "cta_click", "city_check_covered", "city_check_missing"] as const;

export const eventSchema = z.object({
  kind: z.enum(EVENT_KINDS),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export interface CoverageCity {
  territory_id: string;
  name: string;
  uf: string;
  level: string;
}
