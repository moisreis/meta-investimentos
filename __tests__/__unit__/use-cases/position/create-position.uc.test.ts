import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { createPosition } from "@/business/use-cases/position/create-position.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("createPosition", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a position for the portfolio owner", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await createPosition(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        fundId: ID.FUND.DEFAULT,
      });

      expect(RESULT.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.fundId).toBe(ID.FUND.DEFAULT);
      expect(RESULT.initialBalance).toBeNull();
      expect(RESULT.initialBalanceDate).toBeNull();
      expect(RESULT.version).toBe(0);
    });

    it("creates a position for an editor", async () => {
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
        portfolioPermissions: [permission],
      });

      const RESULT = await createPosition(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        fundId: ID.FUND.DEFAULT,
      });

      expect(RESULT.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.fundId).toBe(ID.FUND.DEFAULT);
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await createPosition(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        fundId: ID.FUND.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("access denied", () => {
    it("throws NotFoundError for a viewer", async () => {
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
        portfolioPermissions: [permission],
      });

      await expect(
        createPosition(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          fundId: ID.FUND.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the user has no access", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        createPosition(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          fundId: ID.FUND.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        createPosition(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          fundId: ID.FUND.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when a position for the fund already exists", async () => {
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

      await expect(
        createPosition(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          fundId: ID.FUND.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
