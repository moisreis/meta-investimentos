import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createBank } from "@/business/use-cases/bank/create-bank.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("createBank", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a bank", async () => {
      const RESULT = await createBank(unitOfWork as never, {
        actorId: ACTOR_ID,
        code: "001",
        name: "Banco do Brasil",
      });

      expect(RESULT.code).toBe("001");
      expect(RESULT.name).toBe("Banco do Brasil");

      const saved = await unitOfWork.banks.findByCode("001");
      expect(saved).not.toBeNull();
      expect(saved?.code).toBe("001");
      expect(saved?.name).toBe("Banco do Brasil");
    });

    it("attributes the mutation to the actor", async () => {
      await createBank(unitOfWork as never, {
        actorId: ACTOR_ID,
        code: "001",
        name: "Banco do Brasil",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("validation", () => {
    it("throws ValidationError when a bank with the same code already exists", async () => {
      await createBank(unitOfWork as never, {
        actorId: ACTOR_ID,
        code: "001",
        name: "Banco do Brasil",
      });

      await expect(
        createBank(unitOfWork as never, {
          actorId: ACTOR_ID,
          code: "001",
          name: "Outro Banco",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
