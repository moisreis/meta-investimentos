import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BENCHMARK } from "@/__tests__/__helpers__/interfaces/_benchmark.test.helper";
import {
  BENCHMARK_HISTORY,
  HISTORY_DATE,
} from "@/__tests__/__helpers__/interfaces/_benchmark-history.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createBenchmarkHistory } from "@/business/use-cases/benchmark/create-benchmark-history.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const BENCHMARK_ID = ID.BENCHMARK.DEFAULT;

describe("createBenchmarkHistory", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a benchmark history entry", async () => {
      unitOfWork.seed({ benchmarks: [BENCHMARK] });

      const RESULT = await createBenchmarkHistory(unitOfWork as never, {
        actorId: ACTOR_ID,
        benchmarkId: BENCHMARK_ID,
        date: HISTORY_DATE,
        rate: "1.25",
      });

      expect(RESULT.benchmarkId).toBe(EntityId.create(BENCHMARK_ID));
      expect(RESULT.date).toEqual(HISTORY_DATE);
      expect(RESULT.rate).toBe("1.25");

      const saved = await unitOfWork.benchmarkHistories.findById(
        EntityId.create(RESULT.id),
      );
      expect(saved).not.toBeNull();
      expect(saved?.rate.value.toString()).toBe("1.25");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ benchmarks: [BENCHMARK] });

      await createBenchmarkHistory(unitOfWork as never, {
        actorId: ACTOR_ID,
        benchmarkId: BENCHMARK_ID,
        date: HISTORY_DATE,
        rate: "1.25",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("validation", () => {
    it("throws NotFoundError when the benchmark does not exist", async () => {
      await expect(
        createBenchmarkHistory(unitOfWork as never, {
          actorId: ACTOR_ID,
          benchmarkId: BENCHMARK_ID,
          date: HISTORY_DATE,
          rate: "1.25",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when a history entry already exists for the benchmark on that date", async () => {
      unitOfWork.seed({
        benchmarks: [BENCHMARK],
        benchmarkHistories: [BENCHMARK_HISTORY],
      });

      await expect(
        createBenchmarkHistory(unitOfWork as never, {
          actorId: ACTOR_ID,
          benchmarkId: BENCHMARK_ID,
          date: HISTORY_DATE,
          rate: "1.25",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
