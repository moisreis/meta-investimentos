import { describe, expect, it } from "vitest";

import { PositionInitialBalanceSet } from "@/business/domain-events/events/position-initial-balance-set.event";
import { Position } from "@/business/entities/portfolio/position.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";

describe("Position.create", () => {
  const VALID_PROPS = {
    portfolioId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    fundId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
  };

  it("creates a valid position with default values", () => {
    const POSITION = Position.create(VALID_PROPS);

    expect(POSITION.id).toBeUndefined();
    expect(POSITION.portfolioId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(POSITION.fundId).toBe("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");
    expect(POSITION.initialBalance).toBeNull();
    expect(POSITION.initialBalanceDate).toBeNull();
    expect(POSITION.createdAt).toBeInstanceOf(Date);
    expect(POSITION.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a position with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const POSITION = Position.create(VALID_PROPS, ID);

    expect(POSITION.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");
    const INITIAL_BALANCE_DATE = new Date("2026-01-01T00:00:00.000Z");
    const INITIAL_BALANCE = PositiveMoney.create("1000.00");

    const POSITION = Position.create({
      ...VALID_PROPS,
      initialBalance: INITIAL_BALANCE,
      initialBalanceDate: INITIAL_BALANCE_DATE,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(POSITION.initialBalance?.value.toString()).toBe("1000");
    expect(POSITION.initialBalanceDate).toBe(INITIAL_BALANCE_DATE);
    expect(POSITION.createdAt).toBe(CREATED_AT);
    expect(POSITION.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the portfolio id is blank", () => {
    expect(() =>
      Position.create({
        ...VALID_PROPS,
        portfolioId: " " as unknown as EntityId,
      }),
    ).toThrow("Position must have a portfolio id.");
  });

  it("throws when the fund id is blank", () => {
    expect(() =>
      Position.create({ ...VALID_PROPS, fundId: " " as unknown as EntityId }),
    ).toThrow("Position must have a fund id.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Position.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Position.equals", () => {
  const VALID_PROPS = {
    portfolioId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    fundId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const POSITION = Position.create(VALID_PROPS, ID);

    expect(POSITION.equals(POSITION)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Position.create(VALID_PROPS, ID);
    const B = Position.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Position.create(VALID_PROPS, ID);
    const B = Position.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Position.create(VALID_PROPS, ID);
    const B = Position.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const POSITION = Position.create(VALID_PROPS, ID);

    expect(POSITION.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const POSITION = Position.create(VALID_PROPS, ID);

    expect(POSITION.equals(undefined)).toBe(false);
  });
});

describe("Position.setInitialBalance", () => {
  const VALID_PROPS = {
    portfolioId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    fundId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("sets the initial balance, its date, and increments the version", () => {
    const POSITION = Position.create(VALID_PROPS, ID);
    const INITIAL_BALANCE = PositiveMoney.create("1000.00");
    const DATE = new Date("2026-01-01T00:00:00.000Z");
    const NOW = new Date("2026-01-02T00:00:00.000Z");

    const UPDATED = POSITION.setInitialBalance(INITIAL_BALANCE, DATE, NOW);

    expect(UPDATED.id).toBe(ID);
    expect(UPDATED.initialBalance?.value.toString()).toBe("1000");
    expect(UPDATED.initialBalanceDate).toBe(DATE);
    expect(UPDATED.version).toBe(1);
    expect(UPDATED.updatedAt).toBe(NOW);
    expect(UPDATED.equals(POSITION)).toBe(true);
  });

  it("does not mutate the original position", () => {
    const POSITION = Position.create(VALID_PROPS, ID);

    POSITION.setInitialBalance(
      PositiveMoney.create("1000.00"),
      new Date("2026-01-01T00:00:00.000Z"),
    );

    expect(POSITION.initialBalance).toBeNull();
    expect(POSITION.initialBalanceDate).toBeNull();
    expect(POSITION.version).toBe(0);
  });

  it("throws when the position has not been persisted", () => {
    const POSITION = Position.create(VALID_PROPS);

    expect(() =>
      POSITION.setInitialBalance(
        PositiveMoney.create("1000.00"),
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toThrow(
      "Cannot set an initial balance on a position that has not been persisted.",
    );
  });

  it("records a PositionInitialBalanceSet event on the returned instance", () => {
    const POSITION = Position.create(VALID_PROPS, ID);
    const NOW = new Date("2026-01-02T00:00:00.000Z");

    const UPDATED = POSITION.setInitialBalance(
      PositiveMoney.create("1000.00"),
      new Date("2026-01-01T00:00:00.000Z"),
      NOW,
    );

    const EVENTS = UPDATED.pullDomainEvents();

    expect(EVENTS).toHaveLength(1);
    expect(EVENTS[0]).toBeInstanceOf(PositionInitialBalanceSet);
    expect(EVENTS[0]).toMatchObject({
      positionId: ID,
      occurredAt: NOW,
    });
  });
});
