import { describe, expect, it } from "vitest";

import { WithdrawalReversed } from "@/business/domain-events/events/withdrawal-reversed.event";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

describe("Withdrawal.create", () => {
  const DATE = new Date("2026-01-01T00:00:00.000Z");
  const VALID_PROPS = {
    positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: DATE,
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("12.345"),
  };

  it("creates a valid withdrawal with default values", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS);

    expect(WITHDRAWAL.id).toBeUndefined();
    expect(WITHDRAWAL.positionId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(WITHDRAWAL.date).toBe(DATE);
    expect(WITHDRAWAL.amount.value.toString()).toBe("100");
    expect(WITHDRAWAL.quotas.value.toString()).toBe("12.345");
    expect(WITHDRAWAL.reversedAt).toBeNull();
    expect(WITHDRAWAL.reversedByUserId).toBeNull();
    expect(WITHDRAWAL.createdAt).toBeInstanceOf(Date);
    expect(WITHDRAWAL.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a withdrawal with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const WITHDRAWAL = Withdrawal.create(VALID_PROPS, ID);

    expect(WITHDRAWAL.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");
    const REVERSED_AT = new Date("2026-02-01T00:00:00.000Z");

    const WITHDRAWAL = Withdrawal.create({
      ...VALID_PROPS,
      reversedAt: REVERSED_AT,
      reversedByUserId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(WITHDRAWAL.reversedAt).toBe(REVERSED_AT);
    expect(WITHDRAWAL.reversedByUserId).toBe(
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );
    expect(WITHDRAWAL.createdAt).toBe(CREATED_AT);
    expect(WITHDRAWAL.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the position id is blank", () => {
    expect(() =>
      Withdrawal.create({
        ...VALID_PROPS,
        positionId: " " as unknown as EntityId,
      }),
    ).toThrow("Withdrawal must have a position id.");
  });

  it("throws when the date is missing", () => {
    const { date: _, ...REST } = VALID_PROPS;

    expect(() =>
      Withdrawal.create(REST as Parameters<typeof Withdrawal.create>[0]),
    ).toThrow("Withdrawal must have a date.");
  });

  it("throws when the amount is missing", () => {
    const { amount: _, ...REST } = VALID_PROPS;

    expect(() =>
      Withdrawal.create(REST as Parameters<typeof Withdrawal.create>[0]),
    ).toThrow("Withdrawal must have an amount.");
  });

  it("throws when the quotas are missing", () => {
    const { quotas: _, ...REST } = VALID_PROPS;

    expect(() =>
      Withdrawal.create(REST as Parameters<typeof Withdrawal.create>[0]),
    ).toThrow("Withdrawal must have quotas.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Withdrawal.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Withdrawal.equals", () => {
  const VALID_PROPS = {
    positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("12.345"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS, ID);

    expect(WITHDRAWAL.equals(WITHDRAWAL)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Withdrawal.create(VALID_PROPS, ID);
    const B = Withdrawal.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Withdrawal.create(VALID_PROPS, ID);
    const B = Withdrawal.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Withdrawal.create(VALID_PROPS, ID);
    const B = Withdrawal.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS, ID);

    expect(WITHDRAWAL.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS, ID);

    expect(WITHDRAWAL.equals(undefined)).toBe(false);
  });
});

describe("Withdrawal.reverse", () => {
  const VALID_PROPS = {
    positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("12.345"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
  const USER_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("reverses a persisted withdrawal and records the actor and time", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS, ID);
    const NOW = new Date("2026-02-01T00:00:00.000Z");

    const REVERSED = WITHDRAWAL.reverse(EntityId.create(USER_ID), NOW);

    expect(REVERSED.id).toBe(ID);
    expect(REVERSED.reversedAt).toBe(NOW);
    expect(REVERSED.reversedByUserId).toBe(USER_ID);
    expect(REVERSED.updatedAt).toBe(NOW);
    expect(REVERSED.amount.value.toString()).toBe("100");
    expect(REVERSED.equals(WITHDRAWAL)).toBe(true);
  });

  it("does not mutate the original withdrawal", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS, ID);

    WITHDRAWAL.reverse(EntityId.create(USER_ID));

    expect(WITHDRAWAL.reversedAt).toBeNull();
    expect(WITHDRAWAL.reversedByUserId).toBeNull();
  });

  it("throws when the withdrawal has not been persisted", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS);

    expect(() => WITHDRAWAL.reverse(EntityId.create(USER_ID))).toThrow(
      "Cannot reverse a withdrawal that has not been persisted.",
    );
  });

  it("throws when the withdrawal is already reversed", () => {
    const REVERSED_AT = new Date("2026-02-01T00:00:00.000Z");
    const WITHDRAWAL = Withdrawal.create(
      {
        ...VALID_PROPS,
        reversedAt: REVERSED_AT,
        reversedByUserId: EntityId.create(USER_ID),
      },
      ID,
    );

    expect(() =>
      WITHDRAWAL.reverse(EntityId.create(USER_ID), REVERSED_AT),
    ).toThrow("Cannot reverse a withdrawal that is already reversed.");
  });

  it("records a WithdrawalReversed event on the returned instance", () => {
    const WITHDRAWAL = Withdrawal.create(VALID_PROPS, ID);
    const NOW = new Date("2026-02-01T00:00:00.000Z");

    const REVERSED = WITHDRAWAL.reverse(EntityId.create(USER_ID), NOW);

    const EVENTS = REVERSED.pullDomainEvents();

    expect(EVENTS).toHaveLength(1);
    expect(EVENTS[0]).toBeInstanceOf(WithdrawalReversed);
    expect(EVENTS[0]).toMatchObject({
      withdrawalId: ID,
      reversedByUserId: USER_ID,
      occurredAt: NOW,
    });
  });
});
