import { describe, expect, it } from "vitest";

import { Verification } from "@/business/entities/user/verification.entity";

describe("Verification.create", () => {
  const VALID_PROPS = {
    identifier: "reset-password:jose@example.com",
    value: "reset-token",
    expiresAt: new Date("2026-02-01T00:00:00.000Z"),
  };

  it("creates a valid verification with default values", () => {
    const VERIFICATION = Verification.create(VALID_PROPS);

    expect(VERIFICATION.id).toBeUndefined();
    expect(VERIFICATION.identifier).toBe("reset-password:jose@example.com");
    expect(VERIFICATION.value).toBe("reset-token");
    expect(VERIFICATION.expiresAt).toEqual(
      new Date("2026-02-01T00:00:00.000Z"),
    );
    expect(VERIFICATION.createdAt).toBeInstanceOf(Date);
    expect(VERIFICATION.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a verification with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const VERIFICATION = Verification.create(VALID_PROPS, ID);

    expect(VERIFICATION.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const VERIFICATION = Verification.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(VERIFICATION.createdAt).toBe(CREATED_AT);
    expect(VERIFICATION.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the identifier is blank", () => {
    expect(() =>
      Verification.create({ ...VALID_PROPS, identifier: " " }),
    ).toThrow("Verification must have an identifier.");
  });

  it("throws when the value is blank", () => {
    expect(() => Verification.create({ ...VALID_PROPS, value: "" })).toThrow(
      "Verification must have a value.",
    );
  });

  it("throws when the expiration date is missing", () => {
    const { expiresAt: _, ...REST } = VALID_PROPS;

    expect(() =>
      Verification.create(REST as Parameters<typeof Verification.create>[0]),
    ).toThrow("Verification must have an expiration date.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Verification.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Verification.equals", () => {
  const VALID_PROPS = {
    identifier: "reset-password:jose@example.com",
    value: "reset-token",
    expiresAt: new Date("2026-02-01T00:00:00.000Z"),
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const VERIFICATION = Verification.create(VALID_PROPS, ID);

    expect(VERIFICATION.equals(VERIFICATION)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Verification.create(VALID_PROPS, ID);
    const B = Verification.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Verification.create(VALID_PROPS, ID);
    const B = Verification.create(
      VALID_PROPS,
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Verification.create(VALID_PROPS, ID);
    const B = Verification.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const VERIFICATION = Verification.create(VALID_PROPS, ID);

    expect(VERIFICATION.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const VERIFICATION = Verification.create(VALID_PROPS, ID);

    expect(VERIFICATION.equals(undefined)).toBe(false);
  });
});
