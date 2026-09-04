import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  NORM,
  OTHER_NORM,
} from "@/__tests__/__helpers__/interfaces/_norm.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Norm } from "@/business/entities/portfolio/norm.entity";
import { listNormsByCategory } from "@/business/use-cases/norm/list-norms-by-category.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("listNormsByCategory", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns norms belonging to the category", async () => {
      unitOfWork.seed({ norms: [NORM, OTHER_NORM] });

      const RESULT = await listNormsByCategory(unitOfWork as never, {
        categoryId: ID.CATEGORY.DEFAULT,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].categoryId).toBe(ID.CATEGORY.DEFAULT);
    });

    it("returns an empty array when no norms match the category", async () => {
      unitOfWork.seed({ norms: [OTHER_NORM] });

      const RESULT = await listNormsByCategory(unitOfWork as never, {
        categoryId: ID.CATEGORY.DEFAULT,
      });

      expect(RESULT).toHaveLength(0);
    });

    it("returns all norms when multiple belong to the category", async () => {
      const EXTRA_NORM = Norm.create(
        {
          articleNumber: "Art. 4",
          name: "Norma Extra",
          categoryId: EntityId.create(ID.CATEGORY.DEFAULT),
          minAllocation: SignedPercentage.create("0"),
          maxAllocation: SignedPercentage.create("10"),
          targetAllocation: SignedPercentage.create("5"),
        },
        ID.NORM.OTHER,
      );
      unitOfWork.seed({ norms: [NORM, EXTRA_NORM] });

      const RESULT = await listNormsByCategory(unitOfWork as never, {
        categoryId: ID.CATEGORY.DEFAULT,
      });

      expect(RESULT).toHaveLength(2);
    });
  });
});
