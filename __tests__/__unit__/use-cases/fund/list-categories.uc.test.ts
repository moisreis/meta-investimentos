import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  CATEGORY,
  OTHER_CATEGORY,
} from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listCategories } from "@/business/use-cases/fund/list-categories.uc";

describe("listCategories", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all seeded categories", async () => {
      unitOfWork.seed({ categories: [CATEGORY, OTHER_CATEGORY] });

      const result = await listCategories(unitOfWork as never, {});

      expect(result).toHaveLength(2);
      expect(result[0].id.toString()).toBe(ID.CATEGORY.DEFAULT);
      expect(result[1].id.toString()).toBe(ID.CATEGORY.OTHER);
    });

    it("returns an empty array when no categories exist", async () => {
      const result = await listCategories(unitOfWork as never, {});

      expect(result).toHaveLength(0);
    });
  });
});
