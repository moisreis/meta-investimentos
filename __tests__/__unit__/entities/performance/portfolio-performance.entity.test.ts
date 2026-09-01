import { describe, expect, it } from "vitest";

import { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("PortfolioPerformance.create", () => {
  const VALID_PROPS = {
    portfolioId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    quotasHeld: QuotaQuantity.create("100"),
    patrimony: PositiveMoney.create("10000"),
    applicationTotal: PositiveMoney.create("5000"),
    redemptionTotal: PositiveMoney.create("2000"),
    cashFlowNet: SignedMoney.create("3000"),
    earnings: SignedMoney.create("1250.50"),
    returnDaily: SignedPercentage.create("0.35"),
  };

  it("creates a valid portfolio performance with default values", () => {
    const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(VALID_PROPS);

    expect(PORTFOLIO_PERFORMANCE.id).toBeUndefined();
    expect(PORTFOLIO_PERFORMANCE.portfolioId).toBe(
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );
    expect(PORTFOLIO_PERFORMANCE.date).toEqual(
      new Date("2026-01-01T00:00:00.000Z"),
    );
    expect(PORTFOLIO_PERFORMANCE.quotasHeld.value.toString()).toBe("100");
    expect(PORTFOLIO_PERFORMANCE.patrimony.value.toString()).toBe("10000");
    expect(PORTFOLIO_PERFORMANCE.applicationTotal.value.toString()).toBe(
      "5000",
    );
    expect(PORTFOLIO_PERFORMANCE.redemptionTotal.value.toString()).toBe("2000");
    expect(PORTFOLIO_PERFORMANCE.cashFlowNet.value.toString()).toBe("3000");
    expect(PORTFOLIO_PERFORMANCE.earnings.value.toString()).toBe("1250.5");
    expect(PORTFOLIO_PERFORMANCE.returnDaily.value.toString()).toBe("0.35");
    expect(PORTFOLIO_PERFORMANCE.returnMonthly).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.returnYearly).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.returnLast12m).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.target).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.cumulativeTarget).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.inflationSpread).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.riskFreeSpread).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.marketSpread).toBeNull();
    expect(PORTFOLIO_PERFORMANCE.createdAt).toBeInstanceOf(Date);
  });

  it("creates a portfolio performance with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(VALID_PROPS, ID);

    expect(PORTFOLIO_PERFORMANCE.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const RETURN_MONTHLY = SignedPercentage.create("8.1");
    const RETURN_YEARLY = SignedPercentage.create("15.0");
    const RETURN_LAST_12M = SignedPercentage.create("13.4");
    const TARGET = SignedPercentage.create("11");
    const CUMULATIVE_TARGET = SignedPercentage.create("22");
    const INFLATION_SPREAD = SignedPercentage.create("2.7");
    const RISK_FREE_SPREAD = SignedPercentage.create("1.8");
    const MARKET_SPREAD = SignedPercentage.create("-0.2");

    const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create({
      ...VALID_PROPS,
      returnMonthly: RETURN_MONTHLY,
      returnYearly: RETURN_YEARLY,
      returnLast12m: RETURN_LAST_12M,
      target: TARGET,
      cumulativeTarget: CUMULATIVE_TARGET,
      inflationSpread: INFLATION_SPREAD,
      riskFreeSpread: RISK_FREE_SPREAD,
      marketSpread: MARKET_SPREAD,
      createdAt: CREATED_AT,
    });

    expect(PORTFOLIO_PERFORMANCE.returnMonthly).toBe(RETURN_MONTHLY);
    expect(PORTFOLIO_PERFORMANCE.returnYearly).toBe(RETURN_YEARLY);
    expect(PORTFOLIO_PERFORMANCE.returnLast12m).toBe(RETURN_LAST_12M);
    expect(PORTFOLIO_PERFORMANCE.target).toBe(TARGET);
    expect(PORTFOLIO_PERFORMANCE.cumulativeTarget).toBe(CUMULATIVE_TARGET);
    expect(PORTFOLIO_PERFORMANCE.inflationSpread).toBe(INFLATION_SPREAD);
    expect(PORTFOLIO_PERFORMANCE.riskFreeSpread).toBe(RISK_FREE_SPREAD);
    expect(PORTFOLIO_PERFORMANCE.marketSpread).toBe(MARKET_SPREAD);
    expect(PORTFOLIO_PERFORMANCE.createdAt).toBe(CREATED_AT);
  });

  it("throws when the portfolio id is blank", () => {
    expect(() =>
      PortfolioPerformance.create({
        ...VALID_PROPS,
        portfolioId: " " as unknown as EntityId,
      }),
    ).toThrow("PortfolioPerformance must have a portfolio id.");
  });

  it("throws when the date is not provided", () => {
    const { date: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have a date.");
  });

  it("throws when the quotas held are not provided", () => {
    const { quotasHeld: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have quotas held.");
  });

  it("throws when the patrimony is not provided", () => {
    const { patrimony: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have patrimony.");
  });

  it("throws when the application total is not provided", () => {
    const { applicationTotal: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have an application total.");
  });

  it("throws when the redemption total is not provided", () => {
    const { redemptionTotal: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have a redemption total.");
  });

  it("throws when the cash flow net is not provided", () => {
    const { cashFlowNet: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have cash flow net.");
  });

  it("throws when the earnings are not provided", () => {
    const { earnings: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have earnings.");
  });

  it("throws when the daily return is not provided", () => {
    const { returnDaily: _, ...REST } = VALID_PROPS;

    expect(() =>
      PortfolioPerformance.create(
        REST as Parameters<typeof PortfolioPerformance.create>[0],
      ),
    ).toThrow("PortfolioPerformance must have a daily return.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    PortfolioPerformance.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("PortfolioPerformance.equals", () => {
  const VALID_PROPS = {
    portfolioId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    quotasHeld: QuotaQuantity.create("100"),
    patrimony: PositiveMoney.create("10000"),
    applicationTotal: PositiveMoney.create("5000"),
    redemptionTotal: PositiveMoney.create("2000"),
    cashFlowNet: SignedMoney.create("3000"),
    earnings: SignedMoney.create("1250.50"),
    returnDaily: SignedPercentage.create("0.35"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(VALID_PROPS, ID);

    expect(PORTFOLIO_PERFORMANCE.equals(PORTFOLIO_PERFORMANCE)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = PortfolioPerformance.create(VALID_PROPS, ID);
    const B = PortfolioPerformance.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = PortfolioPerformance.create(VALID_PROPS, ID);
    const B = PortfolioPerformance.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = PortfolioPerformance.create(VALID_PROPS, ID);
    const B = PortfolioPerformance.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(VALID_PROPS, ID);

    expect(PORTFOLIO_PERFORMANCE.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const PORTFOLIO_PERFORMANCE = PortfolioPerformance.create(VALID_PROPS, ID);

    expect(PORTFOLIO_PERFORMANCE.equals(undefined)).toBe(false);
  });
});
