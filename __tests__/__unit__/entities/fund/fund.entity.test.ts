import { describe, expect, it } from "vitest";

import { Fund } from "@/business/entities/fund/fund.entity";
import CNPJ from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("Fund.create", () => {
  const ADMINISTRATION_FEE = SignedPercentage.create("1.5");
  const PERFORMANCE_FEE = SignedPercentage.create("20");

  const VALID_PROPS = {
    cnpj: CNPJ.create("12345678000195"),
    name: "Fundo de Investimento",
    administrationFee: ADMINISTRATION_FEE,
    performanceFee: PERFORMANCE_FEE,
    bankId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    benchmarkId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    categoryId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
  };

  it("creates a valid fund with default values", () => {
    const FUND = Fund.create({
      ...VALID_PROPS,
      administrationFee: undefined,
      performanceFee: undefined,
      benchmarkId: undefined,
      categoryId: undefined,
    });

    expect(FUND.id).toBeUndefined();
    expect(FUND.cnpj.value).toBe("12345678000195");
    expect(FUND.name).toBe("Fundo de Investimento");
    expect(FUND.administrationFee).toBeNull();
    expect(FUND.performanceFee).toBeNull();
    expect(FUND.bankId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(FUND.benchmarkId).toBeNull();
    expect(FUND.categoryId).toBeNull();
    expect(FUND.createdAt).toBeInstanceOf(Date);
    expect(FUND.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a fund with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const FUND = Fund.create(VALID_PROPS, ID);

    expect(FUND.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const FUND = Fund.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(FUND.administrationFee).toBe(ADMINISTRATION_FEE);
    expect(FUND.performanceFee).toBe(PERFORMANCE_FEE);
    expect(FUND.administrationFee?.value.toString()).toBe("1.5");
    expect(FUND.performanceFee?.value.toString()).toBe("20");
    expect(FUND.benchmarkId).toBe("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");
    expect(FUND.categoryId).toBe("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");
    expect(FUND.createdAt).toBe(CREATED_AT);
    expect(FUND.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the name is blank", () => {
    expect(() => Fund.create({ ...VALID_PROPS, name: "   " })).toThrow(
      "Fund must have a name.",
    );
  });

  it("throws when the bank id is blank", () => {
    expect(() =>
      Fund.create({ ...VALID_PROPS, bankId: " " as unknown as EntityId }),
    ).toThrow("Fund must have a bank id.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Fund.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Fund.equals", () => {
  const ADMINISTRATION_FEE = SignedPercentage.create("1.5");
  const PERFORMANCE_FEE = SignedPercentage.create("20");

  const VALID_PROPS = {
    cnpj: CNPJ.create("12345678000195"),
    name: "Fundo de Investimento",
    administrationFee: ADMINISTRATION_FEE,
    performanceFee: PERFORMANCE_FEE,
    bankId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    benchmarkId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    categoryId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const FUND = Fund.create(VALID_PROPS, ID);

    expect(FUND.equals(FUND)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Fund.create(VALID_PROPS, ID);
    const B = Fund.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Fund.create(VALID_PROPS, ID);
    const B = Fund.create(VALID_PROPS, "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Fund.create(VALID_PROPS, ID);
    const B = Fund.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const FUND = Fund.create(VALID_PROPS, ID);

    expect(FUND.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const FUND = Fund.create(VALID_PROPS, ID);

    expect(FUND.equals(undefined)).toBe(false);
  });
});
