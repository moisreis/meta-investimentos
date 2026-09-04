import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { CATEGORY } from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createCategory } from "@/business/use-cases/fund/create-category.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("createCategory", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a category", async () => {
      const RESULT = await createCategory(unitOfWork as never, {
        actorId: ACTOR_ID,
        name: "Multimercado",
      });

      expect(RESULT.name).toBe("Multimercado");

      const saved = await unitOfWork.categories.findByName("Multimercado");
      expect(saved).not.toBeNull();
      expect(saved?.name).toBe("Multimercado");
    });

    it("attributes the mutation to the actor", async () => {
      await createCategory(unitOfWork as never, {
        actorId: ACTOR_ID,
        name: "Multimercado",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("validation", () => {
    it("throws ValidationError when a category with the same name already exists", async () => {
      unitOfWork.seed({ categories: [CATEGORY] });

      await expect(
        createCategory(unitOfWork as never, {
          actorId: ACTOR_ID,
          name: CATEGORY.name,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("does not persist the category when the name already exists", async () => {
      unitOfWork.seed({ categories: [CATEGORY] });

      await expect(
        createCategory(unitOfWork as never, {
          actorId: ACTOR_ID,
          name: CATEGORY.name,
        }),
      ).rejects.toBeInstanceOf(ValidationError);

      const all = await unitOfWork.categories.findByName(CATEGORY.name);
      expect(all).toBe(CATEGORY);
    });
  });
});
