import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_PORTFOLIO,
  PORTFOLIO,
  THIRD_PORTFOLIO,
} from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { listPortfolios } from "@/business/use-cases/portfolio/list-portfolios.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;

describe("listPortfolios", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns only the portfolios owned by the actor", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO, OTHER_PORTFOLIO, THIRD_PORTFOLIO],
      });

      const RESULT = await listPortfolios(unitOfWork as never, {
        actorId: ACTOR_ID,
      });

      expect(RESULT).toHaveLength(2);
      expect(RESULT.map((p) => p.id).sort()).toEqual(
        [ID.PORTFOLIO.DEFAULT, ID.PORTFOLIO.THIRD].sort(),
      );
      expect(RESULT.every((p) => p.accessRole === "OWNER")).toBe(true);
    });

    it("returns only portfolios granted via permissions", async () => {
      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
          role: "EDITOR",
          grantedByUserId: EntityId.create(OTHER_ACTOR_ID),
        },
        ID.PORTFOLIO.THIRD,
      );

      unitOfWork.seed({
        portfolios: [OTHER_PORTFOLIO],
        portfolioPermissions: [permission],
      });

      const RESULT = await listPortfolios(unitOfWork as never, {
        actorId: ACTOR_ID,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].id).toBe(ID.PORTFOLIO.OTHER);
      expect(RESULT[0].accessRole).toBe("EDITOR");
    });

    it("returns a viewer role for granted portfolios", async () => {
      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
          role: "VIEWER",
          grantedByUserId: EntityId.create(OTHER_ACTOR_ID),
        },
        ID.PORTFOLIO.THIRD,
      );

      unitOfWork.seed({
        portfolios: [OTHER_PORTFOLIO],
        portfolioPermissions: [permission],
      });

      const RESULT = await listPortfolios(unitOfWork as never, {
        actorId: ACTOR_ID,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].accessRole).toBe("VIEWER");
    });

    it("combines owned and granted portfolios", async () => {
      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
          role: "VIEWER",
          grantedByUserId: EntityId.create(OTHER_ACTOR_ID),
        },
        ID.PORTFOLIO.THIRD,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO, OTHER_PORTFOLIO],
        portfolioPermissions: [permission],
      });

      const RESULT = await listPortfolios(unitOfWork as never, {
        actorId: ACTOR_ID,
      });

      expect(RESULT).toHaveLength(2);
      const owned = RESULT.find((p) => p.id === ID.PORTFOLIO.DEFAULT);
      const granted = RESULT.find((p) => p.id === ID.PORTFOLIO.OTHER);
      expect(owned?.accessRole).toBe("OWNER");
      expect(granted?.accessRole).toBe("VIEWER");
    });

    it("does not duplicate a granted portfolio the actor already owns", async () => {
      const permission = PortfolioPermission.create(
        {
          userId: EntityId.create(ACTOR_ID),
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          role: "EDITOR",
          grantedByUserId: EntityId.create(OTHER_ACTOR_ID),
        },
        ID.PORTFOLIO.THIRD,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPermissions: [permission],
      });

      const RESULT = await listPortfolios(unitOfWork as never, {
        actorId: ACTOR_ID,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].id).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT[0].accessRole).toBe("OWNER");
    });

    it("returns an empty list when the actor has no portfolios", async () => {
      unitOfWork.seed({ portfolios: [OTHER_PORTFOLIO] });

      const RESULT = await listPortfolios(unitOfWork as never, {
        actorId: ACTOR_ID,
      });

      expect(RESULT).toEqual([]);
    });
  });
});
