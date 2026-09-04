import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { updatePortfolio } from "@/business/use-cases/portfolio/update-portfolio.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("updatePortfolio", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("renames a portfolio owned by the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await updatePortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        name: "Novo Nome",
      });

      expect(RESULT.id).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.name).toBe("Novo Nome");
    });

    it("keeps the existing name when none is provided", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await updatePortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT.name).toBe(PORTFOLIO.name);
    });

    it("persists the updated portfolio and attributes the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await updatePortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        name: "Renomeado",
      });

      const saved = await unitOfWork.portfolios.findById(
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );
      expect(saved?.name).toBe("Renomeado");
      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("errors", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        updatePortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          name: "Novo Nome",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not the owner", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        updatePortfolio(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          name: "Novo Nome",
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
        updatePortfolio(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          name: "Novo Nome",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
