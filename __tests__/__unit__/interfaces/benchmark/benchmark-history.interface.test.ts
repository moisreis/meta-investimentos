import { beforeEach, describe, expect, it } from "vitest";

import {
  BENCHMARK_ID,
  createInMemoryBenchmarkHistoryRepository,
  HISTORY,
  HISTORY_DATE,
  HISTORY_ID,
  OTHER_BENCHMARK_ID,
} from "@/__tests__/__helpers__/interfaces/_benchmark-history.test.helper";

import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import type { IBenchmarkHistory } from "@/business/interfaces/benchmark/benchmark-history.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("IBenchmarkHistory", () => {
  let REPOSITORY: IBenchmarkHistory;

  beforeEach(() => {
    REPOSITORY = createInMemoryBenchmarkHistoryRepository();
  });

  describe("findById", () => {
    it("returns the persisted benchmark history", async () => {
      await REPOSITORY.save(HISTORY);

      const FOUND = await REPOSITORY.findById(EntityId.create(HISTORY_ID));

      expect(FOUND?.equals(HISTORY)).toBe(true);
    });

    it("returns null when the benchmark history does not exist", async () => {
      expect(await REPOSITORY.findById(EntityId.create(HISTORY_ID))).toBeNull();
    });
  });

  describe("findAllByBenchmarkId", () => {
    it("returns all persisted benchmark histories for the benchmark", async () => {
      const SECOND_HISTORY = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create(BENCHMARK_ID),
          date: new Date("2026-01-02T00:00:00.000Z"),
          rate: SignedPercentage.create("-1.5"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_HISTORY = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create(OTHER_BENCHMARK_ID),
          date: new Date("2026-01-03T00:00:00.000Z"),
          rate: SignedPercentage.create("0.75"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(HISTORY);
      await REPOSITORY.save(SECOND_HISTORY);
      await REPOSITORY.save(OTHER_HISTORY);

      const FOUND = await REPOSITORY.findAllByBenchmarkId(
        EntityId.create(BENCHMARK_ID),
      );

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(HISTORY)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_HISTORY)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByBenchmarkId(EntityId.create(BENCHMARK_ID)),
      ).toEqual([]);
    });
  });

  describe("findByBenchmarkIdAndDate", () => {
    it("returns the persisted benchmark history", async () => {
      await REPOSITORY.save(HISTORY);

      const FOUND = await REPOSITORY.findByBenchmarkIdAndDate(
        EntityId.create(BENCHMARK_ID),
        HISTORY_DATE,
      );

      expect(FOUND?.equals(HISTORY)).toBe(true);
    });

    it("returns null when the benchmark history does not exist", async () => {
      expect(
        await REPOSITORY.findByBenchmarkIdAndDate(
          EntityId.create(BENCHMARK_ID),
          HISTORY_DATE,
        ),
      ).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new benchmark history", async () => {
      await REPOSITORY.save(HISTORY);

      const FOUND = await REPOSITORY.findById(EntityId.create(HISTORY_ID));

      expect(FOUND?.equals(HISTORY)).toBe(true);
    });

    it("updates an existing benchmark history", async () => {
      await REPOSITORY.save(HISTORY);

      const UPDATED = BenchmarkHistory.create(
        {
          benchmarkId: EntityId.create(BENCHMARK_ID),
          date: HISTORY_DATE,
          rate: SignedPercentage.create("13.5"),
        },
        HISTORY_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(HISTORY_ID));

      expect(FOUND?.rate.value.toString()).toBe("13.5");
    });
  });

  describe("delete", () => {
    it("removes the persisted benchmark history", async () => {
      await REPOSITORY.save(HISTORY);

      await REPOSITORY.delete(EntityId.create(HISTORY_ID));

      expect(await REPOSITORY.findById(EntityId.create(HISTORY_ID))).toBeNull();
    });
  });
});
