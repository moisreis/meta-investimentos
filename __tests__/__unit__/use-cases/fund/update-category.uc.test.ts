import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  CATEGORY,
  OTHER_CATEGORY,
  UPDATED_CATEGORY,
} from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { updateCategory } from "@/business/use-cases/fund/update-category.uc";
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

describe("updateCategory", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("renames a category", async () => {
      unitOfWork.seed({ users: [MANAGER], categories: [CATEGORY] });

      const RESULT = await updateCategory(unitOfWork as never, {
        actorId: MANAGER_ID,
        categoryId: ID.CATEGORY.DEFAULT,
        name: UPDATED_CATEGORY.name,
      });

      expect(RESULT.name).toBe(UPDATED_CATEGORY.name);

      const saved = await unitOfWork.categories.findById(
        EntityId.create(ID.CATEGORY.DEFAULT),
      );
      expect(saved?.name).toBe(UPDATED_CATEGORY.name);
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ users: [MANAGER], categories: [CATEGORY] });

      await updateCategory(unitOfWork as never, {
        actorId: MANAGER_ID,
        categoryId: ID.CATEGORY.DEFAULT,
        name: UPDATED_CATEGORY.name,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(MANAGER_ID));
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the new name collides", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        categories: [CATEGORY, OTHER_CATEGORY],
      });

      await expect(
        updateCategory(unitOfWork as never, {
          actorId: MANAGER_ID,
          categoryId: ID.CATEGORY.DEFAULT,
          name: OTHER_CATEGORY.name,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the category does not exist", async () => {
      unitOfWork.seed({ users: [MANAGER] });

      await expect(
        updateCategory(unitOfWork as never, {
          actorId: MANAGER_ID,
          categoryId: "00000000-0000-4000-8000-000000000000",
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({ users: [MANAGER], categories: [CATEGORY] });

      await expect(
        updateCategory(unitOfWork as never, {
          actorId: EntityId.create(ID.USER.DEFAULT).toString(),
          categoryId: ID.CATEGORY.DEFAULT,
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
