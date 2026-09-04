import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { deleteUser } from "@/business/use-cases/user/delete-user.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("deleteUser", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("deletes the user", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      await deleteUser(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        userId: ID.USER.DEFAULT,
      });

      const DELETED = await unitOfWork.users.findById(
        EntityId.create(ID.USER.DEFAULT),
      );
      expect(DELETED).toBeNull();
    });

    it("attributes the deletion to the actor", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      await deleteUser(unitOfWork as never, {
        actorId: ID.USER.DEFAULT,
        userId: ID.USER.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(
        EntityId.create(ID.USER.DEFAULT),
      );
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the actor tries to delete another user", async () => {
      unitOfWork.seed({ users: [USER, OTHER_USER] });

      await expect(
        deleteUser(unitOfWork as never, {
          actorId: ID.USER.DEFAULT,
          userId: ID.USER.OTHER,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the user does not exist", async () => {
      await expect(
        deleteUser(unitOfWork as never, {
          actorId: "00000000-0000-4000-8000-000000000000",
          userId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
