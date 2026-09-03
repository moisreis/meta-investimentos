import { describe, expect, it } from "vitest";

import { PortfolioAllocationUpdated } from "@/business/domain-events/events/portfolio-allocation-updated.event";
import { PortfolioAnnualInterestRateUpdated } from "@/business/domain-events/events/portfolio-annual-interest-rate-updated.event";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("Portfolio.create", () => {
  const VALID_PROPS = {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    annualInterestRate: SignedPercentage.create("10.5"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };

  it("creates a valid portfolio with default values", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS);

    expect(PORTFOLIO.id).toBeUndefined();
    expect(PORTFOLIO.acronym).toBe("FIA");
    expect(PORTFOLIO.name).toBe("Fundo de Investimento em Ações");
    expect(PORTFOLIO.userId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(PORTFOLIO.annualInterestRate.value.toString()).toBe("10.5");
    expect(PORTFOLIO.minAllocation.value.toString()).toBe("5");
    expect(PORTFOLIO.maxAllocation.value.toString()).toBe("20");
    expect(PORTFOLIO.targetAllocation.value.toString()).toBe("12");
    expect(PORTFOLIO.createdAt).toBeInstanceOf(Date);
    expect(PORTFOLIO.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a portfolio with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    expect(PORTFOLIO.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const PORTFOLIO = Portfolio.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(PORTFOLIO.createdAt).toBe(CREATED_AT);
    expect(PORTFOLIO.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the acronym is blank", () => {
    expect(() => Portfolio.create({ ...VALID_PROPS, acronym: " " })).toThrow(
      "Portfolio must have an acronym.",
    );
  });

  it("throws when the name is blank", () => {
    expect(() => Portfolio.create({ ...VALID_PROPS, name: "" })).toThrow(
      "Portfolio must have a name.",
    );
  });

  it("throws when the user id is blank", () => {
    expect(() =>
      Portfolio.create({ ...VALID_PROPS, userId: " " as unknown as EntityId }),
    ).toThrow("Portfolio must have a user id.");
  });

  it("throws when the annual interest rate is missing", () => {
    const { annualInterestRate: _, ...REST } = VALID_PROPS;

    expect(() =>
      Portfolio.create(REST as Parameters<typeof Portfolio.create>[0]),
    ).toThrow("Portfolio must have an annual interest rate.");
  });

  it("throws when the minimum allocation is missing", () => {
    const { minAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      Portfolio.create(REST as Parameters<typeof Portfolio.create>[0]),
    ).toThrow("Portfolio must have a minimum allocation.");
  });

  it("throws when the maximum allocation is missing", () => {
    const { maxAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      Portfolio.create(REST as Parameters<typeof Portfolio.create>[0]),
    ).toThrow("Portfolio must have a maximum allocation.");
  });

  it("throws when the target allocation is missing", () => {
    const { targetAllocation: _, ...REST } = VALID_PROPS;

    expect(() =>
      Portfolio.create(REST as Parameters<typeof Portfolio.create>[0]),
    ).toThrow("Portfolio must have a target allocation.");
  });

  it("throws when the annual interest rate is negative", () => {
    expect(() =>
      Portfolio.create({
        ...VALID_PROPS,
        annualInterestRate: SignedPercentage.create("-10"),
      }),
    ).toThrow("Portfolio annual interest rate must not be negative.");
  });

  it("throws when the minimum allocation exceeds the target allocation", () => {
    expect(() =>
      Portfolio.create({
        ...VALID_PROPS,
        minAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      }),
    ).toThrow(
      "Portfolio minimum allocation must not exceed target allocation.",
    );
  });

  it("throws when the target allocation exceeds the maximum allocation", () => {
    expect(() =>
      Portfolio.create({
        ...VALID_PROPS,
        targetAllocation: SignedPercentage.create("25"),
        maxAllocation: SignedPercentage.create("20"),
      }),
    ).toThrow(
      "Portfolio target allocation must not exceed maximum allocation.",
    );
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Portfolio.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Portfolio.equals", () => {
  const VALID_PROPS = {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    annualInterestRate: SignedPercentage.create("10.5"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    expect(PORTFOLIO.equals(PORTFOLIO)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Portfolio.create(VALID_PROPS, ID);
    const B = Portfolio.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Portfolio.create(VALID_PROPS, ID);
    const B = Portfolio.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Portfolio.create(VALID_PROPS, ID);
    const B = Portfolio.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    expect(PORTFOLIO.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    expect(PORTFOLIO.equals(undefined)).toBe(false);
  });
});

describe("Portfolio.updateAllocation", () => {
  const VALID_PROPS = {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    annualInterestRate: SignedPercentage.create("10.5"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("updates the allocation bounds and the update timestamp", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);
    const NOW = new Date("2026-01-02T00:00:00.000Z");

    const UPDATED = PORTFOLIO.updateAllocation(
      SignedPercentage.create("10"),
      SignedPercentage.create("15"),
      SignedPercentage.create("25"),
      NOW,
    );

    expect(UPDATED.id).toBe(ID);
    expect(UPDATED.minAllocation.value.toString()).toBe("10");
    expect(UPDATED.targetAllocation.value.toString()).toBe("15");
    expect(UPDATED.maxAllocation.value.toString()).toBe("25");
    expect(UPDATED.updatedAt).toBe(NOW);
    expect(UPDATED.acronym).toBe("FIA");
    expect(UPDATED.equals(PORTFOLIO)).toBe(true);
  });

  it("does not mutate the original portfolio", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    PORTFOLIO.updateAllocation(
      SignedPercentage.create("10"),
      SignedPercentage.create("15"),
      SignedPercentage.create("25"),
    );

    expect(PORTFOLIO.minAllocation.value.toString()).toBe("5");
    expect(PORTFOLIO.targetAllocation.value.toString()).toBe("12");
    expect(PORTFOLIO.maxAllocation.value.toString()).toBe("20");
  });

  it("throws when the minimum allocation exceeds the target allocation", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    expect(() =>
      PORTFOLIO.updateAllocation(
        SignedPercentage.create("20"),
        SignedPercentage.create("12"),
        SignedPercentage.create("25"),
      ),
    ).toThrow(
      "Portfolio minimum allocation must not exceed target allocation.",
    );
  });

  it("throws when the target allocation exceeds the maximum allocation", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    expect(() =>
      PORTFOLIO.updateAllocation(
        SignedPercentage.create("5"),
        SignedPercentage.create("30"),
        SignedPercentage.create("20"),
      ),
    ).toThrow(
      "Portfolio target allocation must not exceed maximum allocation.",
    );
  });

  it("records a PortfolioAllocationUpdated event on the returned instance", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);
    const NOW = new Date("2026-01-02T00:00:00.000Z");

    const UPDATED = PORTFOLIO.updateAllocation(
      SignedPercentage.create("10"),
      SignedPercentage.create("15"),
      SignedPercentage.create("25"),
      NOW,
    );

    const EVENTS = UPDATED.pullDomainEvents();

    expect(EVENTS).toHaveLength(1);
    expect(EVENTS[0]).toBeInstanceOf(PortfolioAllocationUpdated);
    expect(EVENTS[0]).toMatchObject({
      portfolioId: ID,
      occurredAt: NOW,
    });
  });
});

describe("Portfolio.updateAnnualInterestRate", () => {
  const VALID_PROPS = {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    annualInterestRate: SignedPercentage.create("10.5"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("updates the annual interest rate and the update timestamp", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);
    const NOW = new Date("2026-01-02T00:00:00.000Z");

    const UPDATED = PORTFOLIO.updateAnnualInterestRate(
      SignedPercentage.create("12.5"),
      NOW,
    );

    expect(UPDATED.id).toBe(ID);
    expect(UPDATED.annualInterestRate.value.toString()).toBe("12.5");
    expect(UPDATED.updatedAt).toBe(NOW);
    expect(UPDATED.equals(PORTFOLIO)).toBe(true);
  });

  it("does not mutate the original portfolio", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    PORTFOLIO.updateAnnualInterestRate(SignedPercentage.create("12.5"));

    expect(PORTFOLIO.annualInterestRate.value.toString()).toBe("10.5");
  });

  it("throws when the annual interest rate is negative", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);

    expect(() =>
      PORTFOLIO.updateAnnualInterestRate(SignedPercentage.create("-10")),
    ).toThrow("Portfolio annual interest rate must not be negative.");
  });

  it("records a PortfolioAnnualInterestRateUpdated event on the returned instance", () => {
    const PORTFOLIO = Portfolio.create(VALID_PROPS, ID);
    const NOW = new Date("2026-01-02T00:00:00.000Z");

    const UPDATED = PORTFOLIO.updateAnnualInterestRate(
      SignedPercentage.create("12.5"),
      NOW,
    );

    const EVENTS = UPDATED.pullDomainEvents();

    expect(EVENTS).toHaveLength(1);
    expect(EVENTS[0]).toBeInstanceOf(PortfolioAnnualInterestRateUpdated);
    expect(EVENTS[0]).toMatchObject({
      portfolioId: ID,
      occurredAt: NOW,
    });
  });
});
