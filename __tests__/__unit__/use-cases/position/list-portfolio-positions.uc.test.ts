import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { listPortfolioPositions } from "@/business/use-cases/position/list-portfolio-positions.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("listPortfolioPositions", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns positions for the portfolio owner", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
      });

      const RESULT = await listPortfolioPositions(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].id).toBe(ID.POSITION.DEFAULT);
    });

    it("returns positions for an editor", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(OTHER_ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          role: "EDITOR",
          grantedByUserId: EntityId.create(ACTOR_ID),
        },
        ID.PORTFOLIO.OTHER,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        portfolioPermissions: [permission],
      });

      const RESULT = await listPortfolioPositions(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(1);
    });

    it("returns positions for a viewer", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(OTHER_ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          role: "VIEWER",
          grantedByUserId: EntityId.create(ACTOR_ID),
        },
        ID.PORTFOLIO.OTHER,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        portfolioPermissions: [permission],
      });

      const RESULT = await listPortfolioPositions(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(1);
    });

    it("returns an empty array when the portfolio has no positions", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await listPortfolioPositions(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(0);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        listPortfolioPositions(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("access denied", () => {
    it("throws NotFoundError when the user has no access", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        listPortfolioPositions(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
