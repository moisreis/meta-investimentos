import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  BENCHMARK,
  OTHER_BENCHMARK,
} from "@/__tests__/__helpers__/interfaces/_benchmark.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listBenchmarks } from "@/business/use-cases/benchmark/list-benchmarks.uc";

describe("listBenchmarks", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all seeded benchmarks", async () => {
      unitOfWork.seed({ benchmarks: [BENCHMARK, OTHER_BENCHMARK] });

      const result = await listBenchmarks(unitOfWork as never, {});

      expect(result).toHaveLength(2);
      expect(result[0].id.toString()).toBe(ID.BENCHMARK.DEFAULT);
      expect(result[1].id.toString()).toBe(ID.BENCHMARK.OTHER);
    });

    it("returns an empty array when no benchmarks exist", async () => {
      const result = await listBenchmarks(unitOfWork as never, {});

      expect(result).toHaveLength(0);
    });
  });
});
