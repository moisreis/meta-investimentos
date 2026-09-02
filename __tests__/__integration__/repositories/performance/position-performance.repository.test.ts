import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  EXTERNAL_POSITION_PERFORMANCE,
  FEBRUARY_PERFORMANCE_DATE,
  FRESH_POSITION_PERFORMANCE,
  newPositionPerformanceRepository,
  OTHER_POSITION_PERFORMANCE,
  PERFORMANCE_DATE,
  PERIOD_OUTSIDE_POSITION_PERFORMANCE,
  POSITION_PERFORMANCE,
  POSITION_PERFORMANCE_ID,
  seedAllPositionPerformances,
  seedPositionPerformances,
  UPDATED_POSITION_PERFORMANCE,
} from "@/__tests__/__helpers__/repositories/_performance.test.helper";
import {
  OTHER_POSITION_ID,
  POSITION_ID,
} from "@/__tests__/__seeds__/_position.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("PositionPerformanceRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted performance", async () => {
      await seedPositionPerformances();

      const FOUND = await newPositionPerformanceRepository().findById(
        EntityId.create(POSITION_PERFORMANCE_ID),
      );

      expect(FOUND?.equals(POSITION_PERFORMANCE)).toBe(true);
    });

    it("returns null when the performance does not exist", async () => {
      expect(
        await newPositionPerformanceRepository().findById(
          EntityId.create(POSITION_PERFORMANCE_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findAllByPositionId", () => {
    it("returns the whole performance series of the position", async () => {
      await seedAllPositionPerformances();

      const FOUND =
        await newPositionPerformanceRepository().findAllByPositionId(
          EntityId.create(POSITION_ID),
        );

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((ROW) => ROW.equals(POSITION_PERFORMANCE))).toBe(true);
      expect(
        FOUND.some((ROW) => ROW.equals(EXTERNAL_POSITION_PERFORMANCE)),
      ).toBe(true);
      expect(
        FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_POSITION_PERFORMANCE)),
      ).toBe(true);
    });

    it("returns an empty array when the position has no performances", async () => {
      expect(
        await newPositionPerformanceRepository().findAllByPositionId(
          EntityId.create(POSITION_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByPositionIds", () => {
    it("returns the series of all the provided positions", async () => {
      await seedAllPositionPerformances();

      const FOUND =
        await newPositionPerformanceRepository().findAllByPositionIds([
          EntityId.create(POSITION_ID),
          EntityId.create(OTHER_POSITION_ID),
        ]);

      expect(FOUND).toHaveLength(4);
      expect(FOUND.some((ROW) => ROW.equals(POSITION_PERFORMANCE))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_POSITION_PERFORMANCE))).toBe(
        true,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newPositionPerformanceRepository().findAllByPositionIds([]),
      ).toEqual([]);
    });
  });

  describe("findByPositionIdAndDate", () => {
    it("returns the performance of the position on the date", async () => {
      await seedPositionPerformances();

      const FOUND =
        await newPositionPerformanceRepository().findByPositionIdAndDate(
          EntityId.create(POSITION_ID),
          PERFORMANCE_DATE,
        );

      expect(FOUND?.equals(POSITION_PERFORMANCE)).toBe(true);
    });

    it("returns null when the position has no performance on the date", async () => {
      await seedPositionPerformances();

      const FOUND =
        await newPositionPerformanceRepository().findByPositionIdAndDate(
          EntityId.create(POSITION_ID),
          FEBRUARY_PERFORMANCE_DATE,
        );

      expect(FOUND).toBeNull();
    });
  });

  describe("findLatestByPositionId", () => {
    it("returns the performance with the most recent date", async () => {
      await seedAllPositionPerformances();

      const FOUND =
        await newPositionPerformanceRepository().findLatestByPositionId(
          EntityId.create(POSITION_ID),
        );

      expect(FOUND?.equals(PERIOD_OUTSIDE_POSITION_PERFORMANCE)).toBe(true);
    });

    it("returns null when the position has no performances", async () => {
      expect(
        await newPositionPerformanceRepository().findLatestByPositionId(
          EntityId.create(POSITION_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findLatestByPositionIds", () => {
    it("returns the latest performance per provided position", async () => {
      await seedAllPositionPerformances();

      const FOUND =
        await newPositionPerformanceRepository().findLatestByPositionIds([
          EntityId.create(POSITION_ID),
          EntityId.create(OTHER_POSITION_ID),
        ]);

      expect(FOUND).toHaveLength(2);
      expect(
        FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_POSITION_PERFORMANCE)),
      ).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_POSITION_PERFORMANCE))).toBe(
        true,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newPositionPerformanceRepository().findLatestByPositionIds([]),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new performance", async () => {
      await seedPositionPerformances();

      const SAVED = await newPositionPerformanceRepository().save(
        FRESH_POSITION_PERFORMANCE,
      );

      expect(SAVED.id).toBeDefined();
      expect(SAVED.patrimony.value.toString()).toBe(
        FRESH_POSITION_PERFORMANCE.patrimony.value.toString(),
      );
      expect(
        (
          await newPositionPerformanceRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing performance", async () => {
      await seedPositionPerformances();

      await newPositionPerformanceRepository().save(
        UPDATED_POSITION_PERFORMANCE,
      );

      const FOUND = await newPositionPerformanceRepository().findById(
        EntityId.create(POSITION_PERFORMANCE_ID),
      );

      expect(FOUND?.earnings.value.toString()).toBe(
        UPDATED_POSITION_PERFORMANCE.earnings.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_POSITION_PERFORMANCE)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted performance", async () => {
      await seedPositionPerformances();

      await newPositionPerformanceRepository().delete(
        EntityId.create(POSITION_PERFORMANCE_ID),
      );

      expect(
        await newPositionPerformanceRepository().findById(
          EntityId.create(POSITION_PERFORMANCE_ID),
        ),
      ).toBeNull();
    });
  });
});
