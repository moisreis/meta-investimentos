import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  BANK,
  OTHER_BANK,
  UPDATED_BANK,
} from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { updateBank } from "@/business/use-cases/bank/update-bank.uc";
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

describe("updateBank", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("renames a bank", async () => {
      unitOfWork.seed({ users: [MANAGER], banks: [BANK] });

      const RESULT = await updateBank(unitOfWork as never, {
        actorId: MANAGER_ID,
        bankId: ID.BANK.DEFAULT,
        name: UPDATED_BANK.name,
      });

      expect(RESULT.name).toBe(UPDATED_BANK.name);

      const saved = await unitOfWork.banks.findById(
        EntityId.create(ID.BANK.DEFAULT),
      );
      expect(saved?.name).toBe(UPDATED_BANK.name);
    });

    it("changes the code of a bank", async () => {
      unitOfWork.seed({ users: [MANAGER], banks: [BANK] });

      const RESULT = await updateBank(unitOfWork as never, {
        actorId: MANAGER_ID,
        bankId: ID.BANK.DEFAULT,
        code: "999",
      });

      expect(RESULT.code).toBe("999");
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the new code collides", async () => {
      unitOfWork.seed({ users: [MANAGER], banks: [BANK, OTHER_BANK] });

      await expect(
        updateBank(unitOfWork as never, {
          actorId: MANAGER_ID,
          bankId: ID.BANK.DEFAULT,
          code: OTHER_BANK.code,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the bank does not exist", async () => {
      unitOfWork.seed({ users: [MANAGER] });

      await expect(
        updateBank(unitOfWork as never, {
          actorId: MANAGER_ID,
          bankId: "00000000-0000-4000-8000-000000000000",
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({ users: [MANAGER], banks: [BANK] });

      await expect(
        updateBank(unitOfWork as never, {
          actorId: EntityId.create(ID.USER.DEFAULT).toString(),
          bankId: ID.BANK.DEFAULT,
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
