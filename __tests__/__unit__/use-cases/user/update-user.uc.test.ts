import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { updateUser } from "@/business/use-cases/user/update-user.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("updateUser", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("updates the user's profile fields", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      const RESULT = await updateUser(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        userId: ID.USER.DEFAULT,
        lastName: "da Silva Junior",
      });

      expect(RESULT.id).toBe(EntityId.create(ID.USER.DEFAULT));
      expect(RESULT.lastName).toBe("da Silva Junior");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      await updateUser(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        userId: ID.USER.DEFAULT,
        name: "José da Silva Updated",
      });

      expect(unitOfWork.lastActor?.userId).toBe(
        EntityId.create(ID.USER.DEFAULT),
      );
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the actor tries to update another user", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      await expect(
        updateUser(unitOfWork as never, {
          actorId: ID.USER.DEFAULT,
          userId: ID.USER.OTHER,
          name: "Hacker",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the user does not exist", async () => {
      await expect(
        updateUser(unitOfWork as never, {
          actorId: "00000000-0000-4000-8000-000000000000",
          userId: "00000000-0000-4000-8000-000000000000",
          name: "Ghost",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
