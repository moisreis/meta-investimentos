import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { CATEGORY } from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getCategory } from "@/business/use-cases/fund/get-category.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

describe("getCategory", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the category DTO when found", async () => {
      unitOfWork.seed({ categories: [CATEGORY] });

      const RESULT = await getCategory(unitOfWork as never, {
        categoryId: ID.CATEGORY.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.CATEGORY.DEFAULT));
      expect(RESULT.name).toBe(CATEGORY.name);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the category does not exist", async () => {
      await expect(
        getCategory(unitOfWork as never, {
          categoryId: ID.CATEGORY.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
