import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK_ACCOUNT } from "@/__tests__/__helpers__/interfaces/_bank-account.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getBankAccount } from "@/business/use-cases/bank/get-bank-account.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getBankAccount", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the bank account when it exists", async () => {
      unitOfWork.seed({ bankAccounts: [BANK_ACCOUNT] });

      const RESULT = await getBankAccount(unitOfWork as never, {
        bankAccountId: ID.BANK_ACCOUNT.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.BANK_ACCOUNT.DEFAULT));
      expect(RESULT.portfolioId).toBe(EntityId.create(ID.PORTFOLIO.DEFAULT));
      expect(RESULT.bankId).toBe(EntityId.create(ID.BANK.DEFAULT));
      expect(RESULT.agency).toBe("0001");
      expect(RESULT.accountNumber).toBe("12345-6");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the bank account does not exist", async () => {
      await expect(
        getBankAccount(unitOfWork as never, {
          bankAccountId: ID.BANK_ACCOUNT.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
