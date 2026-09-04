import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { updatePortfolioAllocation } from "@/business/use-cases/portfolio/update-portfolio-allocation.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

const INPUT = {
  minAllocation: "8",
  targetAllocation: "12",
  maxAllocation: "25",
};

describe("updatePortfolioAllocation", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("updates the allocation of a portfolio owned by the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await updatePortfolioAllocation(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        ...INPUT,
      });

      expect(RESULT.id).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.minAllocation).toBe("8");
      expect(RESULT.targetAllocation).toBe("12");
      expect(RESULT.maxAllocation).toBe("25");
    });

    it("updates the allocation when the actor is an editor", async () => {
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

      const RESULT = await updatePortfolioAllocation(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        ...INPUT,
      });

      expect(RESULT.minAllocation).toBe("8");
    });

    it("persists the update and attributes the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await updatePortfolioAllocation(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        ...INPUT,
      });

      const saved = await unitOfWork.portfolios.findById(
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );
      expect(saved?.minAllocation.value.toString()).toBe("8");
      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("triggers a portfolio recalculation attributed to the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await updatePortfolioAllocation(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        ...INPUT,
      });

      expect(unitOfWork.ranAsActors).toHaveLength(2);
      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("errors", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        updatePortfolioAllocation(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          ...INPUT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is a viewer", async () => {
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
        updatePortfolioAllocation(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          ...INPUT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        updatePortfolioAllocation(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          ...INPUT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when the minimum exceeds the target", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        updatePortfolioAllocation(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          minAllocation: "30",
          targetAllocation: "12",
          maxAllocation: "25",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when the target exceeds the maximum", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        updatePortfolioAllocation(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          minAllocation: "8",
          targetAllocation: "12",
          maxAllocation: "10",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
