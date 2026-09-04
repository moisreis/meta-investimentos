import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { listUsers } from "@/business/use-cases/user/list-users.uc";
import { CPF } from "@/business/value-objects/cpf.vo";
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

describe("listUsers", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all users when the actor is a manager", async () => {
      unitOfWork.seed({ users: [MANAGER, USER, OTHER_USER] });

      const RESULT = await listUsers(unitOfWork as never, {
        actorId: MANAGER_ID,
      });

      expect(RESULT).toHaveLength(3);
    });

    it("returns an empty list when no users exist", async () => {
      unitOfWork.seed({ users: [MANAGER] });

      const RESULT = await listUsers(unitOfWork as never, {
        actorId: MANAGER_ID,
      });

      expect(RESULT).toHaveLength(1);
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the actor does not exist", async () => {
      await expect(
        listUsers(unitOfWork as never, {
          actorId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      await expect(
        listUsers(unitOfWork as never, {
          actorId: ID.USER.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
