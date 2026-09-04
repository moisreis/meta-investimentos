import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  ADDITIONAL_NORM_PORTFOLIOS,
  NORM_PORTFOLIOS,
} from "@/__tests__/__helpers__/interfaces/_norms-portfolios.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listPortfolioNorms } from "@/business/use-cases/norm/list-portfolio-norms.uc";

describe("listPortfolioNorms", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns norms applied to the portfolio", async () => {
      unitOfWork.seed({ normsPortfolios: [NORM_PORTFOLIOS] });

      const RESULT = await listPortfolioNorms(unitOfWork as never, {
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].normId).toBe(ID.NORM.DEFAULT);
      expect(RESULT[0].portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
    });

    it("returns an empty array when no norms are applied", async () => {
      const RESULT = await listPortfolioNorms(unitOfWork as never, {
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(0);
    });

    it("returns only norms for the specified portfolio", async () => {
      unitOfWork.seed({
        normsPortfolios: [NORM_PORTFOLIOS, ADDITIONAL_NORM_PORTFOLIOS],
      });

      const RESULT = await listPortfolioNorms(unitOfWork as never, {
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(2);
      for (const R of RESULT) {
        expect(R.portfolioId).toBe(ID.PORTFOLIO.DEFAULT);
      }
    });
  });
});
