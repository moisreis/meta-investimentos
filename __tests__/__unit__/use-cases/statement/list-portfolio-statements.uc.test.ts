import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_STATEMENT,
  STATEMENT,
  THIRD_STATEMENT,
} from "@/__tests__/__helpers__/interfaces/_statement.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listPortfolioStatements } from "@/business/use-cases/statement/list-portfolio-statements.uc";

describe("listPortfolioStatements", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the statements of a portfolio", async () => {
      unitOfWork.seed({
        statements: [STATEMENT, OTHER_STATEMENT, THIRD_STATEMENT],
      });

      const RESULT = await listPortfolioStatements(unitOfWork as never, {
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(2);
      expect(RESULT.map((s) => s.id)).toEqual([
        ID.STATEMENT.DEFAULT,
        ID.STATEMENT.THIRD,
      ]);
    });

    it("returns an empty array when the portfolio has no statements", async () => {
      unitOfWork.seed({ statements: [OTHER_STATEMENT] });

      const RESULT = await listPortfolioStatements(unitOfWork as never, {
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toEqual([]);
    });
  });
});
