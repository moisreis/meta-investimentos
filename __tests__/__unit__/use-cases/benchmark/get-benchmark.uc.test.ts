import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BENCHMARK } from "@/__tests__/__helpers__/interfaces/_benchmark.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getBenchmark } from "@/business/use-cases/benchmark/get-benchmark.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getBenchmark", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the benchmark when it exists", async () => {
      unitOfWork.seed({ benchmarks: [BENCHMARK] });

      const RESULT = await getBenchmark(unitOfWork as never, {
        benchmarkId: ID.BENCHMARK.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.BENCHMARK.DEFAULT));
      expect(RESULT.acronym).toBe("IBOV");
      expect(RESULT.name).toBe("Ibovespa");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the benchmark does not exist", async () => {
      await expect(
        getBenchmark(unitOfWork as never, {
          benchmarkId: ID.BENCHMARK.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
