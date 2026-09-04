import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { STATEMENT } from "@/__tests__/__helpers__/interfaces/_statement.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getStatement } from "@/business/use-cases/statement/get-statement.uc";
import { NotFoundError } from "@/shared/errors";

describe("getStatement", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the statement when it exists", async () => {
      unitOfWork.seed({ statements: [STATEMENT] });

      const RESULT = await getStatement(unitOfWork as never, {
        statementId: ID.STATEMENT.DEFAULT,
      });

      expect(RESULT.id).toBe(ID.STATEMENT.DEFAULT);
      expect(RESULT.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.periodStart).toBe(STATEMENT.periodStart);
      expect(RESULT.periodEnd).toBe(STATEMENT.periodEnd);
      expect(RESULT.fileUrl).toBe(STATEMENT.fileUrl);
      expect(RESULT.generatedByUserId).toBe(ID.USER.DEFAULT);
      expect(RESULT.createdAt).toBe(STATEMENT.createdAt);
    });
  });

  describe("failure", () => {
    it("throws NotFoundError when the statement does not exist", async () => {
      await expect(
        getStatement(unitOfWork as never, {
          statementId: ID.STATEMENT.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
