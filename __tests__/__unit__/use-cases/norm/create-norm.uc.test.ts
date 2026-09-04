import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { CATEGORY } from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createNorm } from "@/business/use-cases/norm/create-norm.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("createNorm", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a norm linked to the category", async () => {
      unitOfWork.seed({ categories: [CATEGORY] });

      const RESULT = await createNorm(unitOfWork as never, {
        actorId: ACTOR_ID,
        articleNumber: "Art. 1",
        name: "Política de Investimento",
        categoryId: ID.CATEGORY.DEFAULT,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      });

      expect(RESULT.articleNumber).toBe("Art. 1");
      expect(RESULT.name).toBe("Política de Investimento");
      expect(RESULT.categoryId).toBe(EntityId.create(ID.CATEGORY.DEFAULT));
      expect(RESULT.minAllocation).toBe("5");
      expect(RESULT.maxAllocation).toBe("20");
      expect(RESULT.targetAllocation).toBe("12");

      const saved = await unitOfWork.norms.findAllByCategoryId(
        EntityId.create(ID.CATEGORY.DEFAULT),
      );
      expect(saved).toHaveLength(1);
      expect(saved[0].name).toBe("Política de Investimento");
      expect(RESULT.name).toBe(saved[0].name);
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ categories: [CATEGORY] });

      await createNorm(unitOfWork as never, {
        actorId: ACTOR_ID,
        articleNumber: "Art. 1",
        name: "Política de Investimento",
        categoryId: ID.CATEGORY.DEFAULT,
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the category does not exist", async () => {
      await expect(
        createNorm(unitOfWork as never, {
          actorId: ACTOR_ID,
          articleNumber: "Art. 1",
          name: "Política de Investimento",
          categoryId: ID.CATEGORY.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("rollback", () => {
    it("does not persist the norm when the category is missing", async () => {
      await expect(
        createNorm(unitOfWork as never, {
          actorId: ACTOR_ID,
          articleNumber: "Art. 1",
          name: "Política de Investimento",
          categoryId: ID.CATEGORY.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);

      const norms = await unitOfWork.norms.findAllByCategoryId(
        EntityId.create(ID.CATEGORY.DEFAULT),
      );
      expect(norms).toHaveLength(0);
    });
  });
});
