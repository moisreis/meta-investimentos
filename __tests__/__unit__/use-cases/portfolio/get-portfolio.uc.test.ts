import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { getPortfolio } from "@/business/use-cases/portfolio/get-portfolio.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("getPortfolio", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the portfolio for the owner", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await getPortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT.id).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.acronym).toBe("FIA");
      expect(RESULT.accessRole).toBe("OWNER");
    });

    it("returns the portfolio for an editor", async () => {
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

      const RESULT = await getPortfolio(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT.id).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.accessRole).toBe("EDITOR");
    });

    it("returns the portfolio for a viewer", async () => {
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

      const RESULT = await getPortfolio(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT.id).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.accessRole).toBe("VIEWER");
    });
  });

  describe("errors", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        getPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        getPortfolio(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
