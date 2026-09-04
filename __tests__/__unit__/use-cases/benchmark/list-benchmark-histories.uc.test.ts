import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  BENCHMARK_HISTORY,
  OTHER_BENCHMARK_HISTORY,
} from "@/__tests__/__helpers__/interfaces/_benchmark-history.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listBenchmarkHistories } from "@/business/use-cases/benchmark/list-benchmark-histories.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";

const BENCHMARK_ID = ID.BENCHMARK.DEFAULT;

describe("listBenchmarkHistories", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the history entries of the benchmark", async () => {
      unitOfWork.seed({
        benchmarkHistories: [BENCHMARK_HISTORY, OTHER_BENCHMARK_HISTORY],
      });

      const RESULT = await listBenchmarkHistories(unitOfWork as never, {
        benchmarkId: BENCHMARK_ID,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].benchmarkId).toBe(EntityId.create(BENCHMARK_ID));
      expect(RESULT[0].rate).toBe("1.25");
    });

    it("returns an empty list when the benchmark has no history entries", async () => {
      const RESULT = await listBenchmarkHistories(unitOfWork as never, {
        benchmarkId: BENCHMARK_ID,
      });

      expect(RESULT).toEqual([]);
    });
  });
});
