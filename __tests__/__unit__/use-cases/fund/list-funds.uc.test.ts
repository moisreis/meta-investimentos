import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  FUND,
  OTHER_FUND,
} from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listFunds } from "@/business/use-cases/fund/list-funds.uc";

describe("listFunds", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all seeded funds", async () => {
      unitOfWork.seed({ funds: [FUND, OTHER_FUND] });

      const result = await listFunds(unitOfWork as never, {});

      expect(result).toHaveLength(2);
      expect(result[0].id.toString()).toBe(ID.FUND.DEFAULT);
      expect(result[1].id.toString()).toBe(ID.FUND.OTHER);
    });

    it("returns an empty array when no funds exist", async () => {
      const result = await listFunds(unitOfWork as never, {});

      expect(result).toHaveLength(0);
    });
  });
});
