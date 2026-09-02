import { describe, expect, it } from "vitest";

import { Quota } from "@/business/entities/fund/quota.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";

describe("Quota.create", () => {
  const PRICE = QuotaPrice.create("4.428199");
  const DATE = new Date("2026-01-01T00:00:00.000Z");

  const VALID_PROPS = {
    fundId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: DATE,
    price: PRICE,
  };

  it("creates a valid quota with default values", () => {
    const QUOTA = Quota.create(VALID_PROPS);

    expect(QUOTA.id).toBeUndefined();
    expect(QUOTA.fundId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(QUOTA.date).toBe(DATE);
    expect(QUOTA.price.value.toString()).toBe("4.428199");
    expect(QUOTA.createdAt).toBeInstanceOf(Date);
  });

  it("creates a quota with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const QUOTA = Quota.create(VALID_PROPS, ID);

    expect(QUOTA.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const QUOTA = Quota.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
    });

    expect(QUOTA.createdAt).toBe(CREATED_AT);
  });

  it("throws when the fund id is blank", () => {
    expect(() =>
      Quota.create({ ...VALID_PROPS, fundId: "   " as unknown as EntityId }),
    ).toThrow("Quota must have a fund id.");
  });

  it("throws when the date is not provided", () => {
    const { date: _, ...REST } = VALID_PROPS;

    expect(() =>
      Quota.create(REST as Parameters<typeof Quota.create>[0]),
    ).toThrow("Quota must have a date.");
  });

  it("throws when the price is not provided", () => {
    const { price: _, ...REST } = VALID_PROPS;

    expect(() =>
      Quota.create(REST as Parameters<typeof Quota.create>[0]),
    ).toThrow("Quota must have a price.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Quota.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Quota.equals", () => {
  const PRICE = QuotaPrice.create("4.428199");
  const DATE = new Date("2026-01-01T00:00:00.000Z");

  const VALID_PROPS = {
    fundId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: DATE,
    price: PRICE,
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const QUOTA = Quota.create(VALID_PROPS, ID);

    expect(QUOTA.equals(QUOTA)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Quota.create(VALID_PROPS, ID);
    const B = Quota.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Quota.create(VALID_PROPS, ID);
    const B = Quota.create(VALID_PROPS, "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Quota.create(VALID_PROPS, ID);
    const B = Quota.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const QUOTA = Quota.create(VALID_PROPS, ID);

    expect(QUOTA.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const QUOTA = Quota.create(VALID_PROPS, ID);

    expect(QUOTA.equals(undefined)).toBe(false);
  });
});
