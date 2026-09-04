import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  OTHER_POSITION,
  POSITION,
} from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import {
  OTHER_WITHDRAWAL,
  WITHDRAWAL,
} from "@/__tests__/__helpers__/interfaces/_withdrawal.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { getWithdrawal } from "@/business/use-cases/withdrawal/get-withdrawal.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("getWithdrawal", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the withdrawal when the actor is the portfolio owner", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
      });

      const RESULT = await getWithdrawal(unitOfWork as never, {
        actorId: ACTOR_ID,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.WITHDRAWAL.DEFAULT));
      expect(RESULT.positionId).toBe(EntityId.create(ID.POSITION.DEFAULT));
      expect(RESULT.amount).toBe("500");
    });

    it("returns the withdrawal when the actor has EDITOR permission", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
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

      const RESULT = await getWithdrawal(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.WITHDRAWAL.DEFAULT));
    });

    it("returns the withdrawal when the actor has VIEWER permission", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
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

      const RESULT = await getWithdrawal(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.WITHDRAWAL.DEFAULT));
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
        getWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the position does not exist", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        withdrawals: [WITHDRAWAL],
      });

      await expect(
        getWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL],
      });

      await expect(
        getWithdrawal(unitOfWork as never, {
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
      });

      await expect(
        getWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.OTHER,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
