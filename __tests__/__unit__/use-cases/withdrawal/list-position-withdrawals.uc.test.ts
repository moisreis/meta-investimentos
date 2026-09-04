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
  EXTERNAL_WITHDRAWAL,
  OTHER_WITHDRAWAL,
  WITHDRAWAL,
} from "@/__tests__/__helpers__/interfaces/_withdrawal.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { listPositionWithdrawals } from "@/business/use-cases/withdrawal/list-position-withdrawals.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("listPositionWithdrawals", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all withdrawals for the position", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        withdrawals: [WITHDRAWAL, OTHER_WITHDRAWAL, EXTERNAL_WITHDRAWAL],
      });

      const RESULT = await listPositionWithdrawals(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
      });

      expect(RESULT).toHaveLength(3);
    });

    it("returns an empty list when no withdrawals exist", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      const RESULT = await listPositionWithdrawals(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
      });

      expect(RESULT).toEqual([]);
    });

    it("returns withdrawals when the actor has EDITOR permission", async () => {
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

      const RESULT = await listPositionWithdrawals(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        positionId: ID.POSITION.DEFAULT,
      });

      expect(RESULT).toHaveLength(1);
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the position does not exist", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
      });

      await expect(
        listPositionWithdrawals(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: "00000000-0000-4000-8000-000000000000",
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
        listPositionWithdrawals(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          positionId: ID.POSITION.DEFAULT,
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
        listPositionWithdrawals(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.OTHER,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
