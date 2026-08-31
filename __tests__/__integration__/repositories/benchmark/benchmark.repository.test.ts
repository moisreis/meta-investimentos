import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  BENCHMARK,
  BENCHMARK_ID,
  FRESH_BENCHMARK,
  newBenchmarkRepository,
  OTHER_BENCHMARK,
  OTHER_BENCHMARK_ID,
  seedBenchmarks,
  UPDATED_BENCHMARK,
} from "@/__tests__/__helpers__/repositories/_benchmark.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("BenchmarkRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted benchmark", async () => {
      await seedBenchmarks();

      const FOUND = await newBenchmarkRepository().findById(BENCHMARK_ID);

      expect(FOUND?.equals(BENCHMARK)).toBe(true);
    });

    it("returns null when the benchmark does not exist", async () => {
      expect(await newBenchmarkRepository().findById(BENCHMARK_ID)).toBeNull();
    });
  });

  describe("findAllByIds", () => {
    it("returns all benchmarks with the provided ids", async () => {
      await seedBenchmarks();

      const FOUND = await newBenchmarkRepository().findAllByIds([
        BENCHMARK_ID,
        OTHER_BENCHMARK_ID,
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(BENCHMARK))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_BENCHMARK))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newBenchmarkRepository().findAllByIds([])).toEqual([]);
    });
  });

  describe("findByAcronym", () => {
    it("returns the benchmark with the acronym", async () => {
      await seedBenchmarks();

      const FOUND = await newBenchmarkRepository().findByAcronym(
        BENCHMARK.acronym,
      );

      expect(FOUND?.equals(BENCHMARK)).toBe(true);
    });

    it("returns null when no benchmark has the acronym", async () => {
      expect(
        await newBenchmarkRepository().findByAcronym(BENCHMARK.acronym),
      ).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new benchmark", async () => {
      const SAVED = await newBenchmarkRepository().save(FRESH_BENCHMARK);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.acronym).toBe(FRESH_BENCHMARK.acronym);
      expect(
        (await newBenchmarkRepository().findById(SAVED.id as string))?.equals(
          SAVED,
        ),
      ).toBe(true);
    });

    it("updates an existing benchmark", async () => {
      await seedBenchmarks();

      await newBenchmarkRepository().save(UPDATED_BENCHMARK);

      const FOUND = await newBenchmarkRepository().findById(BENCHMARK_ID);

      expect(FOUND?.name).toBe(UPDATED_BENCHMARK.name);
      expect(FOUND?.equals(UPDATED_BENCHMARK)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted benchmark", async () => {
      await seedBenchmarks();

      await newBenchmarkRepository().delete(BENCHMARK_ID);

      expect(await newBenchmarkRepository().findById(BENCHMARK_ID)).toBeNull();
    });
  });
});
