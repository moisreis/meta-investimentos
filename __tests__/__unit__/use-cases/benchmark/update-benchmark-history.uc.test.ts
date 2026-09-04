import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BENCHMARK_HISTORY } from "@/__tests__/__helpers__/interfaces/_benchmark-history.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { updateBenchmarkHistory } from "@/business/use-cases/benchmark/update-benchmark-history.uc";
import { CPF } from "@/business/value-objects/cpf.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const MANAGER_ID = "f1e2d3c4-5b6a-4f7e-8d9c-0a1b2c3d4e5f";
const MANAGER = User.create(
  {
    name: "Admin Manager",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "Manager",
    cpf: CPF.create("39053344705"),
    role: "MANAGER",
  },
  MANAGER_ID,
);

describe("updateBenchmarkHistory", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("updates the rate of a benchmark history entry", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        benchmarkHistories: [BENCHMARK_HISTORY],
      });

      const RESULT = await updateBenchmarkHistory(unitOfWork as never, {
        actorId: MANAGER_ID,
        benchmarkHistoryId: ID.BENCHMARK_HISTORY.DEFAULT,
        rate: "3.5",
      });

      expect(RESULT.rate).toBe("3.5");

      const saved = await unitOfWork.benchmarkHistories.findById(
        EntityId.create(ID.BENCHMARK_HISTORY.DEFAULT),
      );
      expect(saved?.rate.value.toString()).toBe("3.5");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        benchmarkHistories: [BENCHMARK_HISTORY],
      });

      await updateBenchmarkHistory(unitOfWork as never, {
        actorId: MANAGER_ID,
        benchmarkHistoryId: ID.BENCHMARK_HISTORY.DEFAULT,
        rate: "3.5",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(MANAGER_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the benchmark history does not exist", async () => {
      unitOfWork.seed({ users: [MANAGER] });

      await expect(
        updateBenchmarkHistory(unitOfWork as never, {
          actorId: MANAGER_ID,
          benchmarkHistoryId: "00000000-0000-4000-8000-000000000000",
          rate: "1.0",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        benchmarkHistories: [BENCHMARK_HISTORY],
      });

      await expect(
        updateBenchmarkHistory(unitOfWork as never, {
          actorId: EntityId.create(ID.USER.DEFAULT).toString(),
          benchmarkHistoryId: ID.BENCHMARK_HISTORY.DEFAULT,
          rate: "1.0",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
