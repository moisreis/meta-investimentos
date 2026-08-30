import { describe, expect, it } from "vitest";

import { Statement } from "@/business/entities/report/statement.entity";

describe("Statement.create", () => {
  const VALID_PROPS = {
    periodStart: new Date("2026-01-01T00:00:00.000Z"),
    periodEnd: new Date("2026-01-31T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/january.pdf",
  };

  it("creates a valid statement with default values", () => {
    const STATEMENT = Statement.create(VALID_PROPS);

    expect(STATEMENT.id).toBeUndefined();
    expect(STATEMENT.portfolioId).toBeNull();
    expect(STATEMENT.periodStart).toStrictEqual(
      new Date("2026-01-01T00:00:00.000Z"),
    );
    expect(STATEMENT.periodEnd).toStrictEqual(
      new Date("2026-01-31T00:00:00.000Z"),
    );
    expect(STATEMENT.fileUrl).toBe(
      "https://example.com/statements/january.pdf",
    );
    expect(STATEMENT.generatedByUserId).toBeNull();
    expect(STATEMENT.createdAt).toBeInstanceOf(Date);
  });

  it("creates a statement with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const STATEMENT = Statement.create(VALID_PROPS, ID);

    expect(STATEMENT.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");

    const STATEMENT = Statement.create({
      ...VALID_PROPS,
      portfolioId: "9a77b1c2-3d94-4a4a-9a6f-b3f916f7b4a2",
      generatedByUserId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
      createdAt: CREATED_AT,
    });

    expect(STATEMENT.portfolioId).toBe("9a77b1c2-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(STATEMENT.generatedByUserId).toBe(
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );
    expect(STATEMENT.createdAt).toBe(CREATED_AT);
  });

  it("throws when the period start is missing", () => {
    const { periodStart: _, ...REST } = VALID_PROPS;

    expect(() =>
      Statement.create(REST as Parameters<typeof Statement.create>[0]),
    ).toThrow("Statement must have a period start.");
  });

  it("throws when the period end is missing", () => {
    const { periodEnd: _, ...REST } = VALID_PROPS;

    expect(() =>
      Statement.create(REST as Parameters<typeof Statement.create>[0]),
    ).toThrow("Statement must have a period end.");
  });

  it("throws when the file url is blank", () => {
    const { fileUrl: _, ...REST } = VALID_PROPS;

    expect(() =>
      Statement.create(REST as Parameters<typeof Statement.create>[0]),
    ).toThrow("Statement must have a file url.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Statement.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Statement.equals", () => {
  const VALID_PROPS = {
    periodStart: new Date("2026-01-01T00:00:00.000Z"),
    periodEnd: new Date("2026-01-31T00:00:00.000Z"),
    fileUrl: "https://example.com/statements/january.pdf",
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const STATEMENT = Statement.create(VALID_PROPS, ID);

    expect(STATEMENT.equals(STATEMENT)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Statement.create(VALID_PROPS, ID);
    const B = Statement.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Statement.create(VALID_PROPS, ID);
    const B = Statement.create(
      VALID_PROPS,
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Statement.create(VALID_PROPS, ID);
    const B = Statement.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const STATEMENT = Statement.create(VALID_PROPS, ID);

    expect(STATEMENT.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const STATEMENT = Statement.create(VALID_PROPS, ID);

    expect(STATEMENT.equals(undefined)).toBe(false);
  });
});
