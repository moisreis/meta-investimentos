import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { updatePortfolioAnnualInterestRate } from "@/business/use-cases/portfolio/update-portfolio-annual-interest-rate.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("updatePortfolioAnnualInterestRate", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("updates the rate of a portfolio owned by the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await updatePortfolioAnnualInterestRate(
        unitOfWork as never,
        {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          annualInterestRate: "15",
        },
      );

      expect(RESULT.id).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.annualInterestRate).toBe("15");
    });

    it("updates the rate when the actor is an editor", async () => {
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

      const RESULT = await updatePortfolioAnnualInterestRate(
        unitOfWork as never,
        {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          annualInterestRate: "12",
        },
      );

      expect(RESULT.annualInterestRate).toBe("12");
    });

    it("persists the update and attributes the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await updatePortfolioAnnualInterestRate(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        annualInterestRate: "18",
      });

      const saved = await unitOfWork.portfolios.findById(
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );
      expect(saved?.annualInterestRate.value.toString()).toBe("18");
      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("errors", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        updatePortfolioAnnualInterestRate(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          annualInterestRate: "10",
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
        updatePortfolioAnnualInterestRate(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          annualInterestRate: "10",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        updatePortfolioAnnualInterestRate(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          annualInterestRate: "10",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when the rate is negative", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        updatePortfolioAnnualInterestRate(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          annualInterestRate: "-5",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
