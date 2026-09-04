import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FUND } from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getFund } from "@/business/use-cases/fund/get-fund.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getFund", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the fund DTO when found", async () => {
      unitOfWork.seed({ funds: [FUND] });

      const RESULT = await getFund(unitOfWork as never, {
        fundId: ID.FUND.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.FUND.DEFAULT));
      expect(RESULT.name).toBe(FUND.name);
      expect(RESULT.cnpj).toBe(FUND.cnpj.value);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the fund does not exist", async () => {
      await expect(
        getFund(unitOfWork as never, {
          fundId: ID.FUND.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
