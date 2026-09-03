import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import { TRANSACTION_ALLOCATION } from "@/__tests__/__helpers__/interfaces/_transaction-allocation.test.helper";
import {
  UPDATED_WITHDRAWAL,
  WITHDRAWAL,
} from "@/__tests__/__helpers__/interfaces/_withdrawal.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { reverseWithdrawal } from "@/business/use-cases/withdrawal/reverse-withdrawal.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("reverseWithdrawal", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("reverses a withdrawal and removes its allocations", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
      });

      const RESULT = await reverseWithdrawal(unitOfWork as never, {
        actorId: ACTOR_ID,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      expect(RESULT.id).toBe(ID.WITHDRAWAL.DEFAULT);
      expect(RESULT.amount).toBe("500");
      expect(RESULT.reversedAt).not.toBeNull();
      expect(RESULT.reversedByUserId).toBe(EntityId.create(ACTOR_ID));

      const allocations =
        await unitOfWork.transactionAllocations.findAllByWithdrawalId(
          EntityId.create(ID.WITHDRAWAL.DEFAULT),
        );
      expect(allocations).toHaveLength(0);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
      });

      await expect(
        reverseWithdrawal(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("rejects a viewer role when mutating", async () => {
      const VIEWER = {
        id: EntityId.create("7a7b7c7d-7e7f-4a8b-9c0d-1e2f3a4b5c6d"),
        userId: EntityId.create(ID.USER.OTHER),
        portfolioId: PORTFOLIO.id as EntityId,
        role: "VIEWER" as const,
        grantedByUserId: PORTFOLIO.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
        portfolioPermissions: [VIEWER as never],
      });

      await expect(
        reverseWithdrawal(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the withdrawal does not exist", async () => {
      await expect(
        reverseWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the withdrawal is already reversed", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [UPDATED_WITHDRAWAL],
      });

      await expect(
        reverseWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
