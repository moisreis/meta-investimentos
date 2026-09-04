import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK } from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { BANK_ACCOUNT } from "@/__tests__/__helpers__/interfaces/_bank-account.test.helper";
import { CHECKING_ACCOUNT } from "@/__tests__/__helpers__/interfaces/_checking-account.test.helper";
import {
  OTHER_PORTFOLIO,
  PORTFOLIO,
} from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { USER } from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { deleteCheckingAccount } from "@/business/use-cases/bank/delete-checking-account.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("deleteCheckingAccount", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("deletes a checking account", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        banks: [BANK],
        bankAccounts: [BANK_ACCOUNT],
        checkingAccounts: [CHECKING_ACCOUNT],
      });

      await deleteCheckingAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        checkingAccountId: ID.CHECKING_ACCOUNT.DEFAULT,
      });

      const deleted = await unitOfWork.checkingAccounts.findById(
        EntityId.create(ID.CHECKING_ACCOUNT.DEFAULT),
      );
      expect(deleted).toBeNull();
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        banks: [BANK],
        bankAccounts: [BANK_ACCOUNT],
        checkingAccounts: [CHECKING_ACCOUNT],
      });

      await deleteCheckingAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        checkingAccountId: ID.CHECKING_ACCOUNT.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the checking account does not exist", async () => {
      unitOfWork.seed({ users: [USER], portfolios: [PORTFOLIO] });

      await expect(
        deleteCheckingAccount(unitOfWork as never, {
          actorId: ACTOR_ID,
          checkingAccountId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor does not own the portfolio", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [OTHER_PORTFOLIO],
        banks: [BANK],
        bankAccounts: [BANK_ACCOUNT],
        checkingAccounts: [CHECKING_ACCOUNT],
      });

      await expect(
        deleteCheckingAccount(unitOfWork as never, {
          actorId: ACTOR_ID,
          checkingAccountId: ID.CHECKING_ACCOUNT.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
