import { beforeEach, describe, expect, it } from "vitest";

import {
  BENCHMARK,
  BENCHMARK_ID,
  createInMemoryBenchmarkRepository,
} from "@/__tests__/__helpers__/interfaces/_benchmark.test.helper";

import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import type { IBenchmark } from "@/business/interfaces/benchmark/benchmark.interface";

describe("IBenchmark", () => {
  let REPOSITORY: IBenchmark;

  beforeEach(() => {
    REPOSITORY = createInMemoryBenchmarkRepository();
  });

  describe("findById", () => {
    it("returns the persisted benchmark", async () => {
      await REPOSITORY.save(BENCHMARK);

      const FOUND = await REPOSITORY.findById(BENCHMARK_ID);

      expect(FOUND?.equals(BENCHMARK)).toBe(true);
    });

    it("returns null when the benchmark does not exist", async () => {
      expect(await REPOSITORY.findById(BENCHMARK_ID)).toBeNull();
    });
  });

  describe("findByAcronym", () => {
    it("returns the persisted benchmark", async () => {
      await REPOSITORY.save(BENCHMARK);

      const FOUND = await REPOSITORY.findByAcronym(BENCHMARK.acronym);

      expect(FOUND?.equals(BENCHMARK)).toBe(true);
    });

    it("returns null when the benchmark does not exist", async () => {
      expect(await REPOSITORY.findByAcronym(BENCHMARK.acronym)).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new benchmark", async () => {
      await REPOSITORY.save(BENCHMARK);

      const FOUND = await REPOSITORY.findById(BENCHMARK_ID);

      expect(FOUND?.equals(BENCHMARK)).toBe(true);
    });

    it("updates an existing benchmark", async () => {
      await REPOSITORY.save(BENCHMARK);

      const UPDATED = Benchmark.create(
        { acronym: "IBOV", name: "Ibovespa B3" },
        BENCHMARK_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(BENCHMARK_ID);

      expect(FOUND?.name).toBe("Ibovespa B3");
    });
  });

  describe("delete", () => {
    it("removes the persisted benchmark", async () => {
      await REPOSITORY.save(BENCHMARK);

      await REPOSITORY.delete(BENCHMARK_ID);

      expect(await REPOSITORY.findById(BENCHMARK_ID)).toBeNull();
    });
  });
});
