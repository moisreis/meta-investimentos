import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { USER } from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { requireManager } from "@/business/use-cases/shared/require-manager";
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

describe("requireManager", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  it("returns the actor when they are a manager", async () => {
    unitOfWork.seed({ users: [MANAGER] });

    const ACTOR = await requireManager(unitOfWork as never, MANAGER_ID);

    expect(ACTOR.role).toBe("MANAGER");
  });

  it("throws NotFoundError when the actor does not exist", async () => {
    await expect(
      requireManager(
        unitOfWork as never,
        "00000000-0000-4000-8000-000000000000",
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws NotFoundError when the actor is not a manager", async () => {
    unitOfWork.seed({ users: [USER] });

    await expect(
      requireManager(unitOfWork as never, ID.USER.DEFAULT),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
