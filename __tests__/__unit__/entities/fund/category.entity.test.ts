import { describe, expect, it } from "vitest";

import { Category } from "@/business/entities/fund/category.entity";

describe("Category.create", () => {
  const VALID_PROPS = {
    name: "Fundo Multimercado",
  };

  it("creates a valid category with default values", () => {
    const CATEGORY = Category.create(VALID_PROPS);

    expect(CATEGORY.id).toBeUndefined();
    expect(CATEGORY.name).toBe("Fundo Multimercado");
    expect(CATEGORY.createdAt).toBeInstanceOf(Date);
    expect(CATEGORY.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a category with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const CATEGORY = Category.create(VALID_PROPS, ID);

    expect(CATEGORY.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const CATEGORY = Category.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(CATEGORY.createdAt).toBe(CREATED_AT);
    expect(CATEGORY.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the name is blank", () => {
    expect(() => Category.create({ ...VALID_PROPS, name: "   " })).toThrow(
      "Category must have a name.",
    );
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Category.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Category.equals", () => {
  const VALID_PROPS = {
    name: "Fundo Multimercado",
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const CATEGORY = Category.create(VALID_PROPS, ID);

    expect(CATEGORY.equals(CATEGORY)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Category.create(VALID_PROPS, ID);
    const B = Category.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Category.create(VALID_PROPS, ID);
    const B = Category.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Category.create(VALID_PROPS, ID);
    const B = Category.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const CATEGORY = Category.create(VALID_PROPS, ID);

    expect(CATEGORY.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const CATEGORY = Category.create(VALID_PROPS, ID);

    expect(CATEGORY.equals(undefined)).toBe(false);
  });
});
