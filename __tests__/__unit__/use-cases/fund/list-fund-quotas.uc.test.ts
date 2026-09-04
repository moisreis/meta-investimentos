import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  EXTERNAL_QUOTA,
  QUOTA,
} from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listFundQuotas } from "@/business/use-cases/fund/list-fund-quotas.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("listFundQuotas", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all quotas registered for the fund", async () => {
      unitOfWork.seed({
        quotas: [QUOTA, EXTERNAL_QUOTA],
      });

      const RESULT = await listFundQuotas(unitOfWork as never, {
        fundId: ID.FUND.DEFAULT,
      });

      expect(RESULT).toHaveLength(2);
      expect(RESULT[0].fundId).toBe(EntityId.create(ID.FUND.DEFAULT));
      expect(RESULT[1].fundId).toBe(EntityId.create(ID.FUND.DEFAULT));
    });

    it("returns an empty array when the fund has no quotas", async () => {
      const RESULT = await listFundQuotas(unitOfWork as never, {
        fundId: ID.FUND.DEFAULT,
      });

      expect(RESULT).toEqual([]);
    });
  });
});
