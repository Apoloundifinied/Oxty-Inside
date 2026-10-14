import { describe, it, expect } from "vitest";
import { waitlistSchema, eventSchema } from "@/lib/domains";

describe("waitlistSchema", () => {
  it("normaliza e-mail para minusculas (dedup case-insensitive)", () => {
    const r = waitlistSchema.parse({ email: "  Maria.Silva@GMAIL.com ", source: "reddit" });
    expect(r.email).toBe("maria.silva@gmail.com");
  });

  it("rejeita e-mail invalido", () => {
    expect(waitlistSchema.safeParse({ email: "nao-e-email", source: "outro" }).success).toBe(false);
  });

  it("valida codigo IBGE de 7 digitos quando informado", () => {
    expect(
      waitlistSchema.safeParse({ email: "a@b.com", source: "outro", cityTerritoryId: "123" }).success
    ).toBe(false);
    expect(
      waitlistSchema.safeParse({ email: "a@b.com", source: "outro", cityTerritoryId: "2927408" }).success
    ).toBe(true);
  });

  it("aplica source padrao 'outro' e rejeita fonte desconhecida", () => {
    const r = waitlistSchema.parse({ email: "a@b.com" });
    expect(r.source).toBe("outro");
    expect(waitlistSchema.safeParse({ email: "a@b.com", source: "google" }).success).toBe(false);
  });
});

describe("eventSchema", () => {
  it("aceita apenas kinds conhecidos", () => {
    expect(eventSchema.safeParse({ kind: "city_check_missing", meta: {} }).success).toBe(true);
    expect(eventSchema.safeParse({ kind: "hack", meta: {} }).success).toBe(false);
  });
});
