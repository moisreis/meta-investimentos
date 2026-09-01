import { describe, expect, it } from "vitest";

import { Norm } from "@/business/entities/portfolio/norm.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("Norm.create", () => {
  const VALID_PROPS = {
    articleNumber: "Art. 12",
    name: "Limite de Concentração",
    categoryId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };

  it("creates a valid norm with default values", () => {
    const NORM = Norm.create(VALID_PROPS);

    expect(NORM.id).toBeUndefined();
    expect(NORM.articleNumber).toBe("Art. 12");
    expect(NORM.name).toBe("Limite de Concentração");
    expect(NORM.categoryId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(NORM.minAllocation.value.toString()).toBe("5");
    expect(NORM.maxAllocation.value.toString()).toBe("20");
    expect(NORM.targetAllocation.value.toString()).toBe("12");
    expect(NORM.createdAt).toBeInstanceOf(Date);
    expect(NORM.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a norm with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const NORM = Norm.create(VALID_PROPS, ID);

    expect(NORM.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const NORM = Norm.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(NORM.createdAt).toBe(CREATED_AT);
    expect(NORM.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the article number is blank", () => {
    expect(() => Norm.create({ ...VALID_PROPS, articleNumber: " " })).toThrow(
      "Norm must have an article number.",
    );
  });

  it("throws when the name is blank", () => {
    expect(() => Norm.create({ ...VALID_PROPS, name: "" })).toThrow(
      "Norm must have a name.",
    );
  });

  it("throws when the category id is blank", () => {
    expect(() =>
      Norm.create({ ...VALID_PROPS, categoryId: " " as unknown as EntityId }),
    ).toThrow("Norm must have a category id.");
  });

  it("throws when the minimum allocation is missing", () => {
    const { minAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      Norm.create(REST as Parameters<typeof Norm.create>[0]),
    ).toThrow("Norm must have a minimum allocation.");
  });

  it("throws when the maximum allocation is missing", () => {
    const { maxAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      Norm.create(REST as Parameters<typeof Norm.create>[0]),
    ).toThrow("Norm must have a maximum allocation.");
  });

  it("throws when the target allocation is missing", () => {
    const { targetAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      Norm.create(REST as Parameters<typeof Norm.create>[0]),
    ).toThrow("Norm must have a target allocation.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Norm.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Norm.equals", () => {
  const VALID_PROPS = {
    articleNumber: "Art. 12",
    name: "Limite de Concentração",
    categoryId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const NORM = Norm.create(VALID_PROPS, ID);

    expect(NORM.equals(NORM)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Norm.create(VALID_PROPS, ID);
    const B = Norm.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Norm.create(VALID_PROPS, ID);
    const B = Norm.create(VALID_PROPS, "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Norm.create(VALID_PROPS, ID);
    const B = Norm.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const NORM = Norm.create(VALID_PROPS, ID);

    expect(NORM.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const NORM = Norm.create(VALID_PROPS, ID);

    expect(NORM.equals(undefined)).toBe(false);
  });
});
