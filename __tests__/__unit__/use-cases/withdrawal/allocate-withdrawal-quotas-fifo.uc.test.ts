import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  APPLICATION,
  OTHER_APPLICATION,
} from "@/__tests__/__helpers__/interfaces/_application.test.helper";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import { TRANSACTION_ALLOCATION } from "@/__tests__/__helpers__/interfaces/_transaction-allocation.test.helper";
import {
  OTHER_USER,
  USER,
} from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import {
  UPDATED_WITHDRAWAL,
  WITHDRAWAL,
} from "@/__tests__/__helpers__/interfaces/_withdrawal.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { allocateWithdrawalQuotasFifoOperation } from "@/business/use-cases/withdrawal/allocate-withdrawal-quotas-fifo.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("allocateWithdrawalQuotasFifoOperation", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("allocates quotas from a single application", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [WITHDRAWAL],
      });

      const RESULT = await allocateWithdrawalQuotasFifoOperation(
        unitOfWork as never,
        {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        },
      );

      expect(RESULT).toHaveLength(1);
      expect(RESULT[0].applicationId).toBe(
        EntityId.create(ID.APPLICATION.DEFAULT),
      );
      expect(RESULT[0].withdrawId).toBe(EntityId.create(ID.WITHDRAWAL.DEFAULT));
    });

    it("allocates quotas across multiple applications in FIFO order", async () => {
      const LARGE_WD = Withdrawal.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-03-01T00:00:00.000Z"),
          amount: PositiveMoney.create("1500.00"),
          quotas: QuotaQuantity.create("15"),
        },
        ID.WITHDRAWAL.DEFAULT,
      );

      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION, OTHER_APPLICATION],
        withdrawals: [LARGE_WD],
      });

      const RESULT = await allocateWithdrawalQuotasFifoOperation(
        unitOfWork as never,
        {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        },
      );

      expect(RESULT).toHaveLength(2);
      expect(RESULT[0].applicationId).toBe(
        EntityId.create(ID.APPLICATION.DEFAULT),
      );
      expect(RESULT[1].applicationId).toBe(
        EntityId.create(ID.APPLICATION.OTHER),
      );
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [WITHDRAWAL],
      });

      await allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
        actorId: ACTOR_ID,
        withdrawalId: ID.WITHDRAWAL.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("succeeds when the actor has EDITOR permission", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [WITHDRAWAL],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(ID.USER.OTHER),
              portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
              role: "EDITOR",
              grantedByUserId: EntityId.create(ID.USER.DEFAULT),
            },
            "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
          ),
        ],
      });

      const RESULT = await allocateWithdrawalQuotasFifoOperation(
        unitOfWork as never,
        {
          actorId: ID.USER.OTHER,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        },
      );

      expect(RESULT).toHaveLength(1);
    });
  });

  describe("error", () => {
    it("throws NotFoundError when the withdrawal does not exist", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when the withdrawal is reversed", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [UPDATED_WITHDRAWAL],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws NotFoundError when the position does not exist", async () => {
      const W = Withdrawal.create(
        {
          positionId: EntityId.create("00000000-0000-4000-8000-000000000000"),
          date: new Date("2026-01-20T00:00:00.000Z"),
          amount: PositiveMoney.create("500.00"),
          quotas: QuotaQuantity.create("6.123"),
        },
        ID.WITHDRAWAL.DEFAULT,
      );

      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        withdrawals: [W],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no mutate access", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [WITHDRAWAL],
        portfolioPermissions: [
          PortfolioPermission.create(
            {
              userId: EntityId.create(ID.USER.OTHER),
              portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
              role: "VIEWER",
              grantedByUserId: EntityId.create(ID.USER.DEFAULT),
            },
            "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
          ),
        ],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access at all", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [WITHDRAWAL],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws ValidationError when the withdrawal is already allocated", async () => {
      unitOfWork.seed({
        users: [USER, OTHER_USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [WITHDRAWAL],
        transactionAllocations: [TRANSACTION_ALLOCATION],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when there are no poolable quotas", async () => {
      const W = Withdrawal.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2025-01-01T00:00:00.000Z"),
          amount: PositiveMoney.create("500.00"),
          quotas: QuotaQuantity.create("6.123"),
        },
        ID.WITHDRAWAL.DEFAULT,
      );

      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [W],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when poolable quotas are insufficient", async () => {
      const W = Withdrawal.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-01-20T00:00:00.000Z"),
          amount: PositiveMoney.create("99999.00"),
          quotas: QuotaQuantity.create("99999"),
        },
        ID.WITHDRAWAL.DEFAULT,
      );

      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        applications: [APPLICATION],
        withdrawals: [W],
      });

      await expect(
        allocateWithdrawalQuotasFifoOperation(unitOfWork as never, {
          actorId: ACTOR_ID,
          withdrawalId: ID.WITHDRAWAL.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
