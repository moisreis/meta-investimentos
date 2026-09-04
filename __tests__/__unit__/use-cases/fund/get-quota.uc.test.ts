import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { QUOTA } from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getQuota } from "@/business/use-cases/fund/get-quota.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getQuota", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the quota DTO when found", async () => {
      unitOfWork.seed({ quotas: [QUOTA] });

      const RESULT = await getQuota(unitOfWork as never, {
        quotaId: ID.QUOTA.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.QUOTA.DEFAULT));
      expect(RESULT.fundId).toBe(EntityId.create(ID.FUND.DEFAULT));
      expect(RESULT.price).toBe("1000");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the quota does not exist", async () => {
      await expect(
        getQuota(unitOfWork as never, {
          quotaId: ID.QUOTA.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
