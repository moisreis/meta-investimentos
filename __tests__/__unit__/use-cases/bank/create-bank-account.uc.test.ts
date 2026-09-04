import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK } from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { createBankAccount } from "@/business/use-cases/bank/create-bank-account.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;
const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

describe("createBankAccount", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a bank account when the actor owns the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        banks: [BANK],
      });

      const RESULT = await createBankAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: PORTFOLIO_ID,
        bankId: ID.BANK.DEFAULT,
        agency: "0001",
        accountNumber: "12345-6",
      });

      expect(RESULT.portfolioId).toBe(EntityId.create(PORTFOLIO_ID));
      expect(RESULT.bankId).toBe(EntityId.create(ID.BANK.DEFAULT));
      expect(RESULT.agency).toBe("0001");
      expect(RESULT.accountNumber).toBe("12345-6");

      const saved = await unitOfWork.bankAccounts.findById(
        EntityId.create(RESULT.id),
      );
      expect(saved).not.toBeNull();
      expect(saved?.agency).toBe("0001");
    });

    it("creates a bank account when the actor is an editor of the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        banks: [BANK],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(OTHER_ACTOR_ID),
              portfolioId: EntityId.create(PORTFOLIO_ID),
              role: "EDITOR",
              grantedByUserId: EntityId.create(ACTOR_ID),
            },
            "aaaaaaaa-bbbb-4ccc-8ddd-eeeeffff0000",
          ),
        ],
      });

      const RESULT = await createBankAccount(unitOfWork as never, {
        actorId: OTHER_ACTOR_ID,
        portfolioId: PORTFOLIO_ID,
        bankId: ID.BANK.DEFAULT,
        agency: "0001",
        accountNumber: "12345-6",
      });

      expect(RESULT.portfolioId).toBe(EntityId.create(PORTFOLIO_ID));
      expect(unitOfWork.lastActor?.userId).toBe(
        EntityId.create(OTHER_ACTOR_ID),
      );
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO], banks: [BANK] });

      await createBankAccount(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: PORTFOLIO_ID,
        bankId: ID.BANK.DEFAULT,
        agency: "0001",
        accountNumber: "12345-6",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("access control", () => {
    it("throws NotFoundError when the actor is neither owner nor has a permission", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        createBankAccount(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: PORTFOLIO_ID,
          bankId: ID.BANK.DEFAULT,
          agency: "0001",
          accountNumber: "12345-6",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is a viewer", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(OTHER_ACTOR_ID),
              portfolioId: EntityId.create(PORTFOLIO_ID),
              role: "VIEWER",
              grantedByUserId: EntityId.create(ACTOR_ID),
            },
            "aaaaaaaa-bbbb-4ccc-8ddd-eeeeffff0000",
          ),
        ],
      });

      await expect(
        createBankAccount(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: PORTFOLIO_ID,
          bankId: ID.BANK.DEFAULT,
          agency: "0001",
          accountNumber: "12345-6",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        createBankAccount(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: PORTFOLIO_ID,
          bankId: ID.BANK.DEFAULT,
          agency: "0001",
          accountNumber: "12345-6",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the bank does not exist", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        createBankAccount(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: PORTFOLIO_ID,
          bankId: ID.BANK.OTHER,
          agency: "0001",
          accountNumber: "12345-6",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
