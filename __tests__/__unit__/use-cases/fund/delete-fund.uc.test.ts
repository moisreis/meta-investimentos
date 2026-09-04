import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FUND } from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { deleteFund } from "@/business/use-cases/fund/delete-fund.uc";
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

describe("deleteFund", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("deletes a fund", async () => {
      unitOfWork.seed({ users: [MANAGER], funds: [FUND] });

      await deleteFund(unitOfWork as never, {
        actorId: MANAGER_ID,
        fundId: ID.FUND.DEFAULT,
      });

      const deleted = await unitOfWork.funds.findById(
        EntityId.create(ID.FUND.DEFAULT),
      );
      expect(deleted).toBeNull();
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ users: [MANAGER], funds: [FUND] });

      await deleteFund(unitOfWork as never, {
        actorId: MANAGER_ID,
        fundId: ID.FUND.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(MANAGER_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the fund does not exist", async () => {
      unitOfWork.seed({ users: [MANAGER] });

      await expect(
        deleteFund(unitOfWork as never, {
          actorId: MANAGER_ID,
          fundId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({ users: [MANAGER], funds: [FUND] });

      await expect(
        deleteFund(unitOfWork as never, {
          actorId: EntityId.create(ID.USER.DEFAULT).toString(),
          fundId: ID.FUND.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
