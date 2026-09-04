import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createBenchmark } from "@/business/use-cases/benchmark/create-benchmark.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("createBenchmark", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a benchmark", async () => {
      const RESULT = await createBenchmark(unitOfWork as never, {
        actorId: ACTOR_ID,
        acronym: "IBOV",
        name: "Ibovespa",
      });

      expect(RESULT.acronym).toBe("IBOV");
      expect(RESULT.name).toBe("Ibovespa");

      const saved = await unitOfWork.benchmarks.findByAcronym("IBOV");
      expect(saved).not.toBeNull();
      expect(saved?.acronym).toBe("IBOV");
      expect(saved?.name).toBe("Ibovespa");
    });

    it("attributes the mutation to the actor", async () => {
      await createBenchmark(unitOfWork as never, {
        actorId: ACTOR_ID,
        acronym: "IBOV",
        name: "Ibovespa",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("validation", () => {
    it("throws ValidationError when a benchmark with the same acronym already exists", async () => {
      await createBenchmark(unitOfWork as never, {
        actorId: ACTOR_ID,
        acronym: "IBOV",
        name: "Ibovespa",
      });

      await expect(
        createBenchmark(unitOfWork as never, {
          actorId: ACTOR_ID,
          acronym: "IBOV",
          name: "Outro Índice",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
