import { describe, expect, it } from "vitest";

import { Bank } from "@/business/entities/bank/bank.entity";

describe("Bank.create", () => {
  const VALID_PROPS = {
    code: "001",
    name: "Banco do Brasil",
  };

  it("creates a valid bank with default values", () => {
    const BANK = Bank.create(VALID_PROPS);

    expect(BANK.id).toBeUndefined();
    expect(BANK.code).toBe("001");
    expect(BANK.name).toBe("Banco do Brasil");
    expect(BANK.createdAt).toBeInstanceOf(Date);
    expect(BANK.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a bank with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const BANK = Bank.create(VALID_PROPS, ID);

    expect(BANK.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const BANK = Bank.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(BANK.createdAt).toBe(CREATED_AT);
    expect(BANK.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the code is blank", () => {
    expect(() => Bank.create({ ...VALID_PROPS, code: " " })).toThrow(
      "Bank must have a code.",
    );
  });

  it("throws when the name is blank", () => {
    expect(() => Bank.create({ ...VALID_PROPS, name: "" })).toThrow(
      "Bank must have a name.",
    );
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Bank.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Bank.equals", () => {
  const VALID_PROPS = {
    code: "001",
    name: "Banco do Brasil",
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const BANK = Bank.create(VALID_PROPS, ID);

    expect(BANK.equals(BANK)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Bank.create(VALID_PROPS, ID);
    const B = Bank.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Bank.create(VALID_PROPS, ID);
    const B = Bank.create(VALID_PROPS, "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Bank.create(VALID_PROPS, ID);
    const B = Bank.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const BANK = Bank.create(VALID_PROPS, ID);

    expect(BANK.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const BANK = Bank.create(VALID_PROPS, ID);

    expect(BANK.equals(undefined)).toBe(false);
  });
});
