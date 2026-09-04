import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FUND } from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { POSITION } from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import {
  QUOTA,
  QUOTA_DATE,
} from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createQuota } from "@/business/use-cases/fund/create-quota.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const QUOTA_DATE_APRIL = new Date("2026-04-05T00:00:00.000Z");

describe("createQuota", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a quota for a fund and date", async () => {
      unitOfWork.seed({ funds: [FUND] });

      const RESULT = await createQuota(unitOfWork as never, {
        actorId: ACTOR_ID,
        fundId: ID.FUND.DEFAULT,
        date: QUOTA_DATE_APRIL,
        price: "1030.00",
      });

      expect(RESULT.fundId).toBe(EntityId.create(ID.FUND.DEFAULT));
      expect(RESULT.date).toEqual(QUOTA_DATE_APRIL);
      expect(RESULT.price).toBe("1030");

      const saved = await unitOfWork.quotas.findByFundIdAndDate(
        EntityId.create(ID.FUND.DEFAULT),
        QUOTA_DATE_APRIL,
      );
      expect(saved).not.toBeNull();
      expect(saved?.price.value.toString()).toBe("1030");
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ funds: [FUND] });

      await createQuota(unitOfWork as never, {
        actorId: ACTOR_ID,
        fundId: ID.FUND.DEFAULT,
        date: QUOTA_DATE_APRIL,
        price: "1030.00",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("recalculates the performance of the portfolios holding the fund", async () => {
      unitOfWork.seed({
        funds: [FUND],
        portfolios: [PORTFOLIO],
        positions: [POSITION],
      });

      await createQuota(unitOfWork as never, {
        actorId: ACTOR_ID,
        fundId: ID.FUND.DEFAULT,
        date: QUOTA_DATE_APRIL,
        price: "1030.00",
      });

      const rows = await unitOfWork.portfolioPerformances.findAllByPortfolioId(
        EntityId.create(ID.PORTFOLIO.DEFAULT),
      );

      expect(
        rows.some(
          (performance) =>
            performance.date.getTime() === QUOTA_DATE_APRIL.getTime(),
        ),
      ).toBe(true);

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the fund does not exist", async () => {
      await expect(
        createQuota(unitOfWork as never, {
          actorId: ACTOR_ID,
          fundId: ID.FUND.DEFAULT,
          date: QUOTA_DATE_APRIL,
          price: "1030.00",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when a quota already exists for the fund on that date", async () => {
      unitOfWork.seed({
        funds: [FUND],
        quotas: [QUOTA],
      });

      await expect(
        createQuota(unitOfWork as never, {
          actorId: ACTOR_ID,
          fundId: ID.FUND.DEFAULT,
          date: QUOTA_DATE,
          price: "1030.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("does not persist the quota when one already exists", async () => {
      unitOfWork.seed({
        funds: [FUND],
        quotas: [QUOTA],
      });

      await expect(
        createQuota(unitOfWork as never, {
          actorId: ACTOR_ID,
          fundId: ID.FUND.DEFAULT,
          date: QUOTA_DATE,
          price: "1030.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);

      const all = await unitOfWork.quotas.findAllByFundId(
        EntityId.create(ID.FUND.DEFAULT),
      );
      expect(all).toHaveLength(1);
    });
  });
});
