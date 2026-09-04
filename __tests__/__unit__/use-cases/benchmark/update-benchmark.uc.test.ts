import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  BENCHMARK,
  OTHER_BENCHMARK,
  UPDATED_BENCHMARK,
} from "@/__tests__/__helpers__/interfaces/_benchmark.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { updateBenchmark } from "@/business/use-cases/benchmark/update-benchmark.uc";
import { CPF } from "@/business/value-objects/cpf.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

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

describe("updateBenchmark", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("renames a benchmark", async () => {
      unitOfWork.seed({ users: [MANAGER], benchmarks: [BENCHMARK] });

      const RESULT = await updateBenchmark(unitOfWork as never, {
        actorId: MANAGER_ID,
        benchmarkId: ID.BENCHMARK.DEFAULT,
        name: UPDATED_BENCHMARK.name,
      });

      expect(RESULT.name).toBe(UPDATED_BENCHMARK.name);
    });

    it("changes the acronym of a benchmark", async () => {
      unitOfWork.seed({ users: [MANAGER], benchmarks: [BENCHMARK] });

      const RESULT = await updateBenchmark(unitOfWork as never, {
        actorId: MANAGER_ID,
        benchmarkId: ID.BENCHMARK.DEFAULT,
        acronym: "NEW",
      });

      expect(RESULT.acronym).toBe("NEW");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ users: [MANAGER], benchmarks: [BENCHMARK] });

      await updateBenchmark(unitOfWork as never, {
        actorId: MANAGER_ID,
        benchmarkId: ID.BENCHMARK.DEFAULT,
        name: UPDATED_BENCHMARK.name,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(MANAGER_ID));
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the new acronym collides", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        benchmarks: [BENCHMARK, OTHER_BENCHMARK],
      });

      await expect(
        updateBenchmark(unitOfWork as never, {
          actorId: MANAGER_ID,
          benchmarkId: ID.BENCHMARK.DEFAULT,
          acronym: OTHER_BENCHMARK.acronym,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the benchmark does not exist", async () => {
      unitOfWork.seed({ users: [MANAGER] });

      await expect(
        updateBenchmark(unitOfWork as never, {
          actorId: MANAGER_ID,
          benchmarkId: "00000000-0000-4000-8000-000000000000",
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({ users: [MANAGER], benchmarks: [BENCHMARK] });

      await expect(
        updateBenchmark(unitOfWork as never, {
          actorId: EntityId.create(ID.USER.DEFAULT).toString(),
          benchmarkId: ID.BENCHMARK.DEFAULT,
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
