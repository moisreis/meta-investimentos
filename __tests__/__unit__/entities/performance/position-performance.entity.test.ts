import { describe, expect, it } from "vitest";

import { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("PositionPerformance.create", () => {
  const VALID_PROPS = {
    positionId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    quotasHeld: QuotaQuantity.create("100"),
    patrimony: PositiveMoney.create("10000"),
    applicationTotal: PositiveMoney.create("5000"),
    redemptionTotal: PositiveMoney.create("2000"),
    cashFlowNet: SignedMoney.create("3000"),
    earnings: SignedMoney.create("1250.50"),
    returnDaily: SignedPercentage.create("0.35"),
    allocation: SignedPercentage.create("25.5"),
  };

  it("creates a valid position performance with default values", () => {
    const POSITION_PERFORMANCE = PositionPerformance.create(VALID_PROPS);

    expect(POSITION_PERFORMANCE.id).toBeUndefined();
    expect(POSITION_PERFORMANCE.positionId).toBe(
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );
    expect(POSITION_PERFORMANCE.date).toEqual(
      new Date("2026-01-01T00:00:00.000Z"),
    );
    expect(POSITION_PERFORMANCE.quotasHeld.value.toString()).toBe("100");
    expect(POSITION_PERFORMANCE.patrimony.value.toString()).toBe("10000");
    expect(POSITION_PERFORMANCE.applicationTotal.value.toString()).toBe("5000");
    expect(POSITION_PERFORMANCE.redemptionTotal.value.toString()).toBe("2000");
    expect(POSITION_PERFORMANCE.cashFlowNet.value.toString()).toBe("3000");
    expect(POSITION_PERFORMANCE.earnings.value.toString()).toBe("1250.5");
    expect(POSITION_PERFORMANCE.returnDaily.value.toString()).toBe("0.35");
    expect(POSITION_PERFORMANCE.returnMonthly).toBeNull();
    expect(POSITION_PERFORMANCE.returnYearly).toBeNull();
    expect(POSITION_PERFORMANCE.returnLast12m).toBeNull();
    expect(POSITION_PERFORMANCE.allocation.value.toString()).toBe("25.5");
    expect(POSITION_PERFORMANCE.createdAt).toBeInstanceOf(Date);
  });

  it("creates a position performance with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const POSITION_PERFORMANCE = PositionPerformance.create(VALID_PROPS, ID);

    expect(POSITION_PERFORMANCE.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const RETURN_MONTHLY = SignedPercentage.create("8.1");
    const RETURN_YEARLY = SignedPercentage.create("15.0");
    const RETURN_LAST_12M = SignedPercentage.create("13.4");

    const POSITION_PERFORMANCE = PositionPerformance.create({
      ...VALID_PROPS,
      returnMonthly: RETURN_MONTHLY,
      returnYearly: RETURN_YEARLY,
      returnLast12m: RETURN_LAST_12M,
      createdAt: CREATED_AT,
    });

    expect(POSITION_PERFORMANCE.returnMonthly).toBe(RETURN_MONTHLY);
    expect(POSITION_PERFORMANCE.returnYearly).toBe(RETURN_YEARLY);
    expect(POSITION_PERFORMANCE.returnLast12m).toBe(RETURN_LAST_12M);
    expect(POSITION_PERFORMANCE.createdAt).toBe(CREATED_AT);
  });

  it("throws when the position id is blank", () => {
    expect(() =>
      PositionPerformance.create({
        ...VALID_PROPS,
        positionId: " " as unknown as EntityId,
      }),
    ).toThrow("PositionPerformance must have a position id.");
  });

  it("throws when the date is not provided", () => {
    const { date: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have a date.");
  });

  it("throws when the quotas held are not provided", () => {
    const { quotasHeld: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have quotas held.");
  });

  it("throws when the patrimony is not provided", () => {
    const { patrimony: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have patrimony.");
  });

  it("throws when the application total is not provided", () => {
    const { applicationTotal: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have an application total.");
  });

  it("throws when the redemption total is not provided", () => {
    const { redemptionTotal: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have a redemption total.");
  });

  it("throws when the cash flow net is not provided", () => {
    const { cashFlowNet: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have cash flow net.");
  });

  it("throws when the earnings are not provided", () => {
    const { earnings: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have earnings.");
  });

  it("throws when the daily return is not provided", () => {
    const { returnDaily: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have a daily return.");
  });

  it("throws when the allocation is not provided", () => {
    const { allocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      PositionPerformance.create(
        REST as Parameters<typeof PositionPerformance.create>[0],
      ),
    ).toThrow("PositionPerformance must have an allocation.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    PositionPerformance.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("PositionPerformance.equals", () => {
  const VALID_PROPS = {
    positionId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    quotasHeld: QuotaQuantity.create("100"),
    patrimony: PositiveMoney.create("10000"),
    applicationTotal: PositiveMoney.create("5000"),
    redemptionTotal: PositiveMoney.create("2000"),
    cashFlowNet: SignedMoney.create("3000"),
    earnings: SignedMoney.create("1250.50"),
    returnDaily: SignedPercentage.create("0.35"),
    allocation: SignedPercentage.create("25.5"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const POSITION_PERFORMANCE = PositionPerformance.create(VALID_PROPS, ID);

    expect(POSITION_PERFORMANCE.equals(POSITION_PERFORMANCE)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = PositionPerformance.create(VALID_PROPS, ID);
    const B = PositionPerformance.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = PositionPerformance.create(VALID_PROPS, ID);
    const B = PositionPerformance.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = PositionPerformance.create(VALID_PROPS, ID);
    const B = PositionPerformance.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const POSITION_PERFORMANCE = PositionPerformance.create(VALID_PROPS, ID);

    expect(POSITION_PERFORMANCE.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const POSITION_PERFORMANCE = PositionPerformance.create(VALID_PROPS, ID);

    expect(POSITION_PERFORMANCE.equals(undefined)).toBe(false);
  });
});
