import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import { POSITION_PERFORMANCE } from "@/__tests__/__helpers__/interfaces/_position-performance.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getPositionPerformance } from "@/business/use-cases/performance/get-position-performance.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("getPositionPerformance", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the performance for a position the actor can access", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        positionPerformances: [POSITION_PERFORMANCE],
      });

      const RESULT = await getPositionPerformance(unitOfWork as never, {
        actorId: ACTOR_ID,
        performanceId: ID.POSITION_PERFORMANCE.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.POSITION_PERFORMANCE.DEFAULT));
      expect(RESULT.positionId).toBe(EntityId.create(ID.POSITION.DEFAULT));
      expect(RESULT.patrimony).toBe(
        POSITION_PERFORMANCE.patrimony.value.toString(),
      );
    });

    it("returns the performance for a shared position granted by permission", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        positionPerformances: [POSITION_PERFORMANCE],
        portfolioPermissions: [
          {
            id: EntityId.create("7a7b7c7d-7e7f-4a8b-9c0d-1e2f3a4b5c6d"),
            userId: EntityId.create(ID.USER.OTHER),
            portfolioId: PORTFOLIO.id as EntityId,
            role: "VIEWER" as const,
            grantedByUserId: PORTFOLIO.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never,
        ],
      });

      const RESULT = await getPositionPerformance(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        performanceId: ID.POSITION_PERFORMANCE.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.POSITION_PERFORMANCE.DEFAULT));
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the performance does not exist", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      await expect(
        getPositionPerformance(unitOfWork as never, {
          actorId: ACTOR_ID,
          performanceId: ID.POSITION_PERFORMANCE.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the position does not exist", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positionPerformances: [POSITION_PERFORMANCE],
      });

      await expect(
        getPositionPerformance(unitOfWork as never, {
          actorId: ACTOR_ID,
          performanceId: ID.POSITION_PERFORMANCE.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        positionPerformances: [POSITION_PERFORMANCE],
      });

      await expect(
        getPositionPerformance(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          performanceId: ID.POSITION_PERFORMANCE.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the position portfolio does not exist", async () => {
      unitOfWork.seed({
        positions: [POSITION],
        positionPerformances: [POSITION_PERFORMANCE],
      });

      await expect(
        getPositionPerformance(unitOfWork as never, {
          actorId: ACTOR_ID,
          performanceId: ID.POSITION_PERFORMANCE.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
