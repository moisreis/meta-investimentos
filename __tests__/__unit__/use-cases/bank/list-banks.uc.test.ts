import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  BANK,
  OTHER_BANK,
} from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listBanks } from "@/business/use-cases/bank/list-banks.uc";

describe("listBanks", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all seeded banks", async () => {
      unitOfWork.seed({ banks: [BANK, OTHER_BANK] });

      const result = await listBanks(unitOfWork as never, {});

      expect(result).toHaveLength(2);
      expect(result[0].id.toString()).toBe(ID.BANK.DEFAULT);
      expect(result[1].id.toString()).toBe(ID.BANK.OTHER);
    });

    it("returns an empty array when no banks exist", async () => {
      const result = await listBanks(unitOfWork as never, {});

      expect(result).toHaveLength(0);
    });
  });
});
