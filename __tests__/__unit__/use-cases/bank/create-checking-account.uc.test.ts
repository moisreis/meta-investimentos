import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK_ACCOUNT } from "@/__tests__/__helpers__/interfaces/_bank-account.test.helper";
import { JANUARY_DATE } from "@/__tests__/__helpers__/interfaces/_checking-account.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createCheckingAccount } from "@/business/use-cases/bank/create-checking-account.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const BANK_ACCOUNT_ID = ID.BANK_ACCOUNT.DEFAULT;

describe("createCheckingAccount", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a checking account transaction", async () => {
      unitOfWork.seed({ bankAccounts: [BANK_ACCOUNT] });

      const RESULT = await createCheckingAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        bankAccountId: BANK_ACCOUNT_ID,
        date: JANUARY_DATE,
        value: "1234.56",
      });

      expect(RESULT.bankAccountId).toBe(EntityId.create(BANK_ACCOUNT_ID));
      expect(RESULT.date).toEqual(JANUARY_DATE);
      expect(RESULT.value).toBe("1234.56");

      const saved = await unitOfWork.checkingAccounts.findById(
        EntityId.create(RESULT.id),
      );
      expect(saved).not.toBeNull();
      expect(saved?.value.value.toString()).toBe("1234.56");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ bankAccounts: [BANK_ACCOUNT] });

      await createCheckingAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        bankAccountId: BANK_ACCOUNT_ID,
        date: JANUARY_DATE,
        value: "1234.56",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("validation", () => {
    it("throws NotFoundError when the bank account does not exist", async () => {
      await expect(
        createCheckingAccount(unitOfWork as never, {
          actorId: ACTOR_ID,
          bankAccountId: BANK_ACCOUNT_ID,
          date: JANUARY_DATE,
          value: "1234.56",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
