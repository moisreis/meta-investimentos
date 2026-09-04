import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK } from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getBank } from "@/business/use-cases/bank/get-bank.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getBank", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the bank when it exists", async () => {
      unitOfWork.seed({ banks: [BANK] });

      const RESULT = await getBank(unitOfWork as never, {
        bankId: ID.BANK.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.BANK.DEFAULT));
      expect(RESULT.code).toBe("001");
      expect(RESULT.name).toBe("Banco do Brasil");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the bank does not exist", async () => {
      await expect(
        getBank(unitOfWork as never, { bankId: ID.BANK.DEFAULT }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
