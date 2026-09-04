import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getUser } from "@/business/use-cases/user/get-user.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getUser", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the user when the actor retrieves their own record", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      const RESULT = await getUser(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        userId: ID.USER.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.USER.DEFAULT));
      expect(RESULT.name).toBe("José da Silva");
      expect(RESULT.email).toBe("jose@example.com");
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the actor tries to retrieve another user", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      await expect(
        getUser(unitOfWork as never, {
          actorId: ID.USER.DEFAULT,
          userId: ID.USER.OTHER,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the user does not exist", async () => {
      await expect(
        getUser(unitOfWork as never, {
          actorId: "00000000-0000-4000-8000-000000000000",
          userId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
