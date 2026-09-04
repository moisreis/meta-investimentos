import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { NORM } from "@/__tests__/__helpers__/interfaces/_norm.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getNorm } from "@/business/use-cases/norm/get-norm.uc";
import { NotFoundError } from "@/shared/errors";

describe("getNorm", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the norm when it exists", async () => {
      unitOfWork.seed({ norms: [NORM] });

      const RESULT = await getNorm(unitOfWork as never, {
        normId: ID.NORM.DEFAULT,
      });

      expect(RESULT.id).toBe(ID.NORM.DEFAULT);
      expect(RESULT.articleNumber).toBe("Art. 1");
      expect(RESULT.name).toBe("Política de Investimento");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the norm does not exist", async () => {
      await expect(
        getNorm(unitOfWork as never, { normId: ID.NORM.DEFAULT }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
