import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  BANK_ACCOUNT,
  THIRD_BANK_ACCOUNT,
} from "@/__tests__/__helpers__/interfaces/_bank-account.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listPortfolioBankAccounts } from "@/business/use-cases/bank/list-portfolio-bank-accounts.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";

const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

describe("listPortfolioBankAccounts", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the bank accounts of the portfolio", async () => {
      unitOfWork.seed({ bankAccounts: [BANK_ACCOUNT, THIRD_BANK_ACCOUNT] });

      const RESULT = await listPortfolioBankAccounts(unitOfWork as never, {
        portfolioId: PORTFOLIO_ID,
      });

      expect(RESULT).toHaveLength(2);
      expect(RESULT[0].portfolioId).toBe(EntityId.create(PORTFOLIO_ID));
    });

    it("returns an empty list when the portfolio has no bank accounts", async () => {
      const RESULT = await listPortfolioBankAccounts(unitOfWork as never, {
        portfolioId: PORTFOLIO_ID,
      });

      expect(RESULT).toEqual([]);
    });
  });
});
