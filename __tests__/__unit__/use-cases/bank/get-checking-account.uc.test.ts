import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { CHECKING_ACCOUNT } from "@/__tests__/__helpers__/interfaces/_checking-account.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getCheckingAccount } from "@/business/use-cases/bank/get-checking-account.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getCheckingAccount", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the checking account when it exists", async () => {
      unitOfWork.seed({ checkingAccounts: [CHECKING_ACCOUNT] });

      const RESULT = await getCheckingAccount(unitOfWork as never, {
        checkingAccountId: ID.CHECKING_ACCOUNT.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.CHECKING_ACCOUNT.DEFAULT));
      expect(RESULT.bankAccountId).toBe(
        EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
      );
      expect(RESULT.value).toBe("1234.56");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the checking account does not exist", async () => {
      await expect(
        getCheckingAccount(unitOfWork as never, {
          checkingAccountId: ID.CHECKING_ACCOUNT.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
