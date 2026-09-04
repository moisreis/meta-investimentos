import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { USER } from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getCurrentActor } from "@/business/use-cases/user/get-current-actor.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("getCurrentActor", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the current actor", async () => {
      unitOfWork.seed({ users: [USER] });

      const RESULT = await getCurrentActor(unitOfWork as never, {
        actorId: ACTOR_ID,
      });

      expect(RESULT.id).toBe(EntityId.create(ACTOR_ID));
      expect(RESULT.name).toBe("José da Silva");
      expect(RESULT.email).toBe("jose@example.com");
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the user does not exist", async () => {
      await expect(
        getCurrentActor(unitOfWork as never, {
          actorId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
