import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import { QUOTA } from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Application } from "@/business/entities/portfolio/application.entity";
import { createWithdrawal } from "@/business/use-cases/withdrawal/create-withdrawal.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const WITHDRAWAL_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents an application applied before the withdrawal date, so it can
 * pool quota quantity for the FIFO allocation.
 */
const EARLY_APPLICATION = Application.create(
  {
    positionId: EntityId.create(ID.POSITION.DEFAULT),
    date: new Date("2026-01-02T00:00:00.000Z"),
    amount: PositiveMoney.create("1000.00"),
    quotas: QuotaQuantity.create("12.345"),
  },
  ID.APPLICATION.DEFAULT,
);

/**
 * Represents a quota priced at `1000.00` on the withdrawal date.
 */
const QUOTA_ON_DATE = QUOTA;

describe("createWithdrawal", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a withdrawal and its FIFO allocation atomically", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [EARLY_APPLICATION],
        quotas: [QUOTA_ON_DATE],
      });

      const RESULT = await createWithdrawal(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        date: WITHDRAWAL_DATE,
        amount: "500.00",
      });

      expect(RESULT.positionId).toBe(ID.POSITION.DEFAULT);
      expect(RESULT.amount).toBe("500");
      expect(RESULT.quotas).toBe("0.5");
      expect(RESULT.reversedAt).toBeNull();

      const saved = await unitOfWork.withdrawals.findById(
        EntityId.create(RESULT.id),
      );
      expect(saved).not.toBeNull();

      const allocations =
        await unitOfWork.transactionAllocations.findAllByWithdrawalId(
          EntityId.create(RESULT.id),
        );
      expect(allocations).toHaveLength(1);
      expect(allocations[0].applicationId).toBe(ID.APPLICATION.DEFAULT);
      expect(allocations[0].quotasConsumed.value.toString()).toBe("0.5");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [EARLY_APPLICATION],
        quotas: [QUOTA_ON_DATE],
      });

      await createWithdrawal(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        date: WITHDRAWAL_DATE,
        amount: "500.00",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [EARLY_APPLICATION],
        quotas: [QUOTA_ON_DATE],
      });

      await expect(
        createWithdrawal(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          positionId: ID.POSITION.DEFAULT,
          date: WITHDRAWAL_DATE,
          amount: "500.00",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("allows an editor to create a withdrawal", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [EARLY_APPLICATION],
        quotas: [QUOTA_ON_DATE],
        portfolioPermissions: [
          {
            id: EntityId.create("7a7b7c7d-7e7f-4a8b-9c0d-1e2f3a4b5c6d"),
            userId: EntityId.create(ID.USER.OTHER),
            portfolioId: PORTFOLIO.id as EntityId,
            role: "EDITOR" as const,
            grantedByUserId: PORTFOLIO.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never,
        ],
      });

      const RESULT = await createWithdrawal(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        positionId: ID.POSITION.DEFAULT,
        date: WITHDRAWAL_DATE,
        amount: "500.00",
      });

      expect(RESULT.positionId).toBe(ID.POSITION.DEFAULT);
    });

    it("rejects a viewer role when mutating", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [EARLY_APPLICATION],
        quotas: [QUOTA_ON_DATE],
      });

      const VIEWER = {
        id: EntityId.create("7a7b7c7d-7e7f-4a8b-9c0d-1e2f3a4b5c6d"),
        userId: EntityId.create(ID.USER.OTHER),
        portfolioId: PORTFOLIO.id as EntityId,
        role: "VIEWER" as const,
        grantedByUserId: PORTFOLIO.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [EARLY_APPLICATION],
        quotas: [QUOTA_ON_DATE],
        portfolioPermissions: [VIEWER as never],
      });

      await expect(
        createWithdrawal(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          positionId: ID.POSITION.DEFAULT,
          date: WITHDRAWAL_DATE,
          amount: "500.00",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the position does not exist", async () => {
      await expect(
        createWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          date: WITHDRAWAL_DATE,
          amount: "500.00",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the fund has no quota on the date", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [EARLY_APPLICATION],
      });

      await expect(
        createWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          date: WITHDRAWAL_DATE,
          amount: "500.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when the position holds too few poolable quotas", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [
          Application.create(
            {
              positionId: EntityId.create(ID.POSITION.DEFAULT),
              date: new Date("2026-01-02T00:00:00.000Z"),
              amount: PositiveMoney.create("10.00"),
              quotas: QuotaQuantity.create("0.01"),
            },
            ID.APPLICATION.DEFAULT,
          ),
        ],
        quotas: [QUOTA_ON_DATE],
      });

      await expect(
        createWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          date: WITHDRAWAL_DATE,
          amount: "500.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("rollback", () => {
    it("does not persist the withdrawal when allocation fails", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [
          Application.create(
            {
              positionId: EntityId.create(ID.POSITION.DEFAULT),
              date: new Date("2026-01-02T00:00:00.000Z"),
              amount: PositiveMoney.create("10.00"),
              quotas: QuotaQuantity.create("0.01"),
            },
            ID.APPLICATION.DEFAULT,
          ),
        ],
        quotas: [QUOTA_ON_DATE],
      });

      await expect(
        createWithdrawal(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          date: WITHDRAWAL_DATE,
          amount: "500.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);

      const withdrawals = await unitOfWork.withdrawals.findAllByPositionId(
        EntityId.create(ID.POSITION.DEFAULT),
      );
      expect(withdrawals).toHaveLength(0);

      const allocations =
        await unitOfWork.transactionAllocations.findAllByApplicationId(
          EntityId.create(ID.APPLICATION.DEFAULT),
        );
      expect(allocations).toHaveLength(0);
    });
  });
});
