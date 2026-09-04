import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import { removeNormFromPortfolio } from "@/business/use-cases/norm/remove-norm-from-portfolio.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

const APPLIED_RELATION = NormsPortfolios.create(
  {
    normId: EntityId.create(ID.NORM.DEFAULT),
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  "11111111-1111-4111-8111-111111111111",
);

describe("removeNormFromPortfolio", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("removes the norm-portfolio relation", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        normsPortfolios: [APPLIED_RELATION],
      });

      await removeNormFromPortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        normId: ID.NORM.DEFAULT,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      const saved = await unitOfWork.normsPortfolios.findByNormIdAndPortfolioId(
        EntityId.create(ID.NORM.DEFAULT),
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );
      expect(saved).toBeNull();
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        normsPortfolios: [APPLIED_RELATION],
      });

      await removeNormFromPortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        normId: ID.NORM.DEFAULT,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        removeNormFromPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        normsPortfolios: [APPLIED_RELATION],
      });

      await expect(
        removeNormFromPortfolio(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has VIEWER role", async () => {
      const VIEWER_PERMISSION = {
        id: EntityId.create("cc000000-0000-4000-8000-000000000003"),
        userId: EntityId.create(ID.USER.OTHER),
        portfolioId: PORTFOLIO.id as EntityId,
        role: "VIEWER" as const,
        grantedByUserId: PORTFOLIO.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        normsPortfolios: [APPLIED_RELATION],
        portfolioPermissions: [VIEWER_PERMISSION as never],
      });

      await expect(
        removeNormFromPortfolio(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("allows an EDITOR role to remove a norm", async () => {
      const EDITOR_PERMISSION = {
        id: EntityId.create("dd000000-0000-4000-8000-000000000004"),
        userId: EntityId.create(ID.USER.OTHER),
        portfolioId: PORTFOLIO.id as EntityId,
        role: "EDITOR" as const,
        grantedByUserId: PORTFOLIO.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        normsPortfolios: [APPLIED_RELATION],
        portfolioPermissions: [EDITOR_PERMISSION as never],
      });

      await removeNormFromPortfolio(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        normId: ID.NORM.DEFAULT,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      const saved = await unitOfWork.normsPortfolios.findByNormIdAndPortfolioId(
        EntityId.create(ID.NORM.DEFAULT),
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );
      expect(saved).toBeNull();
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the norm is not applied to the portfolio", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        removeNormFromPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
