import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  BENCHMARK_HISTORY,
  BENCHMARK_HISTORY_ID,
  BENCHMARK_ID,
  EXTERNAL_BENCHMARK_HISTORY,
  FEBRUARY_HISTORY_DATE,
  FRESH_BENCHMARK_HISTORY,
  HISTORY_DATE,
  HISTORY_DUPLICATE_DATE,
  newBenchmarkHistoryRepository,
  OTHER_BENCHMARK_HISTORY,
  OTHER_BENCHMARK_ID,
  PERIOD_OUTSIDE_HISTORY,
  seedAllBenchmarkHistories,
  seedBenchmarkHistories,
  UPDATED_BENCHMARK_HISTORY,
} from "@/__tests__/__helpers__/repositories/_benchmark.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("BenchmarkHistoryRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted history record", async () => {
      await seedBenchmarkHistories();

      const FOUND = await newBenchmarkHistoryRepository().findById(
        EntityId.create(BENCHMARK_HISTORY_ID),
      );

      expect(FOUND?.equals(BENCHMARK_HISTORY)).toBe(true);
    });

    it("returns null when the history record does not exist", async () => {
      expect(
        await newBenchmarkHistoryRepository().findById(
          EntityId.create(BENCHMARK_HISTORY_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findAllByBenchmarkId", () => {
    it("returns the whole rate series of the benchmark", async () => {
      await seedAllBenchmarkHistories();

      const FOUND = await newBenchmarkHistoryRepository().findAllByBenchmarkId(
        EntityId.create(BENCHMARK_ID),
      );

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((ROW) => ROW.equals(BENCHMARK_HISTORY))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_BENCHMARK_HISTORY))).toBe(
        true,
      );
      expect(FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_HISTORY))).toBe(
        true,
      );
    });

    it("returns an empty array when no records exist", async () => {
      expect(
        await newBenchmarkHistoryRepository().findAllByBenchmarkId(
          EntityId.create(BENCHMARK_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByBenchmarkIds", () => {
    it("returns the series of all the provided benchmarks", async () => {
      await seedAllBenchmarkHistories();

      const FOUND = await newBenchmarkHistoryRepository().findAllByBenchmarkIds(
        [EntityId.create(BENCHMARK_ID), EntityId.create(OTHER_BENCHMARK_ID)],
      );

      expect(FOUND).toHaveLength(4);
      expect(FOUND.some((ROW) => ROW.equals(BENCHMARK_HISTORY))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_BENCHMARK_HISTORY))).toBe(
        true,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newBenchmarkHistoryRepository().findAllByBenchmarkIds([]),
      ).toEqual([]);
    });
  });

  describe("findAllByBenchmarkIdsInPeriod", () => {
    it("returns only the records within the period, inclusive", async () => {
      await seedAllBenchmarkHistories();

      const FOUND =
        await newBenchmarkHistoryRepository().findAllByBenchmarkIdsInPeriod(
          [EntityId.create(BENCHMARK_ID), EntityId.create(OTHER_BENCHMARK_ID)],
          HISTORY_DATE,
          HISTORY_DUPLICATE_DATE,
        );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(BENCHMARK_HISTORY))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_BENCHMARK_HISTORY))).toBe(
        true,
      );
      expect(FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_HISTORY))).toBe(
        false,
      );
      expect(FOUND.some((ROW) => ROW.equals(OTHER_BENCHMARK_HISTORY))).toBe(
        false,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newBenchmarkHistoryRepository().findAllByBenchmarkIdsInPeriod(
          [],
          HISTORY_DATE,
          FEBRUARY_HISTORY_DATE,
        ),
      ).toEqual([]);
    });
  });

  describe("findByBenchmarkIdAndDate", () => {
    it("returns the record of the benchmark on the date", async () => {
      await seedBenchmarkHistories();

      const FOUND =
        await newBenchmarkHistoryRepository().findByBenchmarkIdAndDate(
          EntityId.create(BENCHMARK_ID),
          HISTORY_DATE,
        );

      expect(FOUND?.equals(BENCHMARK_HISTORY)).toBe(true);
    });

    it("returns null when the benchmark has no record on the date", async () => {
      await seedBenchmarkHistories();

      const FOUND =
        await newBenchmarkHistoryRepository().findByBenchmarkIdAndDate(
          EntityId.create(BENCHMARK_ID),
          FEBRUARY_HISTORY_DATE,
        );

      expect(FOUND).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new history record", async () => {
      await seedBenchmarkHistories();

      const SAVED = await newBenchmarkHistoryRepository().save(
        FRESH_BENCHMARK_HISTORY,
      );

      expect(SAVED.id).toBeDefined();
      expect(SAVED.rate.value.toString()).toBe(
        FRESH_BENCHMARK_HISTORY.rate.value.toString(),
      );
      expect(
        (
          await newBenchmarkHistoryRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing history record", async () => {
      await seedBenchmarkHistories();

      await newBenchmarkHistoryRepository().save(UPDATED_BENCHMARK_HISTORY);

      const FOUND = await newBenchmarkHistoryRepository().findById(
        EntityId.create(BENCHMARK_HISTORY_ID),
      );

      expect(FOUND?.rate.value.toString()).toBe(
        UPDATED_BENCHMARK_HISTORY.rate.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_BENCHMARK_HISTORY)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted history record", async () => {
      await seedBenchmarkHistories();

      await newBenchmarkHistoryRepository().delete(
        EntityId.create(BENCHMARK_HISTORY_ID),
      );

      expect(
        await newBenchmarkHistoryRepository().findById(
          EntityId.create(BENCHMARK_HISTORY_ID),
        ),
      ).toBeNull();
    });
  });
});
