import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  EARLIER_QUOTA,
  LATEST_QUOTA,
} from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getLatestQuota } from "@/business/use-cases/fund/get-latest-quota.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getLatestQuota", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the newest quota by date", async () => {
      unitOfWork.seed({
        quotas: [EARLIER_QUOTA, LATEST_QUOTA],
      });

      const RESULT = await getLatestQuota(unitOfWork as never, {
        fundId: ID.FUND.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(LATEST_QUOTA.id as string));
      expect(RESULT.price).toBe("11");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the fund has no quota", async () => {
      await expect(
        getLatestQuota(unitOfWork as never, {
          fundId: ID.FUND.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
