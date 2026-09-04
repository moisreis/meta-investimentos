import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  OTHER_POSITION,
  POSITION,
} from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import {
  OTHER_TRANSACTION_ALLOCATION,
  TRANSACTION_ALLOCATION,
} from "@/__tests__/__helpers__/interfaces/_transaction-allocation.test.helper";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import {
  OTHER_WITHDRAWAL,
  UPDATED_WITHDRAWAL,
  WITHDRAWAL,
} from "@/__tests__/__helpers__/interfaces/_withdrawal.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { undoWithdrawalAllocations } from "@/business/use-cases/withdrawal/undo-withdrawal-allocations.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("undoWithdrawalAllocations", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("removes all allocations for the withdrawal", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
      });

      await undoWithdrawalAllocations(unitOfWork as never, {
        actorId: ACTOR_ID,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      const REMAINING =
        await unitOfWork.transactionAllocations.findAllByWithdrawalId(
          EntityId.create(ID.WITHDRAWAL.DEFAULT),
        );
      expect(REMAINING).toHaveLength(0);
    });

    it("does not affect allocations for other withdrawals", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL, OTHER_WITHDRAWAL],
        transactionAllocations: [
          TRANSACTION_ALLOCATION,
          OTHER_TRANSACTION_ALLOCATION,
        ],
      });

      await undoWithdrawalAllocations(unitOfWork as never, {
        actorId: ACTOR_ID,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      const OTHER_REMAINING =
        await unitOfWork.transactionAllocations.findAllByWithdrawalId(
          EntityId.create(ID.WITHDRAWAL.OTHER),
        );
      expect(OTHER_REMAINING).toHaveLength(1);
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
      });

      await undoWithdrawalAllocations(unitOfWork as never, {
        actorId: ACTOR_ID,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("succeeds when the actor has EDITOR permission", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(ID.USER.OTHER),
              portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
              role: "EDITOR",
              grantedByUserId: EntityId.create(ID.USER.DEFAULT),
            },
            "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
          ),
        ],
      });

      await undoWithdrawalAllocations(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      const REMAINING =
        await unitOfWork.transactionAllocations.findAllByWithdrawalId(
          EntityId.create(ID.WITHDRAWAL.DEFAULT),
        );
      expect(REMAINING).toHaveLength(0);
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the withdrawal does not exist", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      await expect(
        undoWithdrawalAllocations(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when the withdrawal is reversed", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [UPDATED_WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
      });

      await expect(
        undoWithdrawalAllocations(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws NotFoundError when the position does not exist", async () => {
      const W = WITHDRAWAL;
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        withdrawals: [W],
        transactionAllocations: [TRANSACTION_ALLOCATION],
      });

      await expect(
        undoWithdrawalAllocations(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no mutate access", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(ID.USER.OTHER),
              portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
              role: "VIEWER",
              grantedByUserId: EntityId.create(ID.USER.DEFAULT),
            },
            "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
          ),
        ],
      });

      await expect(
        undoWithdrawalAllocations(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access at all", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
      });

      await expect(
        undoWithdrawalAllocations(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      unitOfWork.seed({
        users: [USER],
        positions: [OTHER_POSITION],
        withdrawals: [OTHER_WITHDRAWAL],
        transactionAllocations: [OTHER_TRANSACTION_ALLOCATION],
      });

      await expect(
        undoWithdrawalAllocations(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.OTHER,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
