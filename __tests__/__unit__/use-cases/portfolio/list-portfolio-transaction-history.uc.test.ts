import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_PORTFOLIO,
  PORTFOLIO,
} from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { USER } from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { listPortfolioTransactionHistory } from "@/business/use-cases/portfolio/list-portfolio-transaction-history.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("listPortfolioTransactionHistory", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns combined applications and withdrawals sorted by date", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      const application = Application.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-01-01T00:00:00.000Z"),
          amount: PositiveMoney.create("10000.00"),
          quotas: QuotaQuantity.create("10.0"),
        },
        ID.APPLICATION.DEFAULT,
      );

      const withdrawal = Withdrawal.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-01-15T00:00:00.000Z"),
          amount: PositiveMoney.create("2000.00"),
          quotas: QuotaQuantity.create("2.0"),
        },
        ID.WITHDRAWAL.DEFAULT,
      );

      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [position],
        applications: [application],
        withdrawals: [withdrawal],
      });

      const RESULT = await listPortfolioTransactionHistory(
        unitOfWork as never,
        {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        },
      );

      expect(RESULT.portfolioId.toString()).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.transactions).toHaveLength(2);

      expect(RESULT.transactions[0].kind).toBe("application");
      expect(RESULT.transactions[0].amount).toBe("10000");
      expect(RESULT.transactions[0].quotas).toBe("10");

      expect(RESULT.transactions[1].kind).toBe("withdrawal");
      expect(RESULT.transactions[1].amount).toBe("2000");
      expect(RESULT.transactions[1].quotas).toBe("2");
    });

    it("returns empty transactions when portfolio has no positions", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
      });

      const RESULT = await listPortfolioTransactionHistory(
        unitOfWork as never,
        {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        },
      );

      expect(RESULT.transactions).toHaveLength(0);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the portfolio is not accessible", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [OTHER_PORTFOLIO],
      });

      await expect(
        listPortfolioTransactionHistory(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
