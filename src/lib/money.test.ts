import { describe, expect, it } from "vitest";
import { parseSolesToCents } from "./money";

describe("parseSolesToCents", () => {
  it("convierte un monto con punto decimal a céntimos", () => {
    expect(parseSolesToCents("1299.90")).toBe(129990);
  });

  it("acepta la coma como separador decimal", () => {
    expect(parseSolesToCents("1299,90")).toBe(129990);
  });

  it("devuelve null si el texto no es un monto o tiene más de dos decimales", () => {
    expect(parseSolesToCents("abc")).toBeNull();
    expect(parseSolesToCents("12.345")).toBeNull();
  });
});
