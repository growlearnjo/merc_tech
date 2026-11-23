import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin";

describe("isAdminEmail", () => {
  it("acepta un correo que está en la lista", () => {
    expect(isAdminEmail("admin@example.com", "otra@example.com,admin@example.com")).toBe(true);
  });

  it("rechaza un correo que no está en la lista", () => {
    expect(isAdminEmail("cliente@example.com", "admin@example.com")).toBe(false);
  });

  it("rechaza a todos si la variable está vacía o no existe", () => {
    expect(isAdminEmail("admin@example.com", "")).toBe(false);
    expect(isAdminEmail("admin@example.com", undefined)).toBe(false);
  });

  it("ignora mayúsculas y espacios alrededor de cada correo", () => {
    expect(isAdminEmail("Admin@Example.com", " otra@example.com , admin@example.com ")).toBe(true);
  });
});
