import { describe, it, expect } from "vitest";
import { buildQueryTerms, normalizeName } from "@/lib/ingestion/queridodiario";

describe("normalizeName", () => {
  it("remove acentos e caixa alta", () => {
    expect(normalizeName("José Marçal DA SILVA")).toBe("jose marcal da silva");
  });
});

describe("buildQueryTerms", () => {
  it("usa prenome + sobrenomes raros; max 4 termos, sem aspas", () => {
    expect(buildQueryTerms("MARVALDO BITTENCOURT DA SILVA")).toBe("marvaldo bittencourt silva");
    const terms = buildQueryTerms("João Carlos Pereira de Almeida Santos");
    expect(terms.split(" ").length).toBeLessThanOrEqual(4);
    expect(terms).not.toContain('"');
    expect(terms.split(" ")[0]).toBe("joao");
  });

  it("prioriza sobrenome raro sobre comum", () => {
    expect(buildQueryTerms("Ana Silva Schmitt")).toBe("ana schmitt silva");
  });

  it("remove particulas (da/de/do)", () => {
    expect(buildQueryTerms("Maria de Jesus da Costa")).toBe("maria jesus costa");
  });

  it("nunca devolve string vazia para nome valido", () => {
    expect(buildQueryTerms("Tereza").length).toBeGreaterThan(0);
  });
});
