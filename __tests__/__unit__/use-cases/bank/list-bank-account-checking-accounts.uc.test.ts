import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  CHECKING_ACCOUNT,
  OTHER_CHECKING_ACCOUNT,
} from "@/__tests__/__helpers__/interfaces/_checking-account.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listBankAccountCheckingAccounts } from "@/business/use-cases/bank/list-bank-account-checking-accounts.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";

const BANK_ACCOUNT_ID = ID.BANK_ACCOUNT.DEFAULT;

describe("listBankAccountCheckingAccounts", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the checking accounts of the bank account", async () => {
      unitOfWork.seed({
        checkingAccounts: [CHECKING_ACCOUNT, OTHER_CHECKING_ACCOUNT],
      });

      const RESULT = await listBankAccountCheckingAccounts(
        unitOfWork as never,
        {
          bankAccountId: BANK_ACCOUNT_ID,
        },
      );

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].id).toBe(EntityId.create(ID.CHECKING_ACCOUNT.DEFAULT));
      expect(RESULT[0].value).toBe("1234.56");
    });

    it("returns an empty list when the bank account has no transactions", async () => {
      const RESULT = await listBankAccountCheckingAccounts(
        unitOfWork as never,
        {
          bankAccountId: BANK_ACCOUNT_ID,
        },
      );

      expect(RESULT).toEqual([]);
    });
  });
});
