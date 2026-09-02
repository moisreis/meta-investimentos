import { describe, expect, it } from "vitest";

import { ApplicationReversed } from "@/business/domain-events/events/application-reversed.event";
import { PortfolioAllocationUpdated } from "@/business/domain-events/events/portfolio-allocation-updated.event";
import { PortfolioAnnualInterestRateUpdated } from "@/business/domain-events/events/portfolio-annual-interest-rate-updated.event";
import { PositionInitialBalanceSet } from "@/business/domain-events/events/position-initial-balance-set.event";
import { WithdrawalReversed } from "@/business/domain-events/events/withdrawal-reversed.event";
import { EntityId } from "@/business/value-objects/entity-id.vo";

const REVERSED_BY = EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");

describe("ApplicationReversed", () => {
  it("carries the application id and the reversing user id", () => {
    const ID = EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");

    const EVENT = new ApplicationReversed(ID, REVERSED_BY);

    expect(EVENT.applicationId).toBe(ID);
    expect(EVENT.reversedByUserId).toBe(REVERSED_BY);
  });
});

describe("WithdrawalReversed", () => {
  it("carries the withdrawal id and the reversing user id", () => {
    const ID = EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");

    const EVENT = new WithdrawalReversed(ID, REVERSED_BY);

    expect(EVENT.withdrawalId).toBe(ID);
    expect(EVENT.reversedByUserId).toBe(REVERSED_BY);
  });
});

describe("PositionInitialBalanceSet", () => {
  it("carries the position id", () => {
    const ID = EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");

    const EVENT = new PositionInitialBalanceSet(ID);

    expect(EVENT.positionId).toBe(ID);
  });
});

describe("PortfolioAllocationUpdated", () => {
  it("carries the portfolio id", () => {
    const ID = EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");

    const EVENT = new PortfolioAllocationUpdated(ID);

    expect(EVENT.portfolioId).toBe(ID);
  });
});

describe("PortfolioAnnualInterestRateUpdated", () => {
  it("carries the portfolio id", () => {
    const ID = EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");

    const EVENT = new PortfolioAnnualInterestRateUpdated(ID);

    expect(EVENT.portfolioId).toBe(ID);
  });
});
