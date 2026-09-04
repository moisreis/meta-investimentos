import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK } from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { BANK_ACCOUNT } from "@/__tests__/__helpers__/interfaces/_bank-account.test.helper";
import {
  OTHER_PORTFOLIO,
  PORTFOLIO,
} from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { USER } from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { updateBankAccount } from "@/business/use-cases/bank/update-bank-account.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("updateBankAccount", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("updates the agency of a bank account", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        banks: [BANK],
        bankAccounts: [BANK_ACCOUNT],
      });

      const RESULT = await updateBankAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        bankAccountId: ID.BANK_ACCOUNT.DEFAULT,
        agency: "9999",
      });

      expect(RESULT.agency).toBe("9999");

      const saved = await unitOfWork.bankAccounts.findById(
        EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
      );
      expect(saved?.agency).toBe("9999");
    });

    it("updates the account number of a bank account", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        banks: [BANK],
        bankAccounts: [BANK_ACCOUNT],
      });

      const RESULT = await updateBankAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        bankAccountId: ID.BANK_ACCOUNT.DEFAULT,
        accountNumber: "99999-9",
      });

      expect(RESULT.accountNumber).toBe("99999-9");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        banks: [BANK],
        bankAccounts: [BANK_ACCOUNT],
      });

      await updateBankAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        bankAccountId: ID.BANK_ACCOUNT.DEFAULT,
        agency: "9999",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the bank account does not exist", async () => {
      unitOfWork.seed({ users: [USER], portfolios: [PORTFOLIO] });

      await expect(
        updateBankAccount(unitOfWork as never, {
          actorId: ACTOR_ID,
          bankAccountId: "00000000-0000-4000-8000-000000000000",
          agency: "9999",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor does not own the portfolio", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [OTHER_PORTFOLIO],
        banks: [BANK],
        bankAccounts: [BANK_ACCOUNT],
      });

      await expect(
        updateBankAccount(unitOfWork as never, {
          actorId: ACTOR_ID,
          bankAccountId: ID.BANK_ACCOUNT.DEFAULT,
          agency: "9999",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
