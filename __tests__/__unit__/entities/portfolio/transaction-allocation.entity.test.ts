import { describe, expect, it } from "vitest";

import { TransactionAllocation } from "@/business/entities/portfolio/transaction-allocation.entity";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";

describe("TransactionAllocation.create", () => {
  const VALID_PROPS = {
    applicationId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    withdrawId: "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    quotasConsumed: QuotaQuantity.create("12.345"),
  };

  it("creates a valid transaction allocation with default values", () => {
    const ALLOCATION = TransactionAllocation.create(VALID_PROPS);

    expect(ALLOCATION.id).toBeUndefined();
    expect(ALLOCATION.applicationId).toBe(
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );
    expect(ALLOCATION.withdrawId).toBe("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");
    expect(ALLOCATION.quotasConsumed.value.toString()).toBe("12.345");
    expect(ALLOCATION.createdAt).toBeInstanceOf(Date);
  });

  it("creates a transaction allocation with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const ALLOCATION = TransactionAllocation.create(VALID_PROPS, ID);

    expect(ALLOCATION.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");

    const ALLOCATION = TransactionAllocation.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
    });

    expect(ALLOCATION.createdAt).toBe(CREATED_AT);
  });

  it("throws when the application id is blank", () => {
    expect(() =>
      TransactionAllocation.create({ ...VALID_PROPS, applicationId: " " }),
    ).toThrow("TransactionAllocation must have an application id.");
  });

  it("throws when the withdraw id is blank", () => {
    expect(() =>
      TransactionAllocation.create({ ...VALID_PROPS, withdrawId: " " }),
    ).toThrow("TransactionAllocation must have a withdrawal id.");
  });

  it("throws when the quotas consumed are missing", () => {
    const { quotasConsumed: _, ...REST } = VALID_PROPS;

    expect(() =>
      TransactionAllocation.create(
        REST as Parameters<typeof TransactionAllocation.create>[0],
      ),
    ).toThrow("TransactionAllocation must have consumed quotas.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    TransactionAllocation.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("TransactionAllocation.equals", () => {
  const VALID_PROPS = {
    applicationId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    withdrawId: "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    quotasConsumed: QuotaQuantity.create("12.345"),
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const ALLOCATION = TransactionAllocation.create(VALID_PROPS, ID);

    expect(ALLOCATION.equals(ALLOCATION)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = TransactionAllocation.create(VALID_PROPS, ID);
    const B = TransactionAllocation.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = TransactionAllocation.create(VALID_PROPS, ID);
    const B = TransactionAllocation.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = TransactionAllocation.create(VALID_PROPS, ID);
    const B = TransactionAllocation.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const ALLOCATION = TransactionAllocation.create(VALID_PROPS, ID);

    expect(ALLOCATION.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const ALLOCATION = TransactionAllocation.create(VALID_PROPS, ID);

    expect(ALLOCATION.equals(undefined)).toBe(false);
  });
});
