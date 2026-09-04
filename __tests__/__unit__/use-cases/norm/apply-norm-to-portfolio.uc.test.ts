import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { NORM } from "@/__tests__/__helpers__/interfaces/_norm.test.helper";
import { NORM_PORTFOLIOS } from "@/__tests__/__helpers__/interfaces/_norms-portfolios.test.helper";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { applyNormToPortfolio } from "@/business/use-cases/norm/apply-norm-to-portfolio.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("applyNormToPortfolio", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("applies a norm to a portfolio owned by the actor", async () => {
      unitOfWork.seed({ norms: [NORM], portfolios: [PORTFOLIO] });

      const RESULT = await applyNormToPortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        normId: ID.NORM.DEFAULT,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      });

      expect(RESULT.normId).toBe(ID.NORM.DEFAULT);
      expect(RESULT.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.minAllocation).toBe("5");
      expect(RESULT.maxAllocation).toBe("20");
      expect(RESULT.targetAllocation).toBe("12");

      const saved = await unitOfWork.normsPortfolios.findByNormIdAndPortfolioId(
        EntityId.create(ID.NORM.DEFAULT),
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );
      expect(saved).not.toBeNull();
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ norms: [NORM], portfolios: [PORTFOLIO] });

      await applyNormToPortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        normId: ID.NORM.DEFAULT,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the norm does not exist", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        applyNormToPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      unitOfWork.seed({ norms: [NORM] });

      await expect(
        applyNormToPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({ norms: [NORM], portfolios: [PORTFOLIO] });

      await expect(
        applyNormToPortfolio(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has VIEWER role", async () => {
      const VIEWER_PERMISSION = {
        id: EntityId.create("aa000000-0000-4000-8000-000000000001"),
        userId: EntityId.create(ID.USER.OTHER),
        portfolioId: PORTFOLIO.id as EntityId,
        role: "VIEWER" as const,
        grantedByUserId: PORTFOLIO.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      unitOfWork.seed({
        norms: [NORM],
        portfolios: [PORTFOLIO],
        portfolioPermissions: [VIEWER_PERMISSION as never],
      });

      await expect(
        applyNormToPortfolio(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("allows an EDITOR role to apply a norm", async () => {
      const EDITOR_PERMISSION = {
        id: EntityId.create("bb000000-0000-4000-8000-000000000002"),
        userId: EntityId.create(ID.USER.OTHER),
        portfolioId: PORTFOLIO.id as EntityId,
        role: "EDITOR" as const,
        grantedByUserId: PORTFOLIO.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      unitOfWork.seed({
        norms: [NORM],
        portfolios: [PORTFOLIO],
        portfolioPermissions: [EDITOR_PERMISSION as never],
      });

      const RESULT = await applyNormToPortfolio(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        normId: ID.NORM.DEFAULT,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      });

      expect(RESULT.normId).toBe(ID.NORM.DEFAULT);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the norm is already applied to the portfolio", async () => {
      unitOfWork.seed({
        norms: [NORM],
        portfolios: [PORTFOLIO],
        normsPortfolios: [NORM_PORTFOLIOS],
      });

      await expect(
        applyNormToPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          normId: ID.NORM.DEFAULT,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
