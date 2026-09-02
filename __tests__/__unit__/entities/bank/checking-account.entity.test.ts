import { describe, expect, it } from "vitest";

import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

describe("CheckingAccount.create", () => {
  const VALID_PROPS = {
    bankAccountId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    value: SignedMoney.create("-123.45"),
  };

  it("creates a valid checking account with the provided values", () => {
    const CHECKING_ACCOUNT = CheckingAccount.create(VALID_PROPS);

    expect(CHECKING_ACCOUNT.id).toBeUndefined();
    expect(CHECKING_ACCOUNT.bankAccountId).toBe(
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );
    expect(CHECKING_ACCOUNT.date).toBe(VALID_PROPS.date);
    expect(CHECKING_ACCOUNT.value.value.toString()).toBe("-123.45");
  });

  it("creates a checking account with the provided id", () => {
    const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

    const CHECKING_ACCOUNT = CheckingAccount.create(VALID_PROPS, ID);

    expect(CHECKING_ACCOUNT.id).toBe(ID);
  });

  it("throws when the bank account id is blank", () => {
    expect(() =>
      CheckingAccount.create({
        ...VALID_PROPS,
        bankAccountId: " " as unknown as EntityId,
      }),
    ).toThrow("CheckingAccount must have a bank account id.");
  });

  it("throws when the date is missing", () => {
    const { date: _, ...REST } = VALID_PROPS;

    expect(() =>
      CheckingAccount.create(
        REST as Parameters<typeof CheckingAccount.create>[0],
      ),
    ).toThrow("CheckingAccount must have a date.");
  });

  it("throws when the value is missing", () => {
    expect(() =>
      CheckingAccount.create({ ...VALID_PROPS, value: undefined as never }),
    ).toThrow("CheckingAccount must have a value.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    CheckingAccount.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("CheckingAccount.equals", () => {
  const VALID_PROPS = {
    bankAccountId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
    date: new Date("2026-01-01T00:00:00.000Z"),
    value: SignedMoney.create("-123.45"),
  };
  const ID = "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d";

  it("returns true for the same instance", () => {
    const CHECKING_ACCOUNT = CheckingAccount.create(VALID_PROPS, ID);

    expect(CHECKING_ACCOUNT.equals(CHECKING_ACCOUNT)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = CheckingAccount.create(VALID_PROPS, ID);
    const B = CheckingAccount.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = CheckingAccount.create(VALID_PROPS, ID);
    const B = CheckingAccount.create(
      VALID_PROPS,
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = CheckingAccount.create(VALID_PROPS, ID);
    const B = CheckingAccount.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const CHECKING_ACCOUNT = CheckingAccount.create(VALID_PROPS, ID);

    expect(CHECKING_ACCOUNT.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const CHECKING_ACCOUNT = CheckingAccount.create(VALID_PROPS, ID);

    expect(CHECKING_ACCOUNT.equals(undefined)).toBe(false);
  });
});
