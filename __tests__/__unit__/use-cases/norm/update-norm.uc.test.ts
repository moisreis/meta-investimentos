import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { CATEGORY } from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { NORM } from "@/__tests__/__helpers__/interfaces/_norm.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { updateNorm } from "@/business/use-cases/norm/update-norm.uc";
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

describe("updateNorm", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("updates the name of a norm", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        norms: [NORM],
        categories: [CATEGORY],
      });

      const RESULT = await updateNorm(unitOfWork as never, {
        actorId: MANAGER_ID,
        normId: ID.NORM.DEFAULT,
        name: "Norma Atualizada",
      });

      expect(RESULT.name).toBe("Norma Atualizada");
    });

    it("updates the target allocation", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        norms: [NORM],
        categories: [CATEGORY],
      });

      const RESULT = await updateNorm(unitOfWork as never, {
        actorId: MANAGER_ID,
        normId: ID.NORM.DEFAULT,
        targetAllocation: "15",
      });

      expect(RESULT.targetAllocation).toBe("15");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        norms: [NORM],
        categories: [CATEGORY],
      });

      await updateNorm(unitOfWork as never, {
        actorId: MANAGER_ID,
        normId: ID.NORM.DEFAULT,
        name: "Norma Atualizada",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(MANAGER_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the norm does not exist", async () => {
      unitOfWork.seed({ users: [MANAGER], categories: [CATEGORY] });

      await expect(
        updateNorm(unitOfWork as never, {
          actorId: MANAGER_ID,
          normId: "00000000-0000-4000-8000-000000000000",
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        norms: [NORM],
        categories: [CATEGORY],
      });

      await expect(
        updateNorm(unitOfWork as never, {
          actorId: EntityId.create(ID.USER.DEFAULT).toString(),
          normId: ID.NORM.DEFAULT,
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the referenced category does not exist", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        norms: [NORM],
        categories: [CATEGORY],
      });

      await expect(
        updateNorm(unitOfWork as never, {
          actorId: MANAGER_ID,
          normId: ID.NORM.DEFAULT,
          categoryId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
