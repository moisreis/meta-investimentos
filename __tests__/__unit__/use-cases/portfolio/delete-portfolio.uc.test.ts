import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { deletePortfolio } from "@/business/use-cases/portfolio/delete-portfolio.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("deletePortfolio", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("deletes the portfolio owned by the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await deletePortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      const found = await unitOfWork.portfolios.findById(
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );
      expect(found).toBeNull();
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await deletePortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("errors", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        deletePortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not the owner", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        deletePortfolio(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is only an editor", async () => {
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

      await expect(
        deletePortfolio(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is only a viewer", async () => {
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
        deletePortfolio(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
