import { describe, expect, it } from "vitest";

import { ApplicationReversed } from "@/business/domain-events/events/application-reversed.event";
import { Application } from "@/business/entities/portfolio/application.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";

describe("Application.create", () => {
  const DATE = new Date("2026-01-01T00:00:00.000Z");
  const VALID_PROPS = {
    positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: DATE,
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("12.345"),
  };

  it("creates a valid application with default values", () => {
    const APPLICATION = Application.create(VALID_PROPS);

    expect(APPLICATION.id).toBeUndefined();
    expect(APPLICATION.positionId).toBe("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2");
    expect(APPLICATION.date).toBe(DATE);
    expect(APPLICATION.amount.value.toString()).toBe("100");
    expect(APPLICATION.quotas.value.toString()).toBe("12.345");
    expect(APPLICATION.reversedAt).toBeNull();
    expect(APPLICATION.reversedByUserId).toBeNull();
    expect(APPLICATION.createdAt).toBeInstanceOf(Date);
    expect(APPLICATION.updatedAt).toBeInstanceOf(Date);
  });

  it("creates an application with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const APPLICATION = Application.create(VALID_PROPS, ID);

    expect(APPLICATION.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");
    const REVERSED_AT = new Date("2026-02-01T00:00:00.000Z");

    const APPLICATION = Application.create({
      ...VALID_PROPS,
      reversedAt: REVERSED_AT,
      reversedByUserId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(APPLICATION.reversedAt).toBe(REVERSED_AT);
    expect(APPLICATION.reversedByUserId).toBe(
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );
    expect(APPLICATION.createdAt).toBe(CREATED_AT);
    expect(APPLICATION.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the position id is blank", () => {
    expect(() =>
      Application.create({
        ...VALID_PROPS,
        positionId: " " as unknown as EntityId,
      }),
    ).toThrow("Application must have a position id.");
  });

  it("throws when the date is missing", () => {
    const { date: _, ...REST } = VALID_PROPS;

    expect(() =>
      Application.create(REST as Parameters<typeof Application.create>[0]),
    ).toThrow("Application must have a date.");
  });

  it("throws when the amount is missing", () => {
    const { amount: _, ...REST } = VALID_PROPS;

    expect(() =>
      Application.create(REST as Parameters<typeof Application.create>[0]),
    ).toThrow("Application must have an amount.");
  });

  it("throws when the quotas are missing", () => {
    const { quotas: _, ...REST } = VALID_PROPS;

    expect(() =>
      Application.create(REST as Parameters<typeof Application.create>[0]),
    ).toThrow("Application must have quotas.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    Application.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("Application.equals", () => {
  const VALID_PROPS = {
    positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("12.345"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const APPLICATION = Application.create(VALID_PROPS, ID);

    expect(APPLICATION.equals(APPLICATION)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = Application.create(VALID_PROPS, ID);
    const B = Application.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = Application.create(VALID_PROPS, ID);
    const B = Application.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = Application.create(VALID_PROPS, ID);
    const B = Application.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const APPLICATION = Application.create(VALID_PROPS, ID);

    expect(APPLICATION.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const APPLICATION = Application.create(VALID_PROPS, ID);

    expect(APPLICATION.equals(undefined)).toBe(false);
  });
});

describe("Application.reverse", () => {
  const VALID_PROPS = {
    positionId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    amount: PositiveMoney.create("100.00"),
    quotas: QuotaQuantity.create("12.345"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";
  const USER_ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("reverses a persisted application and records the actor and time", () => {
    const APPLICATION = Application.create(VALID_PROPS, ID);
    const NOW = new Date("2026-02-01T00:00:00.000Z");

    const REVERSED = APPLICATION.reverse(EntityId.create(USER_ID), NOW);

    expect(REVERSED.id).toBe(ID);
    expect(REVERSED.reversedAt).toBe(NOW);
    expect(REVERSED.reversedByUserId).toBe(USER_ID);
    expect(REVERSED.updatedAt).toBe(NOW);
    expect(REVERSED.amount.value.toString()).toBe("100");
    expect(REVERSED.equals(APPLICATION)).toBe(true);
  });

  it("does not mutate the original application", () => {
    const APPLICATION = Application.create(VALID_PROPS, ID);

    APPLICATION.reverse(EntityId.create(USER_ID));

    expect(APPLICATION.reversedAt).toBeNull();
    expect(APPLICATION.reversedByUserId).toBeNull();
  });

  it("throws when the application has not been persisted", () => {
    const APPLICATION = Application.create(VALID_PROPS);

    expect(() => APPLICATION.reverse(EntityId.create(USER_ID))).toThrow(
      "Cannot reverse an application that has not been persisted.",
    );
  });

  it("throws when the application is already reversed", () => {
    const REVERSED_AT = new Date("2026-02-01T00:00:00.000Z");
    const APPLICATION = Application.create(
      {
        ...VALID_PROPS,
        reversedAt: REVERSED_AT,
        reversedByUserId: EntityId.create(USER_ID),
      },
      ID,
    );

    expect(() =>
      APPLICATION.reverse(EntityId.create(USER_ID), REVERSED_AT),
    ).toThrow("Cannot reverse an application that is already reversed.");
  });

  it("records an ApplicationReversed event on the returned instance", () => {
    const APPLICATION = Application.create(VALID_PROPS, ID);
    const NOW = new Date("2026-02-01T00:00:00.000Z");

    const REVERSED = APPLICATION.reverse(EntityId.create(USER_ID), NOW);

    const EVENTS = REVERSED.pullDomainEvents();

    expect(EVENTS).toHaveLength(1);
    expect(EVENTS[0]).toBeInstanceOf(ApplicationReversed);
    expect(EVENTS[0]).toMatchObject({
      applicationId: ID,
      reversedByUserId: USER_ID,
      occurredAt: NOW,
    });
  });

  it("does not record an event when the reversal fails", () => {
    const APPLICATION = Application.create(VALID_PROPS);

    expect(() => APPLICATION.reverse(EntityId.create(USER_ID))).toThrow();

    expect(APPLICATION.pullDomainEvents()).toEqual([]);
  });
});
