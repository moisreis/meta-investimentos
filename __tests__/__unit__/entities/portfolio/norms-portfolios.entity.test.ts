import { describe, expect, it } from "vitest";

import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("NormsPortfolios.create", () => {
  const VALID_PROPS = {
    normId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    portfolioId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };

  it("creates a valid norms-portfolios relation with default values", () => {
    const RELATION = NormsPortfolios.create(VALID_PROPS);

    expect(RELATION.id).toBeUndefined();
    expect(RELATION.normId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(RELATION.portfolioId).toBe("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");
    expect(RELATION.minAllocation.value.toString()).toBe("5");
    expect(RELATION.maxAllocation.value.toString()).toBe("20");
    expect(RELATION.targetAllocation.value.toString()).toBe("12");
    expect(RELATION.createdAt).toBeInstanceOf(Date);
  });

  it("creates a norms-portfolios relation with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const RELATION = NormsPortfolios.create(VALID_PROPS, ID);

    expect(RELATION.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");

    const RELATION = NormsPortfolios.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
    });

    expect(RELATION.createdAt).toBe(CREATED_AT);
  });

  it("throws when the norm id is blank", () => {
    expect(() =>
      NormsPortfolios.create({
        ...VALID_PROPS,
        normId: " " as unknown as EntityId,
      }),
    ).toThrow("NormsPortfolios must have a norm id.");
  });

  it("throws when the portfolio id is blank", () => {
    expect(() =>
      NormsPortfolios.create({
        ...VALID_PROPS,
        portfolioId: " " as unknown as EntityId,
      }),
    ).toThrow("NormsPortfolios must have a portfolio id.");
  });

  it("throws when the minimum allocation is missing", () => {
    const { minAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      NormsPortfolios.create(
        REST as Parameters<typeof NormsPortfolios.create>[0],
      ),
    ).toThrow("NormsPortfolios must have a minimum allocation.");
  });

  it("throws when the maximum allocation is missing", () => {
    const { maxAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      NormsPortfolios.create(
        REST as Parameters<typeof NormsPortfolios.create>[0],
      ),
    ).toThrow("NormsPortfolios must have a maximum allocation.");
  });

  it("throws when the target allocation is missing", () => {
    const { targetAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      NormsPortfolios.create(
        REST as Parameters<typeof NormsPortfolios.create>[0],
      ),
    ).toThrow("NormsPortfolios must have a target allocation.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    NormsPortfolios.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("NormsPortfolios.equals", () => {
  const VALID_PROPS = {
    normId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    portfolioId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const RELATION = NormsPortfolios.create(VALID_PROPS, ID);

    expect(RELATION.equals(RELATION)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = NormsPortfolios.create(VALID_PROPS, ID);
    const B = NormsPortfolios.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = NormsPortfolios.create(VALID_PROPS, ID);
    const B = NormsPortfolios.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = NormsPortfolios.create(VALID_PROPS, ID);
    const B = NormsPortfolios.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const RELATION = NormsPortfolios.create(VALID_PROPS, ID);

    expect(RELATION.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const RELATION = NormsPortfolios.create(VALID_PROPS, ID);

    expect(RELATION.equals(undefined)).toBe(false);
  });
});
