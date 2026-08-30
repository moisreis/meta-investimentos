import { describe, expect, it } from "vitest";

import { BankAccount } from "@/business/entities/bank/bank-account.entity";

describe("BankAccount.create", () => {
  const VALID_PROPS = {
    portfolioId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    bankId: "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    agency: "1234",
    accountNumber: "56789-0",
  };

  it("creates a valid bank account with default values", () => {
    const BANK_ACCOUNT = BankAccount.create(VALID_PROPS);

    expect(BANK_ACCOUNT.id).toBeUndefined();
    expect(BANK_ACCOUNT.portfolioId).toBe(
      "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    );
    expect(BANK_ACCOUNT.bankId).toBe("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d");
    expect(BANK_ACCOUNT.agency).toBe("1234");
    expect(BANK_ACCOUNT.accountNumber).toBe("56789-0");
    expect(BANK_ACCOUNT.createdAt).toBeInstanceOf(Date);
    expect(BANK_ACCOUNT.updatedAt).toBeInstanceOf(Date);
  });

  it("creates a bank account with the provided id", () => {
    const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

    const BANK_ACCOUNT = BankAccount.create(VALID_PROPS, ID);

    expect(BANK_ACCOUNT.id).toBe(ID);
  });

  it("preserves the provided optional values", () => {
    const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
    const UPDATED_AT = new Date("2026-01-02T00:00:00.000Z");

    const BANK_ACCOUNT = BankAccount.create({
      ...VALID_PROPS,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(BANK_ACCOUNT.createdAt).toBe(CREATED_AT);
    expect(BANK_ACCOUNT.updatedAt).toBe(UPDATED_AT);
  });

  it("throws when the portfolio id is blank", () => {
    expect(() =>
      BankAccount.create({ ...VALID_PROPS, portfolioId: " " }),
    ).toThrow("BankAccount must have a portfolio id.");
  });

  it("throws when the bank id is blank", () => {
    expect(() => BankAccount.create({ ...VALID_PROPS, bankId: "" })).toThrow(
      "BankAccount must have a bank id.",
    );
  });

  it("throws when the agency is blank", () => {
    expect(() => BankAccount.create({ ...VALID_PROPS, agency: "  " })).toThrow(
      "BankAccount must have an agency.",
    );
  });

  it("throws when the account number is blank", () => {
    expect(() =>
      BankAccount.create({ ...VALID_PROPS, accountNumber: " " }),
    ).toThrow("BankAccount must have an account number.");
  });

  it("does not mutate its inputs", () => {
    const PROPS = { ...VALID_PROPS };

    BankAccount.create(PROPS);

    expect(PROPS).toEqual(VALID_PROPS);
  });
});

describe("BankAccount.equals", () => {
  const VALID_PROPS = {
    portfolioId: "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2",
    bankId: "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    agency: "1234",
    accountNumber: "56789-0",
  };
  const ID = "ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2";

  it("returns true for the same instance", () => {
    const BANK_ACCOUNT = BankAccount.create(VALID_PROPS, ID);

    expect(BANK_ACCOUNT.equals(BANK_ACCOUNT)).toBe(true);
  });

  it("returns true for distinct instances with the same id", () => {
    const A = BankAccount.create(VALID_PROPS, ID);
    const B = BankAccount.create(VALID_PROPS, ID);

    expect(A.equals(B)).toBe(true);
  });

  it("returns false for instances with different ids", () => {
    const A = BankAccount.create(VALID_PROPS, ID);
    const B = BankAccount.create(
      VALID_PROPS,
      "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
    );

    expect(A.equals(B)).toBe(false);
  });

  it("returns false when either instance lacks an id", () => {
    const A = BankAccount.create(VALID_PROPS, ID);
    const B = BankAccount.create(VALID_PROPS);

    expect(A.equals(B)).toBe(false);
  });

  it("returns false for null", () => {
    const BANK_ACCOUNT = BankAccount.create(VALID_PROPS, ID);

    expect(BANK_ACCOUNT.equals(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    const BANK_ACCOUNT = BankAccount.create(VALID_PROPS, ID);

    expect(BANK_ACCOUNT.equals(undefined)).toBe(false);
  });
});
