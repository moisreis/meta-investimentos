import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import {
  EXTERNAL_POSITION_PERFORMANCE,
  POSITION_PERFORMANCE,
} from "@/__tests__/__helpers__/interfaces/_position-performance.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listPositionPerformances } from "@/business/use-cases/performance/list-position-performances.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("listPositionPerformances", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all performances of the position", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        positionPerformances: [
          POSITION_PERFORMANCE,
          EXTERNAL_POSITION_PERFORMANCE,
        ],
      });

      const RESULT = await listPositionPerformances(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
      });

      expect(RESULT).toHaveLength(2);
      expect(RESULT.map((ROW) => ROW.id)).toEqual(
        expect.arrayContaining([
          EntityId.create(ID.POSITION_PERFORMANCE.DEFAULT),
          EntityId.create(ID.POSITION_PERFORMANCE.EXTERNAL),
        ]),
      );
    });

    it("returns an empty list when the position has no performances", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      const RESULT = await listPositionPerformances(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
      });

      expect(RESULT).toHaveLength(0);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the position does not exist", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
      });

      await expect(
        listPositionPerformances(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
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
        listPositionPerformances(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          positionId: ID.POSITION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the position portfolio does not exist", async () => {
      unitOfWork.seed({
        positions: [POSITION],
        positionPerformances: [POSITION_PERFORMANCE],
      });

      await expect(
        listPositionPerformances(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
